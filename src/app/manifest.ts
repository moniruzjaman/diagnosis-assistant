import type { MetadataRoute } from "next";

// Required for static export (output: 'export') — manifest is generated at
// build time, never dynamically.
export const dynamic = "force-static";

const BASE = "/diagnosis-assistant";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `${BASE}/`,
    name: "CABI Plant Diagnosis Assistant",
    short_name: "CABI Plant",
    description:
      "An interactive digital guide to identify crop diseases and pests using visual symptom categories from the CABI Plantwise Field Diagnostic Guide.",
    start_url: `${BASE}/`,
    scope: `${BASE}/`,
    display: "standalone",
    background_color: "#022c22",
    theme_color: "#059669",
    orientation: "portrait-primary",
    categories: ["agriculture", "education", "productivity", "utilities"],
    icons: [
      {
        src: "/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
