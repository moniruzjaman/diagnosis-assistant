"use client";

import { Workbox } from "workbox-window";

let wbInstance: Workbox | null = null;

export function getWorkbox(): Workbox | null {
  return wbInstance;
}

export function registerCabiServiceWorker(onUpdateFound?: () => void) {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  // Only register once
  if (wbInstance) return wbInstance;

  try {
    const wb = new Workbox("/sw.js");
    wbInstance = wb;

    wb.addEventListener("installed", (event) => {
      if (event.isUpdate) {
        console.log("[Workbox] A newer version of the CABI diagnostic guide is available.");
        if (onUpdateFound) {
          onUpdateFound();
        }
      } else {
        console.log("[Workbox] CABI Plant Diagnosis Assistant is now cached for offline field use.");
      }
    });

    wb.addEventListener("activated", () => {
      console.log("[Workbox] Service worker activated. Offline database is armed.");
    });

    wb.addEventListener("waiting", () => {
      console.log("[Workbox] Service worker waiting to activate.");
    });

    wb.register().catch((err) => {
      console.warn("[Workbox] Service worker registration failed:", err);
    });

    return wb;
  } catch (err) {
    console.error("[Workbox] Service worker initialization error:", err);
    return null;
  }
}

// Warm up the image cache in background with specimen URLs
export function prefetchSpecimenImages(imageUrls: string[]) {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "CACHE_URLS",
      urls: imageUrls.filter((url) => url && typeof url === "string"),
    });
  }
}
