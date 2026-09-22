"use client";

import React, { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, Smartphone, X, CheckCircle2, Share } from "lucide-react";

interface PWAInstallButtonProps {
  locale?: "en" | "bn";
  variant?: "header" | "badge";
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  locale = "en",
  variant = "header",
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as an installed PWA, hide or show installed badge
  if (isInstalled) {
    if (variant === "badge") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          {locale === "bn" ? "অ্যাপ ইনস্টলড" : "Field App Ready"}
        </span>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md transition transform active:scale-95 cursor-pointer border border-emerald-400/30"
        title={
          locale === "bn"
            ? "মাঠে অফলাইনে ব্যবহারের জন্য অ্যাপটি ইনস্টল করুন"
            : "Install as PWA for offline agricultural field diagnosis"
        }
      >
        <Download className="w-3.5 h-3.5 animate-bounce shrink-0" />
        <span>{locale === "bn" ? "অ্যাপ ইনস্টল" : "Install App"}</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not fired by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 text-xs font-medium transition cursor-pointer"
          title={locale === "bn" ? "আইফোন বা আইপ্যাডে ইনস্টল করুন" : "Install on iPhone / iPad"}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{locale === "bn" ? "iOS ইনস্টল" : "Install on iOS"}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-white">
                    {locale === "bn" ? "আইফোনে অফলাইন অ্যাপ যোগ করুন" : "Install on iPhone / iPad"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-900/80 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    1
                  </div>
                  <div>
                    {locale === "bn" ? (
                      <>
                        সাফারি (Safari) ব্রাউজারের নিচে থাকা{" "}
                        <span className="inline-flex items-center gap-1 font-semibold text-white bg-slate-800 px-1.5 py-0.5 rounded">
                          <Share className="w-3 h-3 text-emerald-400" /> শেয়ার
                        </span>{" "}
                        আইকনে ট্যাপ করুন।
                      </>
                    ) : (
                      <>
                        Tap the{" "}
                        <span className="inline-flex items-center gap-1 font-semibold text-white bg-slate-800 px-1.5 py-0.5 rounded">
                          <Share className="w-3 h-3 text-emerald-400" /> Share
                        </span>{" "}
                        button in your Safari toolbar.
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-900/80 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    2
                  </div>
                  <div>
                    {locale === "bn"
                      ? "নিচে স্ক্রোল করে 'Add to Home Screen' (হোম স্ক্রিনে যোগ করুন) বিকল্পটি বেছে নিন।"
                      : "Scroll down and tap 'Add to Home Screen'."}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-900/80 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    3
                  </div>
                  <div>
                    {locale === "bn"
                      ? "উপরে ডানে 'Add' চাপুন। এখন অ্যাপটি সরাসরি অফলাইন মাঠের কাজে তৈরি।"
                      : "Tap 'Add' at the top-right. The guide will now work seamlessly in offline fields!"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white shadow-md transition"
              >
                {locale === "bn" ? "ঠিক আছে" : "Got It"}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
