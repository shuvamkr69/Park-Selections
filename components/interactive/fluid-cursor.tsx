"use client";

import { useEffect, useRef } from "react";

/**
 * Lusion-style cursor fog - a GPU stable-fluids simulation (advection,
 * vorticity confinement, Jacobi pressure solve) driven by pointer movement.
 * The dye is the brand gold accent and a buoyancy "sink" force makes the fog
 * flow downward and dissolve.
 *
 * Adapted for the light Park Selections theme: rather than the dark-theme
 * `mix-blend-screen` trick, the fog is rendered on a transparent,
 * premultiplied-alpha canvas with alpha driven by dye density, so the gold
 * reads correctly over both the ivory background and the dark green sections.
 *
 * Gracefully does nothing on touch devices, with reduced motion, or without
 * WebGL2 float render targets.
 */

// Brand accent (hex) → normalized rgb. The live colour is read from the
// --accent CSS variable (app/theme.css) at runtime; see the effect below.
function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

const config = {
  SIM_RESOLUTION: 128, // velocity / pressure grid
  DYE_RESOLUTION: 720, // fog texture
  DENSITY_DISSIPATION: 3.2, // how fast the fog fades (higher = faster)
  VELOCITY_DISSIPATION: 0.8, // how fast motion settles
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 20,
  CURL: 16, // vorticity - swirliness of the fog
  SPLAT_RADIUS: 0.08,
  SPLAT_FORCE: 3800,
  SINK: 200, // downward pull per unit of fog density
  DYE_COLOR: hexToRgb01("#b8935a"), // default; overridden at runtime from --accent
  DYE_INTENSITY: 0.12,
};

/* ------------------------------ shaders ------------------------------ */

const VERT = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAG_SPLAT = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const FRAG_ADVECTION = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`;

const FRAG_DIVERGENCE = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const FRAG_CURL = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

const FRAG_VORTICITY = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * dt;
    velocity = min(max(velocity, -1000.0), 1000.0);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const FRAG_PRESSURE = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const FRAG_GRADIENT_SUBTRACT = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const FRAG_CLEAR = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

// Density-driven downward force: dense fog sinks (inverse buoyancy).
const FRAG_SINK = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uDye;
  uniform float uSink;
  uniform float dt;
  void main () {
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    vec3 d = texture2D(uDye, vUv).rgb;
    float density = max(d.r, max(d.g, d.b));
    velocity.y -= uSink * density * dt;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

// Display to a transparent, premultiplied canvas: rgb carries the (already
// density-scaled) gold, alpha is the fog density so it composites cleanly
// over both light and dark sections of the page.
const FRAG_DISPLAY = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;
    float a = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
    gl_FragColor = vec4(c, a);
  }
`;

/* ----------------------------- component ----------------------------- */

interface FBO {
  fbo: WebGLFramebuffer;
  texture: WebGLTexture;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}

interface DoubleFBO {
  read: FBO;
  write: FBO;
  swap: () => void;
  texelSizeX: number;
  texelSizeY: number;
}

