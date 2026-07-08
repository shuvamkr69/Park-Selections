import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";
import { ROOMS } from "@/constants/rooms";
import { EVENTS } from "@/constants/events";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  const staticRoutes = ["", "/about", "/rooms", "/events", "/dining", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const roomRoutes = ROOMS.map((room) => ({
    url: `${base}/rooms/${room.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const eventRoutes = EVENTS.map((event) => ({
    url: `${base}/events/${event.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...roomRoutes, ...eventRoutes];
}
