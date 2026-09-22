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

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "CABI Plant Diagnosis Assistant",
  description:
    "An interactive digital guide to identify crop diseases and pests using visual symptom categories from the CABI Plantwise Field Diagnostic Guide. AI-powered multimodal diagnosis in Bangla and English.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CABI Plant",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
  openGraph: {
    title: "CABI Plant Diagnosis Assistant",
    description:
      "Identify crop diseases and pests using visual symptom categories from the CABI Plantwise Field Diagnostic Guide. Built for offline agricultural field conditions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
