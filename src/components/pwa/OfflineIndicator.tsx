"use client";

import React, { useSyncExternalStore } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WifiOff, Database, ShieldCheck } from "lucide-react";

interface OfflineIndicatorProps {
  locale?: "en" | "bn";
}

const emptySubscribe = () => () => {};

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ locale = "en" }) => {
  const isOnline = useOnlineStatus();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // During SSR and before initial client mount, render nothing to avoid hydration mismatch
  if (!mounted || isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-md bg-gradient-to-r from-amber-950/95 to-emerald-950/95 border border-amber-500/50 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-3 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
          <WifiOff className="w-4 h-4 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              {locale === "bn" ? "মাঠ পর্যায়ে অফলাইন মোড" : "Field Offline Mode Active"}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-2.5 h-2.5" /> Workbox Cache
            </span>
          </div>
          <p className="text-[11px] text-slate-200 mt-1 leading-relaxed">
            {locale === "bn"
              ? "ইন্টারনেট সংযোগ ছাড়াই সিএবিআই ডায়াগনস্টিক ডাটাবেস এবং লক্ষণসমূহ ওয়ার্কবক্স ক্যাশ থেকে তাৎক্ষণিকভাবে কাজ করছে।"
              : "No internet connection detected. The full CABI diagnostic database, category keys, and specimen photos are being served offline via Workbox."}
          </p>
        </div>
      </div>
    </div>
  );
};
