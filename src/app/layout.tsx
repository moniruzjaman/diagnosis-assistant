import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CABI Plant Diagnosis Assistant",
  description:
    "An interactive digital guide to identify crop diseases and pests using visual symptom categories from the CABI Plantwise Field Diagnostic Guide. AI-powered multimodal diagnosis in Bangla and English.",
  keywords: [
    "CABI",
    "Plantwise",
    "crop disease",
    "plant diagnosis",
    "agriculture AI",
    "Bangla agriculture",
    "plant pathology",
  ],
  authors: [{ name: "CABI Plantwise" }],
  openGraph: {
    title: "CABI Plant Diagnosis Assistant",
    description:
      "Identify crop diseases and pests using visual symptom categories from the CABI Plantwise Field Diagnostic Guide.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
