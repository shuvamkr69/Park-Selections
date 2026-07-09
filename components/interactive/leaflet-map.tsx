"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SITE } from "@/constants/site";
import { formatPhone } from "@/lib/utils";

const HOTEL_LAT = 20.3553;
const HOTEL_LNG = 85.8194;
const ZOOM = 15;

/** Fraction of the map width to shift the pin left of centre on desktop,
 *  so the marker lands in the middle of the open left column (form sits right). */
const DESKTOP_LEFT_SHIFT = 0.25;

const TILES = {
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
} as const;

const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/" target="_blank" rel="noopener">CARTO</a>';

function resolvedTheme(): "light" | "dark" {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function popupHtml(accent: string): string {
  const { contact, name } = SITE;
  const { address } = contact;
  return `
    <div style="font-family:inherit;line-height:1.5;min-width:190px">
      <strong style="display:block;font-size:14px;margin-bottom:4px">${name}</strong>
      <span style="display:block;color:#5b5b5b;font-size:12px">
        ${address.line1}<br/>
        ${address.city}, ${address.state} ${address.postalCode}
      </span>
      <div style="margin-top:8px;font-size:12px;display:flex;flex-direction:column;gap:2px">
        <a href="tel:${contact.phone}" style="color:${accent};font-weight:600;text-decoration:none">
          ${formatPhone(contact.phone)}
        </a>
        <a href="mailto:${contact.email}" style="color:${accent};text-decoration:none">
          ${contact.email}
        </a>
      </div>
    </div>`;
}

export function LeafletMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const theme = resolvedTheme();

    const map = L.map(el, {
      center: [HOTEL_LAT, HOTEL_LNG],
      zoom: ZOOM,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const tileLayer = L.tileLayer(TILES[theme], {
      attribution: ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);

    // Gold teardrop marker matching the accent CSS variable.
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#b8935a";

    const icon = L.divIcon({
      className: "",
      html: `<svg width="34" height="46" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="filter:drop-shadow(0 3px 6px rgba(0,0,0,.45))"><path d="M15 0C6.716 0 0 6.716 0 15c0 9.5 15 25 15 25s15-15.5 15-25C30 6.716 23.284 0 15 0z" fill="${accent}"/><circle cx="15" cy="15" r="6.5" fill="white"/></svg>`,
      iconSize: [34, 46],
      iconAnchor: [17, 46],
      popupAnchor: [0, -46],
    });

    const marker = L.marker([HOTEL_LAT, HOTEL_LNG], {
      icon,
      title: SITE.name,
      alt: `${SITE.name} location`,
      keyboard: true,
    })
      .addTo(map)
      .bindPopup(popupHtml(accent), {
        autoClose: false,
        closeOnClick: false,
        autoPan: false, // don't fight the manual left-shift offset
        className: "ps-map-popup",
      });

    // Position the pin: centre of the section on mobile, centre of the open
    // left column on desktop (the form occupies the right column).
    const positionPin = () => {
      map.setView([HOTEL_LAT, HOTEL_LNG], ZOOM, { animate: false });
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop) {
        const width = map.getSize().x;
        // Positive x shifts the map pane left, moving the marker toward the left.
        map.panBy([width * DESKTOP_LEFT_SHIFT, 0], { animate: false });
      }
      marker.openPopup();
    };

    // Run once the map has laid out, then keep it correct on resize.
    map.whenReady(positionPin);

    const onResize = () => {
      map.invalidateSize({ animate: false });
      positionPin();
    };
    window.addEventListener("resize", onResize);

    // Switch tile URL whenever data-theme changes.
    const observer = new MutationObserver(() => {
      tileLayer.setUrl(TILES[resolvedTheme()]);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      map.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ zIndex: 0 }}
      role="application"
      aria-label="Interactive map showing Park Selections Hotel on KIIT Road, Bhubaneswar"
    />
  );
}
