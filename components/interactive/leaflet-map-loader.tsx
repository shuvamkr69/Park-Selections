"use client";

/**
 * Client-side loader for the Leaflet map. A separate file is required because
 * `dynamic({ ssr: false })` cannot be called inside a Server Component - this
 * module is imported as a Client Component boundary.
 */

import dynamic from "next/dynamic";

export const LeafletMapLoader = dynamic(
  () =>
    import("@/components/interactive/leaflet-map").then((m) => m.LeafletMap),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 animate-pulse bg-muted" />,
  },
);
