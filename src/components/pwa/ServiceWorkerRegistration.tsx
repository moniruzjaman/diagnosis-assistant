"use client";

import { useEffect } from "react";
import { registerCabiServiceWorker, prefetchSpecimenImages } from "@/lib/registerServiceWorker";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Register the Workbox service worker
    registerCabiServiceWorker(() => {
      console.log("[ServiceWorkerRegistration] Workbox update found.");
    });

    const controller = new AbortController();

    // Prefetch authentic CABI specimens for offline access after idle
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        try {
          fetch("/api/database", { signal: controller.signal })
            .then((res) => res.json())
            .then((data) => {
              if (data && Array.isArray(data.diagnostic_keys)) {
                const imagesToCache: string[] = [];
                data.diagnostic_keys.forEach((key: { images?: string[] }) => {
                  if (Array.isArray(key.images)) {
                    key.images.forEach((img: string) => {
                      if (img) {
                        imagesToCache.push(
                          `https://raw.githubusercontent.com/mithunHSTU/cabi-crop-diagnosis-guide/main/crops/${img}`
                        );
                      }
                    });
                  }
                });
                if (imagesToCache.length > 0) {
                  prefetchSpecimenImages(imagesToCache.slice(0, 50));
                }
              }
            })
            .catch((err) => {
              // Ignore intentional aborts and background warmup errors
              if (err?.name !== "AbortError") {
                // Non-critical background warmup
              }
            });
        } catch {
          // Ignore
        }
      });
    }

    return () => {
      controller.abort();
    };
  }, []);

  return null;
}
