import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "CABI Plant Diagnosis Assistant",
    short_name: "CABI Plant",
    description:
      "An interactive digital guide to identify crop diseases and pests using visual symptom categories from the CABI Plantwise Field Diagnostic Guide.",
    start_url: "/",
    scope: "/",
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