export function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only for fine pointers, and never with reduced motion.
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: true,
    }) as WebGL2RenderingContext | null;
    if (!gl) return;
    if (!gl.getExtension("EXT_color_buffer_float")) return;
    gl.getExtension("OES_texture_float_linear");

    // Read the brand accent from the single CSS source (app/theme.css) so the
    // fog colour always matches the active theme.
    const accentHex = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    if (accentHex) config.DYE_COLOR = hexToRgb01(accentHex);

    let destroyed = false;
    let raf = 0;

    /* ------------------------- GL plumbing ------------------------- */

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertShader = compile(gl.VERTEX_SHADER, VERT);

    class Program {
      program: WebGLProgram;
      uniforms: Record<string, WebGLUniformLocation | null> = {};
      constructor(fragSource: string) {
        this.program = gl!.createProgram()!;
        gl!.attachShader(this.program, vertShader);
        gl!.attachShader(
          this.program,
          compile(gl!.FRAGMENT_SHADER, fragSource),
        );
        gl!.bindAttribLocation(this.program, 0, "aPosition");
        gl!.linkProgram(this.program);
        const count = gl!.getProgramParameter(
          this.program,
          gl!.ACTIVE_UNIFORMS,
        );
        for (let i = 0; i < count; i++) {
          const name = gl!.getActiveUniform(this.program, i)!.name;
          this.uniforms[name] = gl!.getUniformLocation(this.program, name);
        }
      }
      bind() {
        gl!.useProgram(this.program);
      }
    }

    const splatProgram = new Program(FRAG_SPLAT);
    const advectionProgram = new Program(FRAG_ADVECTION);
    const divergenceProgram = new Program(FRAG_DIVERGENCE);
    const curlProgram = new Program(FRAG_CURL);
    const vorticityProgram = new Program(FRAG_VORTICITY);
    const pressureProgram = new Program(FRAG_PRESSURE);
    const gradientProgram = new Program(FRAG_GRADIENT_SUBTRACT);
    const clearProgram = new Program(FRAG_CLEAR);
    const sinkProgram = new Program(FRAG_SINK);
    const displayProgram = new Program(FRAG_DISPLAY);

    // Fullscreen quad
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );
    const index = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW,
    );
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const blit = (target: FBO | null) => {
      if (target === null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    const createFBO = (
      w: number,
      h: number,
      internalFormat: number,
      format: number,
    ): FBO => {
      const texture = gl.createTexture()!;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        gl.HALF_FLOAT,
        null,
      );
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0,
      );
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        fbo,
        texture,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    };

    const createDoubleFBO = (
      w: number,
      h: number,
      internalFormat: number,
      format: number,
    ): DoubleFBO => {
      let read = createFBO(w, h, internalFormat, format);
      let write = createFBO(w, h, internalFormat, format);
      return {
        get read() {
          return read;
        },
        get write() {
          return write;
        },
        swap() {
          const tmp = read;
          read = write;
          write = tmp;
        },
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
      } as DoubleFBO;
    };

    const getResolution = (resolution: number) => {
      let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspect < 1) aspect = 1 / aspect;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspect);
      return gl.drawingBufferWidth > gl.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    };

    /* --------------------------- sim state -------------------------- */

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curl: FBO;
    let pressure: DoubleFBO;

    const initFramebuffers = () => {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, gl.RGBA16F, gl.RGBA);
      velocity = createDoubleFBO(simRes.width, simRes.height, gl.RG16F, gl.RG);
      divergence = createFBO(simRes.width, simRes.height, gl.R16F, gl.RED);
      curl = createFBO(simRes.width, simRes.height, gl.R16F, gl.RED);
      pressure = createDoubleFBO(simRes.width, simRes.height, gl.R16F, gl.RED);
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        initFramebuffers();
      }
    };

    resizeCanvas();

    /* ---------------------------- pointer --------------------------- */

    const pointer = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      moved: false,
      down: false,
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      if (pointer.down) {
        pointer.dx += (x - pointer.x) * config.SPLAT_FORCE;
        pointer.dy += (y - pointer.y) * config.SPLAT_FORCE;
        pointer.moved = true;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.down = true;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    /* ----------------------------- steps ---------------------------- */

    const splat = (x: number, y: number, dx: number, dy: number) => {
      const aspect = canvas.width / canvas.height;
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget!, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio!, aspect);
      gl.uniform2f(splatProgram.uniforms.point!, x, y);
      gl.uniform3f(splatProgram.uniforms.color!, dx, dy, 0);
      gl.uniform1f(
        splatProgram.uniforms.radius!,
        (config.SPLAT_RADIUS / 100) * (aspect > 1 ? aspect : 1),
      );
      blit(velocity.write);
      velocity.swap();

      // Dye amount scales gently with speed so fast strokes glow more.
      const speed = Math.min(Math.hypot(dx, dy) / 900, 1.2);
      const k = config.DYE_INTENSITY * (0.45 + speed);
      gl.uniform1i(splatProgram.uniforms.uTarget!, dye.read.attach(0));
      gl.uniform3f(
        splatProgram.uniforms.color!,
        config.DYE_COLOR[0] * k,
        config.DYE_COLOR[1] * k,
        config.DYE_COLOR[2] * k,
      );
      blit(dye.write);
      dye.swap();
    };

    const step = (dt: number) => {
      gl.disable(gl.BLEND);

      // Downward sink force from fog density.
      sinkProgram.bind();
      gl.uniform1i(sinkProgram.uniforms.uVelocity!, velocity.read.attach(0));
      gl.uniform1i(sinkProgram.uniforms.uDye!, dye.read.attach(1));
      gl.uniform1f(sinkProgram.uniforms.uSink!, config.SINK);
      gl.uniform1f(sinkProgram.uniforms.dt!, dt);
      blit(velocity.write);
      velocity.swap();

      curlProgram.bind();
      gl.uniform2f(
        curlProgram.uniforms.texelSize!,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl.uniform1i(curlProgram.uniforms.uVelocity!, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      gl.uniform2f(
        vorticityProgram.uniforms.texelSize!,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl.uniform1i(
        vorticityProgram.uniforms.uVelocity!,
        velocity.read.attach(0),
      );
      gl.uniform1i(vorticityProgram.uniforms.uCurl!, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl!, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt!, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(
        divergenceProgram.uniforms.texelSize!,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl.uniform1i(
        divergenceProgram.uniforms.uVelocity!,
        velocity.read.attach(0),
      );
      blit(divergence);

      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture!, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value!, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(
        pressureProgram.uniforms.texelSize!,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl.uniform1i(pressureProgram.uniforms.uDivergence!, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(
          pressureProgram.uniforms.uPressure!,
          pressure.read.attach(1),
        );
        blit(pressure.write);
        pressure.swap();
      }

      gradientProgram.bind();
      gl.uniform2f(
        gradientProgram.uniforms.texelSize!,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl.uniform1i(
        gradientProgram.uniforms.uPressure!,
        pressure.read.attach(0),
      );
      gl.uniform1i(
        gradientProgram.uniforms.uVelocity!,
        velocity.read.attach(1),
      );
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      gl.uniform2f(
        advectionProgram.uniforms.texelSize!,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl.uniform1i(
        advectionProgram.uniforms.uVelocity!,
        velocity.read.attach(0),
      );
      gl.uniform1i(advectionProgram.uniforms.uSource!, velocity.read.attach(0));
      gl.uniform1f(advectionProgram.uniforms.dt!, dt);
      gl.uniform1f(
        advectionProgram.uniforms.dissipation!,
        config.VELOCITY_DISSIPATION,
      );
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(
        advectionProgram.uniforms.uVelocity!,
        velocity.read.attach(0),
      );
      gl.uniform1i(advectionProgram.uniforms.uSource!, dye.read.attach(1));
      gl.uniform1f(
        advectionProgram.uniforms.dissipation!,
        config.DENSITY_DISSIPATION,
      );
      blit(dye.write);
      dye.swap();
    };

    const render = () => {
      // Redraw the full fog from the dye texture each frame onto a cleared,
      // transparent canvas, using premultiplied-alpha blending so it
      // composites cleanly over both light and dark sections.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      displayProgram.bind();
      gl.uniform1i(displayProgram.uniforms.uTexture!, dye.read.attach(0));
      blit(null);
      gl.disable(gl.BLEND);
    };

    /* ----------------------------- loop ----------------------------- */

    let last = performance.now();
    const frame = (now: number) => {
      if (destroyed) return;
      const dt = Math.min((now - last) / 1000, 1 / 60);
      last = now;

      resizeCanvas();

      if (pointer.moved) {
        pointer.moved = false;
        splat(pointer.x, pointer.y, pointer.dx, pointer.dy);
        pointer.dx = 0;
        pointer.dy = 0;
      }

      step(dt);
      render();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      // Note: we deliberately do NOT call WEBGL_lose_context here. Under React
      // StrictMode (and HMR) the effect mounts twice on the same <canvas>;
      // losing the context in the first cleanup would leave the second mount
      // with a permanently lost context. GPU memory is reclaimed when the
      // canvas is garbage-collected.
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
}
