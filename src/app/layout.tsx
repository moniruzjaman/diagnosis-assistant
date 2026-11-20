import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// GitHub Pages project site prefix — mirrors next.config.ts so every
// metadata URL (icons, OG image, canonical) resolves on the deployed site.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const SITE_URL = "https://moniruzjaman.github.io";

const OG_TITLE = "CABI ফসল রোগ নিরূপক ও সহকারী";
const OG_DESCRIPTION =
  "CABI Plantwise মাঠপর্যায়ের গাইড অনুসরণ করে ছবি ও লক্ষণ দেখে ফসলের রোগ শনাক্তকরণ — AI-powered crop disease diagnosis in Bangla & English, offline-ready PWA.";
const OG_IMAGE_ALT =
  "CABI Plant Diagnosis Assistant — বাংলা-প্রথম অফলাইন PWA, ফসলের রোগ নির্ণয় অ্যাপ / Bangla-first offline PWA for AI crop disease diagnosis";

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${OG_TITLE} | CABI Plant Diagnosis Assistant`,
  description:
    "An interactive digital guide to identify crop diseases and pests using visual symptom categories from the CABI Plantwise Field Diagnostic Guide. AI-powered multimodal diagnosis in Bangla and English.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CABI Plant",
  },
  icons: {
    icon: [
      { url: `${BASE}/icon.svg`, type: "image/svg+xml" },
      { url: `${BASE}/favicon.ico`, sizes: "32x32" },
      { url: `${BASE}/pwa-192x192.png`, sizes: "192x192", type: "image/png" },
      { url: `${BASE}/pwa-512x512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: `${BASE}/apple-touch-icon.png`,
  },
  keywords: [
    "CABI",
    "Plantwise",
    "crop disease",
    "plant diagnosis",
    "agriculture AI",
    "Bangla agriculture",
    "plant pathology",
    "Workbox PWA",
    "offline agriculture",
  ],
  authors: [{ name: "CABI Plantwise" }],
  alternates: {
    canonical: `${BASE}/`,
  },
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: `${BASE}/`,
    siteName: "CABI Plant Diagnosis Assistant",
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    images: [
      {
        url: `${BASE}/og-image.png`,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [`${BASE}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <Script
          id="fetch-override-protect"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window !== 'undefined') {
                    var _nativeFetch = window.fetch ? window.fetch.bind(window) : undefined;
                    var _currentFetch = _nativeFetch;
                    try {
                      Object.defineProperty(window, 'fetch', {
                        get: function() {
                          return _currentFetch;
                        },
                        set: function(fn) {
                          _currentFetch = fn;
                        },
                        configurable: true,
                        enumerable: true
                      });
                    } catch (e1) {
                      if (typeof Window !== 'undefined' && Window.prototype) {
                        Object.defineProperty(Window.prototype, 'fetch', {
                          get: function() {
                            return _currentFetch;
                          },
                          set: function(fn) {
                            _currentFetch = fn;
                          },
                          configurable: true,
                          enumerable: true
                        });
                      }
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        <ServiceWorkerRegistration />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
