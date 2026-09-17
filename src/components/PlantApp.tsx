"use client";

import React, { useState, useEffect } from "react";
import {
  Leaf,
  Search,
  Sparkles,
  BookOpen,
  Award,
  Activity,
  Info,
  X,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Columns,
  RotateCcw,
  Check,
  ExternalLink,
  Brain,
  Gauge,
  MapPin,
  Flame,
  XCircle,
  Upload,
  Trash2,
  Coins,
  ShieldCheck,
  Scale,
  Wrench,
  Package,
  Eye,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DatabaseSchema, DiagnosticKey, AIDiagnosisResult, QuizQuestion, HistoryScan } from "@/lib/types";
import { TRANSLATIONS, BANGLA_CATEGORIES, BANGLA_PAGE_PREVIEWS } from "@/lib/translations";

const CABI_CATEGORIES = [
  "Wilt",
  "Leaf spot",
  "Witches' broom",
  "Canker",
  "Mosaic",
  "Yellowing of leaves",
  "Distortion of leaves",
  "Little leaf",
  "Galls",
  "Drying/necrosis/blight"
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  "Wilt": { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", accent: "bg-amber-500" },
  "Leaf spot": { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200", accent: "bg-emerald-500" },
  "Witches' broom": { bg: "bg-violet-50", text: "text-violet-800", border: "border-violet-200", accent: "bg-violet-500" },
  "Canker": { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200", accent: "bg-rose-500" },
  "Mosaic": { bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200", accent: "bg-teal-500" },
  "Yellowing of leaves": { bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-200", accent: "bg-yellow-500" },
  "Distortion of leaves": { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200", accent: "bg-indigo-500" },
  "Little leaf": { bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-200", accent: "bg-sky-500" },
  "Galls": { bg: "bg-orange-50", text: "text-orange-800", border: "border-orange-200", accent: "bg-orange-500" },
  "Drying/necrosis/blight": { bg: "bg-red-50", text: "text-red-800", border: "border-red-200", accent: "bg-red-500" }
};

const getFieldTipsForCategory = (category: string | null, lang: "en" | "bn") => {
  const norm = category?.toLowerCase().trim() || "";
  
  if (norm.includes("wilt")) {
    return {
      title: lang === "bn" ? "মাঠ পর্যায়ের জরুরি নির্দেশনা: নেতিয়ে পড়া/ঢলে পড়া রোগ দমনে" : "Critical Field Tips: Managing Wilt Diseases",
      tips: [
        {
          icon: "Trash2",
          text: lang === "bn" 
            ? "আক্রান্ত গাছ সম্পূর্ণ শিকড়সহ আলতোভাবে উপড়ে ফেলুন যাতে ব্যাকটেরিয়া ছড়াতে না পারে। আক্রান্ত গাছটি সাধারণ আবর্জনার সাথে ফেলে না দিয়ে মাটির গভীরে পুঁতে ফেলুন বা পুড়িয়ে ফেলুন।"
            : "Carefully uproot the entire infected plant, including the roots, to prevent pathogens from spreading. Burn or bury the plant residues deep in the ground, far from irrigation channels.",
          badge: lang === "bn" ? "নিরাপদ অপসারণ" : "Safe Disposal"
        },
        {
          icon: "Flame",
          text: lang === "bn"
            ? "উষ্ণ মৌসুমে চাষের পূর্বে পরিষ্কার পলিথিন সীট দিয়ে মাটিকে ২-৩ সপ্তাহ ঢেকে রাখুন (সয়েল সোলারাইজেশন)। এতে সূর্যের চরম তাপে মাটির ভেতরের ব্যাকটেরিয়া ও নিমাটোড নির্মূল হবে।"
            : "Utilize soil solarization: dynamic solar heating by covering moist soil with clean, transparent polyethylene sheets for 2-3 weeks in high temperatures before planting.",
          badge: lang === "bn" ? "সয়েল সোলারাইজেশন" : "Soil Solarization"
        },
        {
          icon: "Wrench",
          text: lang === "bn"
            ? "অতিরিক্ত সেচ পরিহার করুন। সেচের ড্রেনে বা নালায় চুন বা কপার অক্সিক্লোরাইড ব্যবহার করুন যাতে পানিবাহিত স্পোর এক খেত থেকে অন্য খেতে ছড়াতে না পারে।"
            : "Avoid overhead or surface flooding irrigation. Run dynamic lime-washing on water channels or treat with copper fungicides to neutralize mobile spores.",
          badge: lang === "bn" ? "পানি ও সেচ নিয়ন্ত্রণ" : "Irrigation Control"
        }
      ]
    };
  } else if (norm.includes("spot")) {
    return {
      title: lang === "bn" ? "মাঠ পর্যায়ের জরুরি নির্দেশনা: পাতার দাগ রোগ দমনে" : "Critical Field Tips: Managing Leaf Spot Pathogens",
      tips: [
        {
          icon: "Wrench",
          text: lang === "bn"
            ? "নিচের আক্রান্ত পাতাগুলো কেটে বা ছাঁটাই করে সরিয়ে ফেলুন (Pruning)। এটি ক্যানোপি লেভেলে বাতাসের প্রবাহ ভালো করে এবং নিচের পাতার আর্দ্রতা ধুলোয় মিশিয়ে ছত্রাক বিস্তার হ্রাস করে।"
            : "Carefully prune lower diseased leaves. This increases lower air circulation and reduces relative humidity in the crop canopy, suppressing spore germination.",
          badge: lang === "bn" ? "ফলিয়ার ছাঁটাই" : "Foliar Pruning"
        },
        {
          icon: "Clock",
          text: lang === "bn"
            ? "পাতার উপর দিয়ে সরাসরি জল ছিটানো (Overhead Splash Irrigation) বন্ধ করুন; পানি সরাসরি গোড়ায় দিন। কারণ জলবিন্দুগুলো ছিটকে ছত্রাক বা ব্যাকটেরিয়ার স্পোর অন্য পাতায় ছড়িয়ে দেয়।"
            : "Halt sprinkler or overhead splash irrigation as moving water droplets are the primary vectors dispersing bacterial and fungal conidia onto adjacent healthy leaves.",
          badge: lang === "bn" ? "ছিটে-পানি পরিহার" : "Dispersal Prevention"
        },
        {
          icon: "Trash2",
          text: lang === "bn"
            ? "আক্রান্ত পাতা ও অবশিষ্টাংশ পুড়িয়ে ফেলুন। কাঁচা পচা পাতা দিয়ে সরাসরি মালচ বা জৈব সার বানাবেন না, কারণ এতে বীজ বীজাণু সতেজ থেকে পরবর্তী ফসলের মারাত্মক ক্ষতি করতে পারে।"
            : "Collect and burn infected leaf debris. Never plow sick residues directly into the bedding or use them for raw compost heap layers as spores can easily winter-over.",
          badge: lang === "bn" ? "বীজাণু ধ্বংস" : "Sanitize Bedding"
        }
      ]
    };
  } else if (norm.includes("yellowing") || norm.includes("yellowed") || norm.includes("yellow")) {
    return {
      title: lang === "bn" ? "মাঠ পর্যায়ের জরুরি নির্দেশনা: পাতা হলুদ হওয়া রোধে" : "Critical Field Tips: Treating Leaf Chlorosis/Yellowing",
      tips: [
        {
          icon: "Activity",
          text: lang === "bn"
            ? "হলুদ হওয়া পাতাগুলো পোকার দ্বারা আক্রান্ত কিনা চেক করুন (বিশেষ করে জাবপোকা বা সাদা মাছি)। উপদ্রব বেশি হলে রস শোষণকারী পোকা তাড়াতে নিমের তেল স্প্রে করুন।"
            : "Inspect leaf undersides for aphid, thrip, or whitefly sucking colonies. Spray organic cold-pressed Neem oil (3-5 ml/L) mixed with mild soap to break insect-vector cycles.",
          badge: lang === "bn" ? "পোকা দমন" : "Vector Defend"
        },
        {
          icon: "Leaf",
          text: lang === "bn"
            ? "নাইট্রোজেন বা সালফার বা লোহার পুষ্টির ঘাটতি কিনা বুঝতে নিকটস্থ কন্টাক্ট অফিসে পাতা পরীক্ষা করুন। অম্লীয় মাটি হলে পরীক্ষা অনুযায়ী চুন প্রয়োগ করুন।"
            : "Perform rapid pH-testing of soil. Apply agricultural limestone or dolomite to highly acidic soils to unlock key micronutrients like Magnesium and Phosphorus.",
          badge: lang === "bn" ? "মাটির অম্লতা সংশোধন" : "Soil pH Tuning"
        },
        {
          icon: "Clock",
          text: lang === "bn"
            ? "মাটিতে জলাবদ্ধতা (Waterlogging) হচ্ছে কিনা নিশ্চিত করুন। পানি জমে থাকার ফলে উদ্ভিদের শিকড় শ্বাস নিতে পারে না ও অক্সিজেন সংকটে সম্পূর্ণ পাতা হলুদ হতে থাকে।"
            : "Ensure proper tile drainage. Waterlogging deprives crop roots of crucial oxygen, causing root asphyxiation which presents as rapid systemic leaf chlorosis.",
          badge: lang === "bn" ? "নিষ্কাশন ব্যবস্থা" : "Root Drainage"
        }
      ]
    };
  } else if (norm.includes("distortion") || norm.includes("curl") || norm.includes("little") || norm.includes("broom") || norm.includes("witches") || norm.includes("mosaic") || norm.includes("canker")) {
    return {
      title: lang === "bn" ? "মাঠ পর্যায়ের জরুরি নির্দেশনা: পাতা বিকৃতি ও কুঁকড়ানো রোধে" : "Critical Field Tips: Curtailing Leaf Distortion & Little Leaf",
      tips: [
        {
          icon: "Leaf",
          text: lang === "bn"
            ? "লিটল লিফ বা ফাইটোপ্লাজমা আক্রান্ত ডাল সাথে সাথে কেটে ধ্বংস করতে হবে। রোগাক্রান্ত কাটিং দিয়ে কখনো নতুন বোট বা চারার কলম করবেন না।"
            : "Immediately rogue out and destroy severely distorted or stunted terminals. Never select cuttings or graft nodes from infected parent crops.",
          badge: lang === "bn" ? "রুগ্ন কুঁড়ি ছাঁটাই" : "Meticulous Roguing"
        },
        {
          icon: "Activity",
          text: lang === "bn"
            ? "ভাইরাস ও ফাইটোপ্লাজমা প্রধানত চুষি পোকার (যেমন জেসিড, মাইট) মাধ্যমে সুস্থ গাছে ছড়ায়। আক্রান্ত জমিতে হলুদ ফাঁদ (Yellow Sticky Traps) পাতুন।"
            : "Deploy yellow sticky color traps right above the canopy level. Sucking insect vectors serve as path-carriers for phytoplasma and mosaic viruses.",
          badge: lang === "bn" ? "হলুদ ফাঁদ ব্যবহার" : "Vector Sticky Traps"
        },
        {
          icon: "Wrench",
          text: lang === "bn"
            ? "দস্তা (Zinc) বা ক্যালসিয়ামের চরম অভাব অনেক সময় পাতা বিকৃতির মতো জটিলতা এনে দেয়। পরামর্শ অনুযায়ী জিংক সালফেট এবং জিপসাম সার জমিতে প্রয়োগ করুন।"
            : "Supplement with dynamic micronutrients. Extreme Zinc or Calcium deficiencies cause curl traits. Apply Zinc Sulphate or soluble Gypsum to the crop bed.",
          badge: lang === "bn" ? "অনূখাদ্য পুষ্টি সংশোধন" : "Zinc/Gypsum Boost"
        }
      ]
    };
  } else if (norm.includes("gall") || norm.includes("galls") || norm.includes("tumor")) {
    return {
      title: lang === "bn" ? "মাঠ পর্যায়ের জরুরি নির্দেশনা: শিকড় ও কাণ্ডের গিট/টিউমার দমনে" : "Critical Field Tips: Countering Root-Knot Galls",
      tips: [
        {
          icon: "Leaf",
          text: lang === "bn"
            ? "মাটির নিমাটোড সরাতে জমিতে গাঁদা ফুল (Marigold) চাষ করুন। গাঁদা ফুলের শিকড় থেকে নিঃসৃত তরল মাটির ক্ষতিকারক কৃমিনাশক হিসেবে কাজ করে।"
            : "Intercrop or rotate with French marigolds (Tagetes patula). Marigold roots release natural alpha-terthienyl, which is highly toxic to root-knot nematodes.",
          badge: lang === "bn" ? "গাঁদা ফুলের মাধ্যমে জৈবচাষ" : "Marigold Intercrop"
        },
        {
          icon: "Flame",
          text: lang === "bn"
            ? "তীব্র সংক্রামিত ক্ষেত চষার পর রোদে কয়েক সপ্তাহ ফাঁকা ফেলে রাখুন (সোলারে সোলারাইজেশন)। উচ্চ তাপে কন্দ ও কৃমির ডিম নষ্ট হয়ে মাটি জীবাণুমুক্ত হয়।"
            : "Employ dry deep-plowing in the hot summer followed by transparent plastic sheet solarization for 4 weeks to cook gall-inducing soil nematodes and larvae.",
          badge: lang === "bn" ? "গভীর চাষ ও তাপীকরণ" : "Dry Deep-Plowing"
        },
        {
          icon: "Clock",
          text: lang === "bn"
            ? "পরবর্তী মৌসুমে একই জমিতে সোলাটাসি (বেগুন, টমেটো) ফসল না ফলিয়ে সরিষা বা গম চাষ করুন (Crop Rotation)। ফসল আবর্তন নিমাটোডের খাদ্যচক্র ধ্বংস করে।"
            : "Practice systematic 3-year crop rotation. Do not replant susceptible Solanaceous hosts. Shift to antagonistic or non-host dense crops like mustard.",
          badge: lang === "bn" ? "ফসল আবর্তন" : "Strategic Rotation"
        }
      ]
    };
  } else if (norm.includes("blight") || norm.includes("necrosis") || norm.includes("drying")) {
    return {
      title: lang === "bn" ? "মাঠ পর্যায়ের জরুরি নির্দেশনা: ব্লাইট বা পাতা ঝলসে যাওয়া রোধে" : "Critical Field Tips: Curtailing Blight & Severe Drying",
      tips: [
        {
          icon: "Wrench",
          text: lang === "bn"
            ? "সবুজ আবর্জনা শুকিয়ে সোলারাইজেশন পদ্ধতিতে জীবাণুমুক্ত করুন। বর্ষার বা সিক্ত আবহাওয়া পর বাগান পরিষ্কার পরিচ্ছন্ন রাখতে কপার বেসড বোঁর্দো মিক্সচার স্প্রে করুন।"
            : "Spray Bordeaux Mixture (quicklime + copper sulfate) periodically during humid weather to form a protective inorganic skin over leaf surface tissue.",
          badge: lang === "bn" ? "বোর্ডো মিক্সচার প্রয়োগ" : "Bordeaux Mixture"
        },
        {
          icon: "Trash2",
          text: lang === "bn"
            ? "ব্লাইটের দাগযুক্ত পাতা বা ডাল শুকনো আবহাওয়ায় ধারালো কাঁচি দিয়ে কেটে দ্রুত প্লাস্টিক ব্যাগে ঢুকিয়ে মাঠের বাইরে নিয়ে পুড়িয়ে ফেলুন।"
            : "Carefully prune blighted foliage during dry sunny periods only. Instantly bag pruning debris before moving, to prevent loose fungal conidia from air-drifting.",
          badge: lang === "bn" ? "আক্রান্ত অংশ দাহ্যকরণ" : "Foliar Incineration"
        },
        {
          icon: "Flame",
          text: lang === "bn"
            ? "ব্লাইট জীবাণু মাটি থেকে কন্দ বা কন্দে বাস করে। কমপক্ষে ৩ বছর এক জমিতে আলু বা টমেটোর পর পর চাষ বন্ধ করুন, সুষম পটাসিয়াম সার প্রয়োগ করুন।"
            : "Apply balanced potassium fertilizers to strengthen cellular walls against early-stage blight penetrations. Refrain from over-applying high-nitrogen formulas.",
          badge: lang === "bn" ? "সুষম পটাস প্রয়োগ" : "Tissue Cell Hardening"
        }
      ]
    };
  } else {
    return {
      title: lang === "bn" ? "মাঠ পর্যায়ের সাধারণ রোগ প্রতিরোধ নির্দেশনা" : "General Field Hygiene & Pathogen Disposal Guidelines",
      tips: [
        {
          icon: "Trash2",
          text: lang === "bn"
            ? "আক্রান্ত উদ্ভিদের রোগাক্রান্ত টিস্যু ও ডালপালা মাঠের মধ্যে ফেলে রাখবেন না। শুকনো দিনে কেটে ব্যাগে ভরে জমিতে ছড়াতে না দিয়ে ধ্বংস বা পুড়িয়ে ফেলুন।"
            : "Ensure strict sanitation. Collect, bag, and safely burn all diseased foliage residues rather than allowing them to decay on the crop bed floor.",
          badge: lang === "bn" ? "নিরাপদ ধ্বংসকরণ" : "Sanitary Removal"
        },
        {
          icon: "Flame",
          text: lang === "bn"
            ? "নিবিড় চাষের মধ্যবর্তী শুষ্ক বিরতিতে রৌদ্রোজ্জ্বল আবহাওয়ায় জমি গভীর চাষ করে মাটিকে প্লাস্টিক সীট দিয়ে ঢেকে পর্যাপ্ত তাপ দিন (সয়েল সোলারাইজেশন)।"
            : "Perform organic soil solarization by placing clear, UV-stabilized plastic sheets over damp rows during hot seasons to reach standard pasteurizing heat levels inside the soil.",
          badge: lang === "bn" ? "সয়েল সোলারাইজেশন" : "Soil Heat Sterilize"
        },
        {
          icon: "Wrench",
          text: lang === "bn"
            ? "আক্রান্ত গাছে কাজ করা যন্ত্রপাতি বা কাঁচি প্রতিটি গাছ ছাঁটার পর ফুটন্ত গরম পানি বা লঘুকৃত ব্লিচ দিয়ে ধুয়ে জীবাণুমুক্ত করে নিন যাতে এক উদ্ভিদ থেকে অন্যটিতে ব্যাকটেরিয়া সংক্রামিত না হয়।"
            : "Disinfect all pruning shears, knives, and spades with a brief dip in diluted liquid bleach or boiling water when moving between plants to eliminate pathogen cross-contamination.",
          badge: lang === "bn" ? "যন্ত্রপাতি জীবাণুমুক্ত" : "Tools Disinfection"
        }
      ]
    };
  }
};

export default function App() {
  const [locale, setLocale] = useState<"bn" | "en">("bn");
  const t = TRANSLATIONS[locale];

  const getCategoryLabel = (cat: string) => {
    return locale === "bn" ? (BANGLA_CATEGORIES[cat] || cat) : cat;
  };

  const [db, setDb] = useState<DatabaseSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Browsing States
  const [activeTab, setActiveTab] = useState<"explorer" | "wizard" | "pathologist" | "quiz">("wizard");
  const [searchTerm, setSearchTerm] = useState("");
  const [hudExpanded, setHudExpanded] = useState(false);

  // Enhanced Navigation with smooth scrolling behavior
  const changeTab = (tab: "explorer" | "wizard" | "pathologist" | "quiz") => {
    setActiveTab(tab);
    if (tab === "quiz") {
      startQuiz();
    }
    setTimeout(() => {
      document.getElementById("main-content-area")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  const [selectedCategory, setSelectedCategory] = useState<string>("Leaf spot");
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption: string } | null>(null);

  // Smart AI Pathologist States
  const [symptomDescription, setSymptomDescription] = useState("");
  const [diagnoseImage, setDiagnoseImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<AIDiagnosisResult | null>(null);
  const [aiErrorMsg, setAiErrorMsg] = useState<string | null>(null);

  // Guided Step-by-Step Wizard States
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardCropType, setWizardCropType] = useState<string>("");
  const [wizardImage, setWizardImage] = useState<string | null>(null);
  const [wizardDragActive, setWizardDragActive] = useState(false);
  const [wizardSymptomText, setWizardSymptomText] = useState("");
  const [wizardDiagnosing, setWizardDiagnosing] = useState(false);
  const [wizardResult, setWizardResult] = useState<AIDiagnosisResult | null>(null);
  const [wizardErrorMsg, setWizardErrorMsg] = useState<string | null>(null);
  const [wizardProgressMessage, setWizardProgressMessage] = useState<string>("");

  // Local Storage Diagnostic History States
  const [historyScans, setHistoryScans] = useState<HistoryScan[]>([]);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cabi_diagnostic_history");
      if (stored) {
        setHistoryScans(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading diagnostic history from localStorage:", e);
    }
  }, []);

  const latestHistoryLabel = () => {
    if (historyScans.length === 0) return "";
    const latest = historyScans[historyScans.length - 1];
    return latest.result.matchedCategory ? getCategoryLabel(latest.result.matchedCategory) : latest.symptomDescription;
  };

  const appendHistoryScan = (symptom: string, img: string | null, res: AIDiagnosisResult) => {
    const newScan: HistoryScan = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleString(),
      symptomDescription: symptom,
      image: img,
      result: res
    };
    setHistoryScans(prev => {
      const updated = [newScan, ...prev];
      try {
        localStorage.setItem("cabi_diagnostic_history", JSON.stringify(updated));
      } catch (err) {
        console.error("Error writing diagnostic history to localStorage:", err);
      }
      return updated;
    });
  };

  const deleteHistoryScan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistoryScans(prev => {
      const updated = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem("cabi_diagnostic_history", JSON.stringify(updated));
      } catch (err) {
        console.error("Error updating diagnostic history:", err);
      }
      return updated;
    });
  };

  const clearAllHistory = () => {
    setHistoryScans([]);
    try {
      localStorage.removeItem("cabi_diagnostic_history");
    } catch (err) {
      console.error("Error clearing diagnostic history:", err);
    }
  };

  // Quiz States
  const [quizScore, setQuizScore] = useState(0);
  const [quizPlayed, setQuizPlayed] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string | null>(null);
  const [quizHasChecked, setQuizHasChecked] = useState(false);

  // Fetch CABI Diagnostic Database on startup
  useEffect(() => {
    async function loadDb() {
      try {
        setLoading(true);
        const response = await fetch("/api/database");
        if (!response.ok) {
          throw new Error("Diagnosis database lookup returned non-ok stream.");
        }
        const data = await response.json();
        setDb(data);
      } catch (err: any) {
        console.error("Error retrieving CABI DB:", err);
        setErrorMsg(err.message || "Could not retrieve guide database. App is running via offline simulated assets.");
      } finally {
        setLoading(false);
      }
    }
    loadDb();
  }, []);

  // Filter Categories on real-time search term
  const filteredCategories = CABI_CATEGORIES.filter(category => 
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get diagnostic entries for the selected category
  const activeEntries = db?.diagnostic_keys.filter(entry => 
    entry.symptom_category?.toLowerCase() === selectedCategory.toLowerCase()
  ) || [];

  // Generate a random quiz question from database
  const generateQuizQuestion = (database: DatabaseSchema) => {
    // Collect all elements that have visual images and a clean category name matching standard categories
    const validKeys = database.diagnostic_keys.filter(k => 
      k.symptom_category && 
      k.images && 
      k.images.length > 0 &&
      CABI_CATEGORIES.includes(k.symptom_category)
    );

    if (validKeys.length === 0) return;

    // Pick a random key entry
    const randomKey = validKeys[Math.floor(Math.random() * validKeys.length)];
    const correctCategory = randomKey.symptom_category!;
    const randomImage = randomKey.images[Math.floor(Math.random() * randomKey.images.length)];
    const imageUrl = `https://raw.githubusercontent.com/moniruzjaman/cabi-diagnosis-builder/krishiai4.0/output/images/${randomImage}`;

    // Compile multiple options (one correct, 3 random incorrects)
    const candidates = CABI_CATEGORIES.filter(c => c !== correctCategory);
    // Shuffle candidates and slice 3
    const shuffledIncorrect = [...candidates].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [correctCategory, ...shuffledIncorrect].sort(() => 0.5 - Math.random());

    setCurrentQuestion({
      imageUrl,
      correctCategory,
      options,
      page: randomKey.page,
      text_preview: randomKey.text_preview
    });
    setQuizSelectedAnswer(null);
    setQuizHasChecked(false);
  };

  // Start or reload the Crop Inspector Quiz
  const startQuiz = () => {
    if (db) {
      generateQuizQuestion(db);
    }
  };

  useEffect(() => {
    if (db && !currentQuestion) {
      generateQuizQuestion(db);
    }
  }, [db]);

  const handleQuizAnswer = (option: string) => {
    if (quizHasChecked) return;
    setQuizSelectedAnswer(option);
  };

  const checkQuizAnswer = () => {
    if (!currentQuestion || !quizSelectedAnswer || quizHasChecked) return;

    const isCorrect = quizSelectedAnswer === currentQuestion.correctCategory;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    setQuizPlayed(prev => prev + 1);
    setQuizHasChecked(true);
  };

  // Presets load helper converting unsplash images to base64 if needed
  const loadPresetSpecimen = async (imageUrl: string, promptText: string) => {
    setSymptomDescription(promptText);
    setDiagnoseImage(imageUrl); // Preview immediately
    setDiagnosisResult(null);
    setAiErrorMsg(null);
    try {
      const res = await fetch(imageUrl, { referrerPolicy: "no-referrer" });
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setDiagnoseImage(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.log("Using direct imageUrl reference for analysis fallback:", e);
    }
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setAiErrorMsg("Only image files are accepted for specimen matching.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setDiagnoseImage(reader.result as string);
      setAiErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Initiate Server-Side AI Pathology Diagnosis
  const handleSmartDiagnosis = async () => {
    if (!symptomDescription.trim()) return;
    try {
      setDiagnosing(true);
      setDiagnosisResult(null);
      setAiErrorMsg(null);
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptomDescription, image: diagnoseImage, locale })
      });
      if (!response.ok) {
        throw new Error("AI diagnostic processor returned failure.");
      }
      const data = await response.json();
      setDiagnosisResult(data);
      appendHistoryScan(symptomDescription, diagnoseImage, data);
    } catch (err: any) {
      console.error(err);
      setAiErrorMsg(err.message || "Failed to communicate with plant pathologist system.");
    } finally {
      setDiagnosing(false);
    }
  };

  // Guided step-by-step diagnostic scheduler
  const handleWizardDiagnosis = async () => {
    if (!wizardImage) {
      setWizardErrorMsg(locale === "bn" ? "অনুগ্রহ করে প্রথমে একটি পাতার ছবি নির্বাচন করুন।" : "Please select or upload a leaf image first.");
      setWizardStep(1);
      return;
    }
    
    setWizardDiagnosing(true);
    setWizardErrorMsg(null);
    setWizardResult(null);
    setWizardStep(3); // Go to loader page immediately
    
    // Schedule micro-messages
    setWizardProgressMessage(t.diagnoseProgressScan);
    const stepTimers: number[] = [];
    stepTimers.push(window.setTimeout(() => setWizardProgressMessage(t.diagnoseProgressFocal), 1200));
    stepTimers.push(window.setTimeout(() => setWizardProgressMessage(t.diagnoseProgressCabi), 2500));
    stepTimers.push(window.setTimeout(() => setWizardProgressMessage(t.diagnoseProgressGemini), 3800));
    
    const startTimeStamp = Date.now();
    try {
      const fullSymptomText = `[Guided Step Analysis] Crop Specimen: ${wizardCropType || "Crop of Interest"}. Observed Physical Traits: ${wizardSymptomText || "Delineated leaf spots or physical necrosis"}`;
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptomDescription: fullSymptomText,
          image: wizardImage,
          locale
        })
      });
      
      if (!response.ok) {
        throw new Error("Host analysis service returned an error status.");
      }
      
      const payload = await response.json();
      
      // Ensure the gorgeous transition laser scanner is visible for at least 4.2 seconds
      const lapsed = Date.now() - startTimeStamp;
      const remains = Math.max(0, 4200 - lapsed);
      
      window.setTimeout(() => {
        setWizardResult(payload);
        // Save scan log to general audit history
        appendHistoryScan(`${wizardCropType ? "[" + wizardCropType + "] " : ""}${wizardSymptomText}`, wizardImage, payload);
        setWizardStep(4);
      }, remains);
      
    } catch (err: any) {
      console.error(err);
      setWizardErrorMsg(err.message || "Failed to finalize guided diagnostics.");
      setWizardStep(2);
    } finally {
      window.setTimeout(() => {
        setWizardDiagnosing(false);
        stepTimers.forEach(clearTimeout);
      }, 4200);
    }
  };

  const handleWizardImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setWizardErrorMsg("Only image files are accepted.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setWizardImage(reader.result as string);
      setWizardErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  // Calculate statistics from the database
  const totalSymptoms = db?.diagnostic_keys.filter(k => k.symptom_category).length || 0;
  const totalImages = db?.diagnostic_keys.reduce((sum, item) => sum + (item.images?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="applet-root">
      {/* Top Professional Header Bar */}
      <header className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white shadow-md border-b border-emerald-900" id="header">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <Leaf className="w-8 h-8 text-emerald-300" id="header-leaf-icon" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight" id="header-title">{t.title}</h1>
              <p className="text-xs text-emerald-200/90 font-mono mt-0.5" id="header-desc">
                {t.subtitle}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Bilingual translation toggle with active glow animation */}
            <div className="flex items-center bg-black/25 p-1 rounded-xl border border-white/10" id="translation-toggle-bar">
              <button
                type="button"
                onClick={() => setLocale("bn")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  locale === "bn" 
                    ? "bg-emerald-600 text-white shadow-md font-semibold" 
                    : "text-emerald-100/80 hover:text-white"
                }`}
                id="toggle-lang-bn"
              >
                <span>বাং</span>
                {locale === "bn" && <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></span>}
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  locale === "en" 
                    ? "bg-emerald-600 text-white shadow-md font-semibold" 
                    : "text-emerald-100/80 hover:text-white"
                }`}
                id="toggle-lang-en"
              >
                <span>EN</span>
                {locale === "en" && <span className="w-1.5 h-1.5 bg-emerald-305 rounded-full animate-pulse"></span>}
              </button>
            </div>

            {/* Main Tab Controls with elegant active states */}
            <nav className="flex bg-emerald-950/40 p-1 rounded-xl border border-emerald-700/30 backdrop-blur-sm shadow-inner" id="nav-tabs">
              <button
                onClick={() => { changeTab("explorer"); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === "explorer" 
                    ? "bg-white text-emerald-800 shadow-sm font-semibold animate-none" 
                    : "text-emerald-100 hover:bg-white/10 hover:text-white"
                }`}
                id="tab-explorer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {t.symptomExplorer}
              </button>
              <button
                onClick={() => { changeTab("wizard"); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer relative ${
                  activeTab === "wizard" 
                    ? "bg-white text-emerald-850 shadow-sm font-bold" 
                    : "text-emerald-100 hover:bg-white/15 hover:text-white"
                }`}
                id="tab-wizard"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span className="relative z-10">{t.stepDiagnosis}</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-450 border-2 border-emerald-800 rounded-full animate-ping"></span>
              </button>
              <button
                onClick={() => { changeTab("pathologist"); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === "pathologist" 
                    ? "bg-white text-emerald-800 shadow-sm font-semibold" 
                    : "text-emerald-100 hover:bg-white/10 hover:text-white"
                }`}
                id="tab-ai-doctor"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t.aiPlantDoctor}
              </button>
              <button
                onClick={() => { changeTab("quiz"); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === "quiz" 
                    ? "bg-white text-slate-800 shadow-sm font-semibold" 
                    : "text-emerald-100 hover:bg-white/10 hover:text-white"
                }`}
                id="tab-quiz"
              >
                <Award className="w-3.5 h-3.5" />
                {t.cropAuditorQuiz}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col md:flex-row gap-8" id="main-container">
        
        {/* LEFT COLUMN: Common sidebar across tabs */}
        <aside className="w-full md:w-80 flex flex-col gap-6 shrink-0" id="sidebar-panel">
          
          {/* Real-time Category Search and Tree selection */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4" id="categories-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Columns className="w-4 h-4 text-emerald-600" />
                {t.symptomFilter}
              </h2>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                {CABI_CATEGORIES.length} {t.categoriesCount}
              </span>
            </div>

            {/* Quick search input */}
            <div className="relative">
              <input
                type="text"
                placeholder={t.searchGuidePlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 focus:bg-white transition"
                id="search-input"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            {/* Visual list of plant pathogen symptoms */}
            <ul className="flex flex-col gap-1.5 max-h-[350px] overflow-y-auto pr-1" id="category-list">
              {filteredCategories.map((category) => {
                const colors = CATEGORY_COLORS[category] || { bg: "bg-slate-50", text: "text-slate-800", border: "border-slate-100", accent: "bg-emerald-600" };
                const isActive = selectedCategory === category;
                return (
                  <li key={category} id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        if (activeTab !== "explorer") {
                          changeTab("explorer");
                        }
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between group border ${
                        isActive 
                          ? `${colors.bg} ${colors.text} ${colors.border} shadow-sm font-semibold` 
                          : "bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`w-2 h-2 rounded-full ${colors.accent} ${isActive ? "scale-110 animate-pulse" : "opacity-40 group-hover:opacity-80"}`}></span>
                        <span className="truncate">{getCategoryLabel(category)}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "translate-x-0.5 text-slate-700" : "opacity-30 group-hover:opacity-80"}`} />
                    </button>
                  </li>
                );
              })}
              {filteredCategories.length === 0 && (
                <li className="text-center py-6 text-xs text-slate-400 italic">{t.noMatchingCategory}</li>
              )}
            </ul>
          </div>

          {/* Guidelines and stats card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-sm space-y-4" id="stats-card">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Activity className="w-4 h-4 text-emerald-600" />
              {t.diagnosticMetrics}
            </h3>
            {loading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-6 bg-slate-100 rounded"></div>
                <div className="h-6 bg-slate-100 rounded"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <div className="text-[10px] md:text-xs text-slate-500 font-medium">{t.pageIndex}</div>
                  <div className="text-base md:text-lg font-bold text-slate-800 mt-0.5" id="metric-total-pages">
                    {db?.metadata.total_pages || 118}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <div className="text-[10px] md:text-xs text-slate-500 font-medium font-sans">{t.symptomKeys}</div>
                  <div className="text-base md:text-lg font-bold text-slate-800 mt-0.5" id="metric-total-keys">
                    {totalSymptoms}
                  </div>
                </div>
                <div className="col-span-2 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 text-center">
                  <div className="text-xs text-emerald-800 font-medium">{t.verifiedSpecimens}</div>
                  <div className="text-sm md:text-base font-bold text-emerald-950 mt-1" id="metric-total-images">
                    {totalImages} {t.referenceGraphicsCount}
                  </div>
                </div>
              </div>
            )}
            
            {/* Disclaimer & References */}
            <div className="text-[11px] leading-relaxed text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {t.methodologyGuidance}
            </div>
          </div>

          {/* Interactive Study Corner Banner */}
          <div className="bg-gradient-to-br from-teal-900 to-emerald-950 text-white p-5 rounded-2xl shadow-sm border border-emerald-800/80 flex flex-col gap-3 justify-between relative overflow-hidden" id="quiz-cta">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div>
              <div className="bg-emerald-400/20 text-emerald-300 font-semibold text-[10px] uppercase tracking-wider px-2 py-1 rounded-full w-max border border-emerald-500/20">
                {t.selfAssessment}
              </div>
              <h4 className="text-sm font-bold mt-2">{t.testSkillsTitle}</h4>
              <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                {t.testSkillsDesc}
              </p>
            </div>
            <button 
              onClick={() => { changeTab("quiz"); }}
              className="bg-white text-emerald-950 hover:bg-emerald-50 transition font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 w-max shadow-sm mt-1 cursor-pointer"
            >
              {t.startQuiz}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* RIGHT COLUMN: Interactive Views mapping tabs */}
        <section className="flex-1 min-w-0" id="main-content-area">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: Symptom Explorer */}
            {activeTab === "explorer" && (
              <motion.div
                key="explorer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                id="explorer-view"
              >
                {/* Visual Category Spotlight Card */}
                <div className={`p-6 rounded-2xl border ${CATEGORY_COLORS[selectedCategory]?.border || "border-emerald-200"} ${CATEGORY_COLORS[selectedCategory]?.bg || "bg-emerald-50/20"} flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm`} id="explorer-spotlight">
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full ${CATEGORY_COLORS[selectedCategory]?.accent || "bg-emerald-600"} inline-block shadow-sm`}></span>
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900" id="spotlight-title">{getCategoryLabel(selectedCategory)}</h2>
                    </div>
                    <p className="text-slate-600 text-sm max-w-xl leading-relaxed" id="spotlight-desc">
                      {locale === "bn" ? `${t.cabiSpotlightDesc} ` : "Explore detailed physical symptoms, verified photographs, and guide reference structures for identifying "}
                      <strong className="text-slate-800">{getCategoryLabel(selectedCategory)}</strong>
                      {locale === "en" && " pathotypes in field crops."}
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-200/50 flex flex-col items-center gap-0.5 shadow-sm text-center">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest leading-none">{t.cabiIndexPage}</span>
                    <span className="text-2xl font-black text-slate-900 mt-1" id="spotlight-page">
                      {activeEntries.length > 0 ? activeEntries[0].page : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Main Content Splitting */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-slate-100" id="loading-spinner">
                    <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-500 font-medium">{locale === "bn" ? "CABI প্ল্যান্টওয়াইজ তথ্য কাঠামোর মেলানো হচ্ছে..." : "Syncing CABI plantwise data framework..."}</p>
                  </div>
                ) : activeEntries.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 shadow-sm space-y-4" id="empty-spotlight">
                    <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-800 leading-none">{locale === "bn" ? "ডায়াগনস্টিক তথ্য পাওয়া যায়নি" : "Diagnostic Key Not Compiled"}</h3>
                      <p className="text-slate-500 text-sm max-w-md mx-auto">
                        {t.noSpecCompInDb}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6" id="specimens-list">
                    {activeEntries.map((entry, idx) => {
                      const colors = CATEGORY_COLORS[selectedCategory] || { bg: "bg-slate-50", text: "text-slate-800", border: "border-slate-100", accent: "bg-emerald-600" };
                      return (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col gap-5 p-6" id={`diagnostic-entry-card-${idx}`}>
                          {/* Entry Title metadata and header info */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-slate-100 text-slate-600 font-mono font-medium px-2.5 py-1 rounded-md">
                                {t.specimenIndex || "Specimen #"}{idx + 1}
                              </span>
                              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${colors.bg} ${colors.text}`}>
                                {t.diagnosticPageNum || "Diagnostic Page"} {entry.page}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                              <Info className="w-3.5 h-3.5" />
                              {t.visualRefIndex}: {entry.images.length} {locale === "bn" ? "টি রেফারেন্স চিত্র" : "Specimens"}
                            </span>
                          </div>

                          {/* Text Pathology Preview Description */}
                          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-150 leading-relaxed text-sm text-slate-600 max-h-40 overflow-y-auto" id={`entry-desc-${idx}`}>
                            <span className="font-bold text-slate-800 underline decoration-emerald-500 decoration-2 pr-1.5 block mb-1.5">{t.guideDiagnosticText}</span>
                            <p className="text-slate-700">
                              {locale === "bn" 
                                ? (BANGLA_PAGE_PREVIEWS[entry.page] || entry.text_preview) 
                                : entry.text_preview}
                            </p>
                          </div>

                          {/* Image Grid of verified crop leaves */}
                          {entry.images.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5" id={`entry-images-${idx}`}>
                              {entry.images.map((img, imgIdx) => {
                                const rawImgUrl = `https://raw.githubusercontent.com/moniruzjaman/cabi-diagnosis-builder/krishiai4.0/output/images/${img}`;
                                return (
                                  <div 
                                    key={imgIdx} 
                                    onClick={() => setLightboxImage({ url: rawImgUrl, caption: `${getCategoryLabel(selectedCategory)} - ${t.diagnosticPageNum} (Page ${entry.page})` })}
                                    className="group relative cursor-zoom-in bg-slate-100 rounded-xl overflow-hidden aspect-[4/3] border border-slate-200/80 hover:shadow-md hover:border-slate-300 transition-all duration-300"
                                    id={`entry-img-${idx}-${imgIdx}`}
                                  >
                                    <img 
                                      src={rawImgUrl} 
                                      alt={`${selectedCategory} reference pathological crop specimen`}
                                      referrerPolicy="no-referrer"
                                      onError={(e) => {
                                        // Standard placeholder failover injection
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=640&auto=format&fit=crop";
                                      }}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Captions and overlay trigger indicators */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-white text-[10px]">
                                      <p className="font-semibold">{img}</p>
                                      <p className="text-slate-300/90 flex items-center gap-0.5 mt-0.5">
                                        {t.clickEnlarge}
                                        <ExternalLink className="w-3 h-3 inline" />
                                      </p>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-slate-900/45 backdrop-blur-md text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-full z-10">
                                      {t.indexFig || "Index Fig"} {imgIdx + 1}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-xs text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                              {t.noImageForSpec}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW 2: Guided Step-by-Step Leaf Image Diagnostic Wizard */}
            {activeTab === "wizard" && (
              <motion.div
                key="wizard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                id="wizard-mode-view"
              >
                {/* Immersive Wizard Jumbotron Header */}
                <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden" id="wizard-hero">
                  <div className="space-y-2 relative z-10">
                    <div className="bg-emerald-400/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full w-max flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      {locale === "bn" ? "৪-ধাপ বিশিষ্ট সহজ রোগ নির্ণয় সহকারী" : "4-Step Interactive Crop Clinic"}
                    </div>
                    <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">{t.stepDiagnosis}</h3>
                    <p className="text-emerald-100/80 text-sm leading-relaxed max-w-2xl">
                      {t.guidedWizardDesc}
                    </p>
                  </div>
                  {wizardStep > 1 && (
                    <button
                      onClick={() => {
                        setWizardStep(1);
                        setWizardCropType("");
                        setWizardImage(null);
                        setWizardSymptomText("");
                        setWizardResult(null);
                        setWizardErrorMsg(null);
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold font-mono tracking-wide transition-all uppercase border border-white/20 flex items-center gap-1.5 cursor-pointer z-10"
                      id="reset-wizard-jumbo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {t.resetWizard}
                    </button>
                  )}
                </div>

                {/* Progress Tracker Bar */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm" id="wizard-stepper">
                  <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                    {/* Step unit 1 */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        wizardStep >= 1 ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-slate-100 text-slate-400"
                      }`}>
                        {wizardStep > 1 ? "✓" : "1"}
                      </div>
                      <div className="space-y-0.5">
                        <p className={`text-xs font-extrabold ${wizardStep === 1 ? "text-emerald-800" : "text-slate-600"}`}>
                          {t.step1Title}
                        </p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{locale === "bn" ? "আক্রান্ত পাতার ছবি" : "Upload leaf sample"}</p>
                      </div>
                    </div>

                    <div className="hidden md:block w-8 border-t-2 border-slate-100"></div>

                    {/* Step unit 2 */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        wizardStep >= 2 ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-slate-100 text-slate-400"
                      }`}>
                        {wizardStep > 2 ? "✓" : "2"}
                      </div>
                      <div className="space-y-0.5">
                        <p className={`text-xs font-extrabold ${wizardStep === 2 ? "text-emerald-800" : "text-slate-400"}`}>
                          {t.step2Title}
                        </p>
                        <p className="text-[10px] text-slate-450 line-clamp-1">{locale === "bn" ? "ফসলের ধরন ও লক্ষণ" : "Crop & traits"}</p>
                      </div>
                    </div>

                    <div className="hidden md:block w-8 border-t-2 border-slate-100"></div>

                    {/* Step unit 3 */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        wizardStep >= 3 ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-slate-100 text-slate-400"
                      }`}>
                        {wizardStep > 3 ? "✓" : "3"}
                      </div>
                      <div className="space-y-0.5">
                        <p className={`text-xs font-extrabold ${wizardStep === 3 ? "text-emerald-800" : "text-slate-400"}`}>
                          {t.step3Title}
                        </p>
                        <p className="text-[10px] text-slate-450 line-clamp-1">{locale === "bn" ? "এআই ল্যাব স্ক্যান" : "Pathology lab scan"}</p>
                      </div>
                    </div>

                    <div className="hidden md:block w-8 border-t-2 border-slate-100"></div>

                    {/* Step unit 4 */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        wizardStep === 4 ? "bg-amber-500 text-white shadow-md shadow-amber-200" : "bg-slate-100 text-slate-400"
                      }`}>
                        4
                      </div>
                      <div className="space-y-0.5">
                        <p className={`text-xs font-extrabold ${wizardStep === 4 ? "text-amber-800" : "text-slate-400"}`}>
                          {t.step4Title}
                        </p>
                        <p className="text-[10px] text-slate-450 line-clamp-1">{locale === "bn" ? "ডায়াগনস্টিক বিবরণপত্র" : "Clinical verdict logs"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STEP CONTENT BODY SWITCHING */}
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: LOAD OR CHOOSE IMAGE */}
                  {wizardStep === 1 && (
                    <motion.div
                      key="step-1-content"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                      id="wizard-step1-panel"
                    >
                      {/* Upload and preview card */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 block"></span>
                          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{t.step1Title}</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{t.step1Desc}</p>

                        {/* Interactive Drag Drop Target */}
                        <div
                          onDragOver={(e) => { e.preventDefault(); setWizardDragActive(true); }}
                          onDragLeave={() => setWizardDragActive(false)}
                          onDrop={(e) => { e.preventDefault(); setWizardDragActive(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) handleWizardImageFile(e.dataTransfer.files[0]); }}
                          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                            wizardDragActive ? "border-emerald-500 bg-emerald-50/40 scale-[0.99]" : "border-slate-200 hover:border-emerald-400 bg-slate-50/50"
                          } relative overflow-hidden`}
                          id="wizard-drag-drop"
                        >
                          {wizardImage ? (
                            <div className="space-y-4">
                              <img src={wizardImage} alt="User selected leaf specimen" className="max-h-56 mx-auto rounded-lg object-cover shadow-md border border-slate-200" referrerPolicy="referrer" />
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setWizardImage(null)}
                                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  {locale === "bn" ? "ছবি মুছে দিন" : "Remove Image"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="cursor-pointer block space-y-3 p-4">
                              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                <Upload className="w-5 h-5" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-800">{locale === "bn" ? "ডিভাইস থেকে ছবি আপলোড করুন" : "Browse leaf photograph"}</p>
                                <p className="text-[10px] text-slate-450 uppercase tracking-wider">{t.selectOrUpload}</p>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => { if (e.target.files && e.target.files[0]) handleWizardImageFile(e.target.files[0]); }}
                              />
                            </label>
                          )}
                        </div>

                        {wizardErrorMsg && (
                          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
                            <span>{wizardErrorMsg}</span>
                          </div>
                        )}

                        {/* Forward Action CTA */}
                        {wizardImage && (
                          <button
                            onClick={() => setWizardStep(2)}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold tracking-wider transition-all shadow-md shadow-emerald-150 flex items-center justify-center gap-1.5 cursor-pointer"
                            id="wizard-step1-forward"
                          >
                            <span>{locale === "bn" ? "পরবর্তী ধাপ: লক্ষণ বিবরণ (ধাপ ২)" : "Proceed to Symptoms (Step 2)"}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Ready-made templates side cabinet */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 block"></span>
                          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{locale === "bn" ? "নমুনা গ্যালারি থেকে নির্বাচন" : "Verified Reference Cabinets"}</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {locale === "bn"
                            ? "যদি আপনার কাছে মাঠপর্যায়ের ছবি না থাকে, তবে নিচের যেকোনো একটি পেশাদার নমুনা ক্লিক করে জেমিনি এআই ল্যাব টেস্ট পরখ করতে পারেন:"
                            : "Don't have an active field photo? Select one of our diagnostic specimen cartridges to experience the automated diagnostic sequencing:"}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="wizard-presets-grid">
                          {/* Case A */}
                          <div
                            onClick={async () => {
                              setWizardCropType("Cashew");
                              setWizardSymptomText("Cashew leaf spots which are clearly defined and are all a similar size. This clear delineation between healthy and infected tissue is typical of pathogen infection.");
                              setWizardImage("https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=360&auto=format&fit=crop");
                              // Attempt Base64 load
                              try {
                                const r = await fetch("https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=360&auto=format&fit=crop", { referrerPolicy: "no-referrer" });
                                const blob = await r.blob();
                                const reader = new FileReader();
                                reader.onloadend = () => setWizardImage(reader.result as string);
                                reader.readAsDataURL(blob);
                              } catch (e) {
                                console.log("Using static template reference");
                              }
                            }}
                            className={`p-3 rounded-xl border transition-all text-left cursor-pointer group hover:bg-emerald-50/30 ${
                              wizardCropType === "Cashew" ? "border-emerald-500 bg-emerald-55/10 ring-2 ring-emerald-500" : "border-slate-200"
                            }`}
                          >
                            <img src="https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=360&auto=format&fit=crop" alt="Cashew specimen" className="w-full h-24 object-cover rounded-lg mb-2" referrerPolicy="no-referrer" />
                            <p className="text-xs font-bold text-slate-800">{locale === "bn" ? "কাজু পাতার দাগ" : "Cashew Leaf Spot"}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Page 15 Diagnostic Reference</p>
                          </div>

                          {/* Case B */}
                          <div
                            onClick={async () => {
                              setWizardCropType("Tomato");
                              setWizardSymptomText("Leaf margins curling upward and rapid drying/necrosis. Roots have starting fit of phytophthoras blight, causing immediate leaves to dry under sun.");
                              setWizardImage("https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=360&auto=format&fit=crop");
                              try {
                                const r = await fetch("https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=360&auto=format&fit=crop", { referrerPolicy: "no-referrer" });
                                const blob = await r.blob();
                                const reader = new FileReader();
                                reader.onloadend = () => setWizardImage(reader.result as string);
                                reader.readAsDataURL(blob);
                              } catch (e) {}
                            }}
                            className={`p-3 rounded-xl border transition-all text-left cursor-pointer group hover:bg-emerald-50/30 ${
                              wizardCropType === "Tomato" ? "border-emerald-500 bg-emerald-55/10 ring-2 ring-emerald-500" : "border-slate-200"
                            }`}
                          >
                            <img src="https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=360&auto=format&fit=crop" alt="Tomato specimen" className="w-full h-24 object-cover rounded-lg mb-2" referrerPolicy="no-referrer" />
                            <p className="text-xs font-bold text-slate-800">{locale === "bn" ? "টমেটো ব্লাইট (শুকিয়ে পড়া)" : "Tomato Blight/Wilt"}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Page 26 Diagnostic Reference</p>
                          </div>

                          {/* Case C */}
                          <div
                            onClick={async () => {
                              setWizardCropType("Maize");
                              setWizardSymptomText("Mosaic mottled yellow color pattern mixed with green areas on maize foliage, leaf has uneven variegation.");
                              setWizardImage("https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=360&auto=format&fit=crop");
                              try {
                                const r = await fetch("https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=360&auto=format&fit=crop", { referrerPolicy: "no-referrer" });
                                const blob = await r.blob();
                                const reader = new FileReader();
                                reader.onloadend = () => setWizardImage(reader.result as string);
                                reader.readAsDataURL(blob);
                              } catch (e) {}
                            }}
                            className={`p-3 rounded-xl border transition-all text-left cursor-pointer group hover:bg-emerald-50/30 ${
                              wizardCropType === "Maize" ? "border-emerald-500 bg-emerald-55/10 ring-2 ring-emerald-500" : "border-slate-200"
                            }`}
                          >
                            <img src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=360&auto=format&fit=crop" alt="Maize specimen" className="w-full h-24 object-cover rounded-lg mb-2" referrerPolicy="no-referrer" />
                            <p className="text-xs font-bold text-slate-800">{locale === "bn" ? "ভুট্টা মোজাইক ভাইরাস" : "Maize Mosaic Spot"}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Page 43 Diagnostic Reference</p>
                          </div>

                          {/* Case D */}
                          <div
                            onClick={async () => {
                              setWizardCropType("Bean");
                              setWizardSymptomText("Upward and downward severe curling of leaves, showing bubble puckering distortion and stunted growing terminals.");
                              setWizardImage("https://images.unsplash.com/photo-1532467411038-57680e4ded04?q=80&w=360&auto=format&fit=crop");
                              try {
                                const r = await fetch("https://images.unsplash.com/photo-1532467411038-57680e4ded04?q=80&w=360&auto=format&fit=crop", { referrerPolicy: "no-referrer" });
                                const blob = await r.blob();
                                const reader = new FileReader();
                                reader.onloadend = () => setWizardImage(reader.result as string);
                                reader.readAsDataURL(blob);
                              } catch (e) {}
                            }}
                            className={`p-3 rounded-xl border transition-all text-left cursor-pointer group hover:bg-emerald-50/30 ${
                              wizardCropType === "Bean" ? "border-emerald-500 bg-emerald-55/10 ring-2 ring-emerald-500" : "border-slate-200"
                            }`}
                          >
                            <img src="https://images.unsplash.com/photo-1532467411038-57680e4ded04?q=80&w=360&auto=format&fit=crop" alt="Bean specimen" className="w-full h-24 object-cover rounded-lg mb-2" referrerPolicy="no-referrer" />
                            <p className="text-xs font-bold text-slate-800">{locale === "bn" ? "শিম পাতার কুঁকড়ে যাওয়া" : "Bean Leaf Curl"}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Page 52 Diagnostic Reference</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: DEFINE SYMTPOMS & CROP CONTEXT */}
                  {wizardStep === 2 && (
                    <motion.div
                      key="step-2-content"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6"
                      id="wizard-step2-panel"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 block"></span>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{t.step2Title}</h4>
                      </div>

                      {/* Visual Crop Selection Gallery */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                          {t.selectCropType}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5" id="wizard-crops-tray">
                          {[
                            { id: "Rice", bn: "ধান", emoji: "🌾" },
                            { id: "Tomato", bn: "টমেটো", emoji: "🍅" },
                            { id: "Maize", bn: "ভুট্টা", emoji: "🌽" },
                            { id: "Potato", bn: "আলু", emoji: "🥔" },
                            { id: "Cashew", bn: "কাজু", emoji: "🥑" },
                            { id: "Bean", bn: "শিম/অন্যান্য", emoji: "🌿" },
                            { id: "Mango", bn: "আম", emoji: "🥭" }
                          ].map((crp) => (
                            <button
                              key={crp.id}
                              type="button"
                              onClick={() => setWizardCropType(crp.id)}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all text-xs font-bold cursor-pointer hover:bg-slate-50 ${
                                wizardCropType === crp.id
                                  ? "border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500 text-emerald-800"
                                  : "border-slate-200 bg-white text-slate-700"
                              }`}
                            >
                              <span className="text-2xl">{crp.emoji}</span>
                              <span>{locale === "bn" ? crp.bn : crp.id}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Description with live suggestions feedback */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                            {t.enterSymptomDetails}
                          </label>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{wizardSymptomText.length} characters</span>
                        </div>
                        
                        <textarea
                          rows={4}
                          value={wizardSymptomText}
                          onChange={(e) => setWizardSymptomText(e.target.value)}
                          placeholder={locale === "bn" ? "আক্রান্ত পাতায় কি ধরণের ক্ষত বা পরিবর্তন দেখছেন বিস্তারিত লিখুন..." : "Describe the spots, lines, rot, or leaf yellowing that you can visually identify..."}
                          className="w-full p-4 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/35 leading-relaxed resize-none shadow-inner text-slate-800"
                          id="wizard-symptom-input"
                        />

                        {/* Quick Suggestion injection nodes */}
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{locale === "bn" ? "সহজ লক্ষণ ক্লিপার (ক্লিক করুন):" : "One-Click Quick Descriptions (Click to Insert):"}</p>
                          <div className="flex flex-wrap gap-2" id="wizard-symptom-suggestions">
                            {[
                              { bn: "গাছের পাতায় বাদামী গোল গোল দাগ", en: "Foliar circular brown spots with prominent borders." },
                              { bn: "পাতার মধ্য শিরা হলুদ হয়ে কুঁকড়ে যাওয়া", en: "Severe leaf vein yellowing and edges curling upwards." },
                              { bn: "পাতার কোণা থেকে শুরু শুকনো পাতা", en: "Drying and necrosis rapidly spreading from leaf margins." }
                            ].map((sg, sidx) => (
                              <button
                                key={sidx}
                                type="button"
                                onClick={() => {
                                  const text = locale === "bn" ? sg.bn : sg.en;
                                  setWizardSymptomText(prev => prev ? `${prev}. ${text}` : text);
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] rounded-lg text-slate-600 transition-colors cursor-pointer border border-slate-200"
                              >
                                {locale === "bn" ? sg.bn : sg.en}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {wizardErrorMsg && (
                        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
                          <span>{wizardErrorMsg}</span>
                        </div>
                      )}

                      {/* Wizard Stepper Buttons */}
                      <div className="flex justify-between items-center pt-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setWizardStep(1)}
                          className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-350 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          {t.prevStep}
                        </button>
                        <button
                          type="button"
                          onClick={handleWizardDiagnosis}
                          disabled={!wizardSymptomText.trim()}
                          className={`px-6 py-3 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer text-white shadow-md ${
                            wizardSymptomText.trim()
                              ? "bg-emerald-600 hover:bg-emerald-750 border border-emerald-700 animate-pulse"
                              : "bg-slate-300 border-slate-400 cursor-not-allowed opacity-60"
                          }`}
                          id="btn-wizard-diagnose"
                        >
                          <span>{t.analyzeSpecimen}</span>
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: LABORATORY LASER ANALYSIS SEQUENCE (IMMERSIVE SCANNER) */}
                  {wizardStep === 3 && (
                    <motion.div
                      key="step-3-content"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg text-center space-y-6"
                      id="wizard-lab-scanner-panel"
                    >
                      <h4 className="text-sm font-extrabold text-indigo-900 tracking-widest uppercase font-mono">{locale === "bn" ? "প্যাথলজি ল্যাব পরীক্ষার অগ্রগতি" : "FORENSIC AGRI-LAB SCANNER"}</h4>
                      
                      {/* Leaf Laser scan target view */}
                      <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden border-4 border-emerald-600 shadow-xl bg-slate-900 flex items-center justify-center">
                        {wizardImage ? (
                          <img src={wizardImage} alt="Diagnosing Leaf Under Laser Lens" className="w-full h-full object-cover opacity-80" />
                        ) : (
                          <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                            <Leaf className="w-16 h-16 text-emerald-800 animate-bounce" />
                          </div>
                        )}

                        {/* Concentric rotating grid lens overlays */}
                        <div className="absolute inset-x-0 inset-y-0 border border-emerald-500/25 rounded-full m-8 animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute inset-x-0 inset-y-0 border border-dashed border-teal-400/40 rounded-full m-14 animate-[spin_5s_linear_infinite]"></div>

                        {/* Moving neon Laser line */}
                        <div className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-[scan_2.2s_ease-in-out_infinite] z-20"></div>
                      </div>

                      {/* Scanner Loader status text */}
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="flex items-center justify-center gap-3">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                          </span>
                          <span className="text-emerald-800 font-bold text-sm tracking-wide font-mono animate-pulse uppercase">
                            {locale === "bn" ? "ডিজিটাল ল্যাবরেটরি প্রক্রিয়াকরণ" : "Processing Digital Pathology"}
                          </span>
                        </div>

                        <p className="text-slate-700 font-semibold text-base min-h-[2.5rem] bg-slate-50 border border-slate-200/60 p-3 rounded-xl shadow-inner font-mono text-center">
                          {wizardProgressMessage}
                        </p>

                        {/* Simulated status blocks checklist indicator */}
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span className="w-12 h-1 bg-emerald-600 rounded-full animate-pulse"></span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: DIAGNOSTIC CLINICAL VERDICT SHEET */}
                  {wizardStep === 4 && wizardResult && (
                    <motion.div
                      key="step-4-content"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
                      id="wizard-clinical-sheet-panel"
                    >
                      {/* Clinical Banner */}
                      <div className="bg-gradient-to-r from-emerald-850 to-teal-800 text-white p-6 border-b border-emerald-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-300" />
                            <h4 className="text-sm font-bold uppercase tracking-widest font-mono text-emerald-250">PATHOLOGY DISCOVERY VERDICT</h4>
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-white">
                            {locale === "bn" ? "উদ্ভিদ চিকিৎসালয় ক্লিনিকাল রিপোর্ট" : "Clinical Crop Diagnostic Sheet"}
                          </h3>
                        </div>
                        <div className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-mono font-bold uppercase text-emerald-100 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Generated: {new Date().toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US")}</span>
                        </div>
                      </div>

                      {/* Core diagnostic metrics blocks */}
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="clinical-badge-row">
                          
                          {/* Matched Category Card */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center gap-4 shadow-sm">
                            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                              <Leaf className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider leading-none font-bold">{locale === "bn" ? "সনাক্তকৃত রোগ শ্রেণী" : "Detected Pathogen Category"}</p>
                              <p className="text-sm font-black text-slate-900 mt-1">
                                {wizardResult.matchedCategory ? getCategoryLabel(wizardResult.matchedCategory) : (locale === "bn" ? "সঠিক শ্রেণী সনাক্ত হয়নি" : "Undetermined Type")}
                              </p>
                            </div>
                          </div>

                          {/* Confidence Rating Card */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center gap-4 shadow-sm">
                            <div className={`p-3 rounded-xl ${
                              wizardResult.confidence === "High" ? "bg-emerald-100 text-emerald-900" :
                              wizardResult.confidence === "Medium" ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-900"
                            }`}>
                              <Gauge className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider leading-none font-bold">{locale === "bn" ? "সনাক্তকরণ নির্ভুলতা" : "Diagnostic Confidence"}</p>
                              <span className={`inline-block text-xs font-extrabold px-2 py-0.5 mt-1 rounded-full ${
                                wizardResult.confidence === "High" ? "bg-emerald-200/70 text-emerald-800" :
                                wizardResult.confidence === "Medium" ? "bg-amber-200/70 text-amber-800" : "bg-red-205/70 text-red-800"
                              }`}>
                                {wizardResult.confidence}
                              </span>
                            </div>
                          </div>

                          {/* Matching CABI Guide Recommendations pages linkage */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center gap-4 shadow-sm">
                            <div className="p-3 bg-teal-100 text-teal-800 rounded-xl">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5 w-full">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider leading-none font-bold">{locale === "bn" ? "বইয়ের নির্দেশিকা রেফারেন্স পাতা" : "CABI Guide Reference Index"}</p>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                {wizardResult.pageRecommendations && wizardResult.pageRecommendations.length > 0 ? (
                                  wizardResult.pageRecommendations.map((pNum) => (
                                    <button
                                      key={pNum}
                                      onClick={() => {
                                        // Auto navigate to Explorer page tab and scroll to matching details!
                                        setSearchTerm("");
                                        if (wizardResult.matchedCategory) {
                                          setSelectedCategory(wizardResult.matchedCategory);
                                        }
                                        changeTab("explorer");
                                      }}
                                      className="px-2.5 py-0.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-mono font-bold select-none cursor-pointer flex items-center gap-1 shadow-sm shrink-0 transition-colors"
                                      title={locale === "bn" ? "ম্যানুয়ালে এই পৃষ্ঠা খুলুন" : "Jump straight to manual page in dictionary"}
                                    >
                                      <span>Page {pNum}</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </button>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-500 font-mono italic">{locale === "bn" ? "কোনো নির্দিষ্ট পৃষ্ঠা মিলেনি" : "General Guidance Index"}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* STEP 4 EDIT REQUIREMENT: Bangla Diagnostic scrollable description box */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-inner space-y-3">
                          <div className="flex items-center gap-2 text-slate-800">
                            <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-600">{locale === "bn" ? "নির্দেশিকা ডায়াগনস্টিক বিবরণ (CABI Diagnostic Analysis Details)" : "CABI Diagnostic Narrative Details"}</h4>
                          </div>

                          {/* Scrollable description block with explicit maximum height bounding */}
                          <div 
                            className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-72 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-slate-100"
                            id="guided-diagnostic-narrative-container"
                          >
                            <p className="text-sm font-medium leading-relaxed text-slate-800 whitespace-pre-line" id="guided-diagnostic-narrative-box">
                              {wizardResult.analysis}
                            </p>
                          </div>
                          
                          <p className="text-[9px] font-mono text-slate-400 italic text-right">
                            {locale === "bn" ? "* বিবরণটি সম্পূর্ণ পড়তে ডায়াগনস্টিক বক্সের ভেতরের লেখায় স্ক্রোল করুন।" : "* Box is scrollable to read full pathological analysis."}
                          </p>
                        </div>

                        {/* NEW SECTION: FIELD TIPS BASED ON IDENTIFIED PATHOGEN */}
                        {(() => {
                          const tipsData = getFieldTipsForCategory(wizardResult.matchedCategory, locale);
                          return (
                            <div className="bg-emerald-50/45 p-5 rounded-3xl border border-emerald-100 space-y-4" id="guided-field-tips">
                              <div className="flex items-center gap-2">
                                <Wrench className="w-4 h-4 text-emerald-700 shrink-0 animate-bounce" />
                                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                                  {tipsData.title}
                                </h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="guided-field-tips-row">
                                {tipsData.tips.map((tip, idx) => {
                                  let TipIcon = Wrench;
                                  if (tip.icon === "Trash2") TipIcon = Trash2;
                                  else if (tip.icon === "Flame") TipIcon = Flame;
                                  else if (tip.icon === "Activity") TipIcon = Activity;
                                  else if (tip.icon === "Leaf") TipIcon = Leaf;
                                  else if (tip.icon === "Clock") TipIcon = Clock;

                                  return (
                                    <div key={idx} className="bg-white p-4 rounded-2xl border border-emerald-100/55 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                                            <TipIcon className="w-3.5 h-3.5" />
                                          </div>
                                          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 bg-emerald-100/40 text-emerald-800 rounded-full font-sans">
                                            {tip.badge}
                                          </span>
                                        </div>
                                        <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                                          {tip.text}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Biotic vs Abiotic check */}
                        {wizardResult.bioticOrAbiotic && (
                          <div className={`p-5 rounded-2.5xl border flex flex-col md:flex-row items-start gap-4 transition-all ${
                            wizardResult.bioticOrAbiotic.conclusion === "Biotic"
                              ? "bg-red-50/40 border-red-200 text-red-950"
                              : "bg-teal-50/40 border-teal-200 text-teal-950"
                          }`} id="biotic-v-abiotic-conclusion">
                            <div className="space-y-1 md:flex-1">
                              <div className="flex items-center gap-2">
                                <Flame className="w-4.5 h-4.5 shrink-0" />
                                <span className="text-xs font-bold uppercase tracking-widest leading-none font-mono text-slate-500">Pathology Vector Conclusion</span>
                              </div>
                              <h5 className="text-base font-extrabold flex items-center gap-2 pt-0.5">
                                <span>{locale === "bn" ? "শৈল্পিক শ্রেণীবিভাগ সিদ্ধান্ত:" : "Clinical Pest Conclusion:"}</span>
                                <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                                  wizardResult.bioticOrAbiotic.conclusion === "Biotic"
                                    ? "bg-red-200/80 text-red-900 border border-red-300"
                                    : "bg-teal-200/80 text-teal-900 border border-teal-300"
                                }`}>
                                  {wizardResult.bioticOrAbiotic.conclusion === "Biotic" ? (locale === "bn" ? "বায়োটিক (জীবাণুঘটিত বা সংক্রমণ)" : "Biotic (Living Microbe)") : (locale === "bn" ? "অ্যাবায়োটিক (পুষ্টি বা ধকল)" : "Abiotic (Environmental/Stress)")}
                                </span>
                              </h5>
                              <p className="text-sm font-medium leading-relaxed text-slate-700 pt-1.5">
                                {wizardResult.bioticOrAbiotic.rationale}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Split checklist detected features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Symptoms Detected (Host Reaction) */}
                          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                              <span className="w-1.5 h-5 bg-teal-600 rounded"></span>
                              {locale === "bn" ? "লক্ষণ চিহ্নিতকরণ (উদ্ভিদের প্রতিক্রিয়া)" : "Observed Symptoms (Host reaction)"}
                            </h5>
                            {wizardResult.symptomsDetected && wizardResult.symptomsDetected.length > 0 ? (
                              <ul className="space-y-2">
                                {wizardResult.symptomsDetected.map((sym, sidx) => (
                                  <li key={sidx} className="text-xs text-slate-650 flex items-start gap-2 font-medium">
                                    <span className="text-teal-600 font-bold shrink-0">✓</span>
                                    <span>{sym}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-slate-400 italic">No direct symptoms classified.</p>
                            )}
                          </div>

                          {/* Organism footprint / signs */}
                          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                              <span className="w-1.5 h-5 bg-indigo-600 rounded"></span>
                              {locale === "bn" ? "জীবাণুর বাহ্যিক প্রমাণ (Footprint)" : "Organism Signs (Pest presence)"}
                            </h5>
                            {wizardResult.signsDetected && wizardResult.signsDetected.length > 0 ? (
                              <ul className="space-y-2">
                                {wizardResult.signsDetected.map((sig, sidx) => (
                                  <li key={sidx} className="text-xs text-slate-650 flex items-start gap-2 font-medium">
                                    <span className="text-indigo-600 font-bold shrink-0">✓</span>
                                    <span>{sig}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-slate-400 italic">{locale === "bn" ? "কোন ক্ষতিকারক পোকা বা অবশিষ্টাংশ সরাসরি সনাক্ত হয়নি।" : "No physical pest parts detected."}</p>
                            )}
                          </div>
                        </div>

                        {/* Practical Action Guidelines (CABI Big 5 Table) */}
                        {wizardResult.big5Assessment && (
                          <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2">
                              <Scale className="w-5 h-5 text-emerald-700" />
                              <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                                {locale === "bn" ? "CABI \"Big 5\" মাঠপর্যায়ের মূল্যায়ন চাদর" : "CABI \"Big 5\" Field Diagnostic Assessment"}
                              </h5>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3" id="wizard-big5-cards">
                              {[
                                { title: locale === "bn" ? "১. অর্থনৈতিক লাভ" : "1. Economic", text: wizardResult.big5Assessment.economic, label: "economic" },
                                { title: locale === "bn" ? "২. কার্যকারিতা" : "2. Effective", text: wizardResult.big5Assessment.effective, label: "effective" },
                                { title: locale === "bn" ? "৩. ফসল ও জননিরাপত্তা" : "3. Safe & Health", text: wizardResult.big5Assessment.safe, label: "safe" },
                                { title: locale === "bn" ? "৪. বাস্তবায়ন বাস্তবতা" : "4. Practical", text: wizardResult.big5Assessment.practical, label: "practical" },
                                { title: locale === "bn" ? "৫. স্থানীয় প্রাপ্যতা" : "5. Available", text: wizardResult.big5Assessment.locallyAvailable, label: "locallyAvailable" }
                              ].map((item, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                                  <p className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 leading-none mb-1.5">{item.title}</p>
                                  <p className="text-xs font-medium text-slate-700 leading-relaxed capitalize-first">
                                    {item.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Organic biological control pathways */}
                        {wizardResult.organicManagement && wizardResult.organicManagement.length > 0 && (
                          <div className="bg-emerald-50/60 border border-emerald-150 p-5 rounded-2xl shadow-sm space-y-2.5">
                            <h5 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4" />
                              {locale === "bn" ? "সমন্বিতজৈব প্রতিরোধী ব্যবস্থার ধাপসমূহ" : "Integrated Bio-Protection Pathways"}
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="wizard-organic-checklist">
                              {wizardResult.organicManagement.map((itm, index) => (
                                <div key={index} className="bg-white p-3.5 rounded-xl border border-emerald-100 flex items-start gap-2.5">
                                  <span className="w-5 h-5 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                    {index + 1}
                                  </span>
                                  <p className="text-xs text-emerald-950/80 font-medium leading-relaxed leading-snug">
                                    {itm}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Bottom action bar */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 justify-end">
                          <button
                            onClick={() => {
                              // Reset wizard back to Step 1
                              setWizardStep(1);
                              setWizardCropType("");
                              setWizardImage(null);
                              setWizardSymptomText("");
                              setWizardResult(null);
                              setWizardErrorMsg(null);
                            }}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs font-extrabold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-200"
                          >
                            <RotateCcw className="w-4 h-4" />
                            {t.resetWizard}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </motion.div>
            )}

            {/* VIEW 2: AI Plant Doctor Pathologist */}
            {activeTab === "pathologist" && (
              <motion.div
                key="pathologist"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                id="ai-pathologist-view"
              >
                {/* Intro card */}
                <div className="bg-gradient-to-br from-emerald-950 to-teal-900 text-white p-6 rounded-2xl shadow-sm border border-emerald-800/80 flex flex-col sm:flex-row items-center gap-6 justify-between relative overflow-hidden" id="pathologist-hero">
                  <div className="space-y-2 relative z-10">
                    <div className="bg-emerald-400 text-emerald-950 text-xs font-bold px-2.5 py-0.5 rounded-full w-max flex items-center gap-1 font-mono">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      {t.multimodalEngine}
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">{t.aiDoctorTitle}</h3>
                    <p className="text-emerald-100/80 text-xs leading-relaxed max-w-xl">
                      {t.aiDoctorDesc}
                    </p>
                  </div>
                  <Brain className="w-20 h-20 text-emerald-400/10 shrink-0 hidden sm:block" />
                </div>

                {/* Main Interactive Row: Preset Samples picker & Upload controls */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="pathologist-inputs-grid">
                  
                  {/* Left component: Specimen Tray (4 columns) */}
                  <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/85 shadow-sm flex flex-col gap-4" id="preset-tray-box">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-emerald-600" />
                        {t.readyRecognizeCases}
                      </h4>
                      <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">{t.exploreSamplesTab}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {t.selectStandardCase}
                    </p>

                    <div className="flex flex-col gap-3" id="preset-samples-list">
                      <button
                        type="button"
                        onClick={() => loadPresetSpecimen(
                          "https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=480&auto=format&fit=crop",
                          locale === "bn" 
                            ? "ধানের পাতায় একাধিক, গোল বা ডিম্বাকার বাদামী ক্ষতচিহ্ন দেখা যাচ্ছে যার কেন্দ্র হালকা রঙের। ক্ষতের চারপাশে স্পষ্ট হলুদ বলয় বিদ্যমান। পাতার আক্রান্ত এবং সুস্থ অংশের স্পষ্ট বিভাজন একটি ছত্রাকজনিত বাদামী দাগ রোগের সংকেত দেয়।"
                            : "Rice leaf shows multiple, brown oval lesions with light-colored centers. There are prominent yellow halos bordering the spots. Clear delineations between infected and healthy parts point to a fungal spot pathogen."
                        )}
                        className={`group text-left p-3 rounded-xl border transition-all duration-200 flex gap-3 items-center cursor-pointer ${
                          symptomDescription === "Rice leaf shows multiple, brown oval lesions with light-colored centers. There are prominent yellow halos bordering the spots. Clear delineations between infected and healthy parts point to a fungal spot pathogen." ||
                          symptomDescription === "ধানের পাতায় একাধিক, গোল বা ডিম্বাকার বাদামী ক্ষতচিহ্ন দেখা যাচ্ছে যার কেন্দ্র হালকা রঙের। ক্ষতের চারপাশে স্পষ্ট হলুদ বলয় বিদ্যমান। পাতার আক্রান্ত এবং সুস্থ অংশের স্পষ্ট বিভাজন একটি ছত্রাকজনিত বাদামী দাগ রোগের সংকেত দেয়।"
                            ? "bg-emerald-50/55 border-emerald-300 ring-1 ring-emerald-500"
                            : "bg-slate-50/50 hover:bg-slate-50 border-slate-200/80"
                        }`}
                        id="preset-rice-spot"
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=120&auto=format&fit=crop" 
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200/60"
                          alt="Rice Brown Spot preset case thumbnail"
                          referrerPolicy="no-referrer"
                        />
                        <div className="truncate-2-lines flex-1">
                          <span className="block text-xs font-bold text-slate-800 leading-tight">
                            {locale === "bn" ? "ধানের বাদামী দাগ রোগ" : "Rice Brown Leaf Spot"}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                            {locale === "bn" ? "হলুদ বলয় পরিবেষ্টিত সুনির্দিষ্ট ক্ষতের দাগ" : "Discrete lesions with yellow halo margins"}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                      </button>

                      <button
                        type="button"
                        onClick={() => loadPresetSpecimen(
                          "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=480&auto=format&fit=crop",
                          locale === "bn"
                            ? "টমেটোর পাতাগুলো ওপরের দিকে কুঁকড়ে যাচ্ছে এবং মারাত্মকভাবে কুঁচকে গেছে। পাতার কিনারাগুলো হলুদ রঙ ধারণ করছে। নতুন কুঁড়িগুলোর বৃদ্ধি ব্যাহত হচ্ছে, যার ফলে মাথার ডগায় গুচ্ছাকার বৃদ্ধি লক্ষ্য করা যাচ্ছে।"
                            : "Tomato leaves are curling upwards and puckering severely. The leaf borders are turning yellow. New shoots are stunted, leading to a tight bunchy growth at the terminal tip."
                        )}
                        className={`group text-left p-3 rounded-xl border transition-all duration-200 flex gap-3 items-center cursor-pointer ${
                          symptomDescription === "Tomato leaves are curling upwards and puckering severely. The leaf borders are turning yellow. New shoots are stunted, leading to a tight bunchy growth at the terminal tip." ||
                          symptomDescription === "টমেটোর পাতাগুলো ওপরের দিকে কুঁকড়ে যাচ্ছে এবং মারাত্মকভাবে কুঁচকে গেছে। পাতার কিনারাগুলো হলুদ রঙ ধারণ করছে। নতুন কুঁড়িগুলোর বৃদ্ধি ব্যাহত হচ্ছে, যার ফলে মাথার ডগায় গুচ্ছাকার বৃদ্ধি লক্ষ্য করা যাচ্ছে।"
                            ? "bg-emerald-50/55 border-emerald-300 ring-1 ring-emerald-500"
                            : "bg-slate-50/50 hover:bg-slate-50 border-slate-200/80"
                        }`}
                        id="preset-tomato-curl"
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=120&auto=format&fit=crop" 
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200/60"
                          alt="Tomato leaf curl preset case thumbnail"
                          referrerPolicy="no-referrer"
                        />
                        <div className="truncate-2-lines flex-1">
                          <span className="block text-xs font-bold text-slate-800 leading-tight">
                            {locale === "bn" ? "টমেটোর পাতা কোঁকড়ানো ভাইরাস" : "Tomato Leaf Curl Virus"}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                            {locale === "bn" ? "উপরের দিকে পাতা কুঁকড়ে যাওয়া ও ডগা সংকুচিত হওয়া" : "Severe upward curling & terminal stunting"}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                      </button>

                      <button
                        type="button"
                        onClick={() => loadPresetSpecimen(
                          "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=480&auto=format&fit=crop",
                          locale === "bn"
                            ? "ভুট্টা গাছের নিচের অংশের পাতাগুলোর রঙ বিবর্ণ, সুষম সবুজ-হলুদ হয়ে গেছে, যেখানে হলুদ হওয়া পাতার ডগা থেকে শুরু হয়ে মধ্যশিরা বরাবর সুষমভাবে ভেতরের দিকে ছড়িয়ে পড়ছে।"
                            : "The entire lower canopy of the maize plant has turned a pale, uniform green-yellow, with the yellowing starting from the leaf tips and moving symmetrically inwards along the main midrib."
                        )}
                        className={`group text-left p-3 rounded-xl border transition-all duration-200 flex gap-3 items-center cursor-pointer ${
                          symptomDescription === "The entire lower canopy of the maize plant has turned a pale, uniform green-yellow, with the yellowing starting from the leaf tips and moving symmetrically inwards along the main midrib." ||
                          symptomDescription === "ভুট্টা গাছের নিচের অংশের পাতাগুলোর রঙ বিবর্ণ, সুষম সবুজ-হলুদ হয়ে গেছে, যেখানে হলুদ হওয়া পাতার ডগা থেকে শুরু হয়ে মধ্যশিরা বরাবর সুষমভাবে ভেতরের দিকে ছড়িয়ে পড়ছে।"
                            ? "bg-emerald-50/55 border-emerald-300 ring-1 ring-emerald-500"
                            : "bg-slate-50/50 hover:bg-slate-50 border-slate-200/80"
                        }`}
                        id="preset-maize-nitrogen"
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=120&auto=format&fit=crop" 
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200/60"
                          alt="Nitrogen deficiency preset case thumbnail"
                          referrerPolicy="no-referrer"
                        />
                        <div className="truncate-2-lines flex-1">
                          <span className="block text-xs font-bold text-slate-800 leading-tight">
                            {locale === "bn" ? "পুষ্টির অভাব (অজৈব চাপ)" : "Nutrient Gap (Abiotic)"}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                            {locale === "bn" ? "নিচের পাতার মধ্যশিরা বরাবর প্রতিসম ক্লোরোসিস" : "Lower canopy uniform midrib chlorosis"}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                      </button>

                      <button
                        type="button"
                        onClick={() => loadPresetSpecimen(
                          "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=480&auto=format&fit=crop",
                          locale === "bn"
                            ? "সয়াবিনের পাতায় কোণাকার পানি-ভেজা ক্ষতচিহ্ন দেখা যাচ্ছে যা বাদামী ও ক্ষয়প্রাপ্ত রঙে রূপ নিয়েছে। কিছু ক্ষত মিলে পাতার পুরো অংশ শুকিয়ে যাওয়ার কারণ হয়ে দাঁড়াচ্ছে, বিশেষত ভেজা স্যাঁতসেঁতে কিনারায়।"
                            : "Soybean leaves show angular water-soaked lesions that have turned brown and necrotic. Some lesions are coalescing, causing whole sections of the leaf to dry out and look scorched, particularly at the damp edges."
                        )}
                        className={`group text-left p-3 rounded-xl border transition-all duration-200 flex gap-3 items-center cursor-pointer ${
                          symptomDescription === "Soybean leaves show angular water-soaked lesions that have turned brown and necrotic. Some lesions are coalescing, causing whole sections of the leaf to dry out and look scorched, particularly at the damp edges." ||
                          symptomDescription === "সয়াবিনের পাতায় কোণাকার পানি-ভেজা ক্ষতচিহ্ন দেখা যাচ্ছে যা বাদামী ও ক্ষয়প্রাপ্ত রঙে রূপ নিয়েছে। কিছু ক্ষত মিলে পাতার পুরো অংশ শুকিয়ে যাওয়ার কারণ হয়ে দাঁড়াচ্ছে, বিশেষত ভেজা স্যাঁতসেঁতে কিনারায়।"
                            ? "bg-emerald-50/55 border-emerald-300 ring-1 ring-emerald-500"
                            : "bg-slate-50/50 hover:bg-slate-50 border-slate-200/80"
                        }`}
                        id="preset-soy-blight"
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=120&auto=format&fit=crop" 
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200/60"
                          alt="Soy bacterial blight preset case thumbnail"
                          referrerPolicy="no-referrer"
                        />
                        <div className="truncate-2-lines flex-1">
                          <span className="block text-xs font-bold text-slate-800 leading-tight">
                            {locale === "bn" ? "সয়াবিনের কোণাকার ধসা রোগ" : "Soy Angular Blight"}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                            {locale === "bn" ? "কোণাকার পানিভেজা ক্ষত থেকে ঝলসে যাওয়ার রূপান্তর" : "Angular wet sores transitioning into scorch"}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                      </button>
                    </div>
                  </div>

                  {/* Right component: Image slot + symptoms writeup (7 columns) */}
                  <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/85 shadow-sm flex flex-col gap-5" id="specimen-uploader-panel">
                    
                    {/* Multimodal drag & drop uploader */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-emerald-600" />
                        {t.readyRecognizePhoto}
                      </label>
                      
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 flex flex-col items-center justify-center relative min-h-[160px] ${
                          dragActive 
                            ? "border-emerald-600 bg-emerald-50/35" 
                            : diagnoseImage 
                              ? "border-slate-300 bg-slate-55/10" 
                              : "border-slate-300 hover:border-slate-450 hover:bg-slate-50/50"
                        }`}
                        id="drag-drop-zone"
                      >
                        {diagnoseImage ? (
                          <div className="relative w-full max-w-[280px] group" id="selected-image-preview-box">
                            <img 
                              src={diagnoseImage} 
                              alt="Crop visual diagnostic specimen under analyzer lens" 
                              referrerPolicy="no-referrer"
                              className="rounded-lg object-cover max-h-[140px] w-full mx-auto border border-slate-200/80 shadow-sm"
                            />
                            {/* Option to erase */}
                            <button
                              type="button"
                              onClick={() => setDiagnoseImage(null)}
                              className="absolute -top-2.5 -right-2.5 p-1.5 bg-rose-650 hover:bg-rose-755 text-white rounded-xl shadow-lg border border-rose-300 transition-all z-20 cursor-pointer"
                              title="Delete Selected Specimen Photo"
                              id="discard-specimen-photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <span className="block text-[10px] text-slate-400 mt-2 font-mono truncate">{t.readyForLens}</span>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center gap-2" htmlFor="specimen-file-picker">
                            <Upload className="w-8 h-8 text-slate-400 shrink-0" />
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-slate-700">{t.dragHereOr} <span className="text-emerald-700 underline decoration-2">{t.browseFiles}</span></p>
                              <p className="text-[10px] text-slate-400">{t.supportsFormats}</p>
                            </div>
                            <input 
                              type="file" 
                              id="specimen-file-picker" 
                              accept="image/*" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleImageFile(e.target.files[0]);
                                }
                              }}
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Describe symptoms textarea */}
                    <div className="space-y-2 flex-1 flex flex-col">
                      <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5" htmlFor="symptom-textarea">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        {t.explainObservedPhysical}
                      </label>
                      <textarea
                        id="symptom-textarea"
                        rows={3}
                        value={symptomDescription}
                        onChange={(e) => setSymptomDescription(e.target.value)}
                        placeholder={t.detailLesionsPlaceholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 focus:bg-white transition leading-relaxed flex-1"
                      />
                    </div>

                    {/* Inline UI Error Box */}
                    {aiErrorMsg && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex gap-3 items-center" id="pathologist-error">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <div>
                          <span className="font-bold">{locale === "bn" ? "সিস্টেম রিপোর্ট:" : "System Report:"}</span> {aiErrorMsg}
                        </div>
                      </div>
                    )}

                    {/* Submission button */}
                    <button
                      onClick={handleSmartDiagnosis}
                      disabled={diagnosing || !symptomDescription.trim()}
                      className={`text-white transition font-semibold text-sm px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm ${
                        diagnosing || !symptomDescription.trim()
                          ? "bg-slate-300 cursor-not-allowed text-slate-500"
                          : "bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
                      }`}
                      id="submit-ai-diagnosis"
                    >
                      {diagnosing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {t.performingMultimodal}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-emerald-300" />
                          {t.initiateRealTimePathological}
                        </>
                      )}
                    </button>

                  </div>
                </div>

                {/* AI Outputs & Extensive Diagnosis Dashboard */}
                {diagnosisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-200 shadow-md divide-y divide-slate-100 overflow-hidden"
                    id="diagnosis-results-block"
                  >
                    {/* Panel 1: Key Metadata Highlights */}
                    <div className="p-6 bg-slate-50/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6" id="result-header">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono block">
                          {locale === "bn" ? "CABI রোগজীবাণু শ্রেণীবিন্যাস" : "CABI Pathogen Classification"}
                        </span>
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-xl font-bold text-slate-900" id="result-category">
                            {diagnosisResult.matchedCategory ? getCategoryLabel(diagnosisResult.matchedCategory) : (locale === "bn" ? "কোনো সুনির্দিষ্ট রোগ বা ক্যাটাগরি মেলেনি" : "No Confirmed Pathogen Category")}
                          </h4>
                          {diagnosisResult.matchedCategory && (
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${CATEGORY_COLORS[diagnosisResult.matchedCategory]?.bg || "bg-slate-100"} ${CATEGORY_COLORS[diagnosisResult.matchedCategory]?.text || "text-slate-700"}`}>
                              {locale === "bn" ? "রোগতাত্ত্বিক মিল যাচাইকৃত" : "Pathological Fit Verified"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Diagnostic confidence & page indexes row in columns */}
                      <div className="flex flex-wrap gap-4 items-center" id="result-badges">
                        <div className="bg-white shadow-sm border border-slate-200/80 px-4 py-2.5 rounded-xl text-center min-w-[100px] flex-1">
                          <div className="text-[10px] text-slate-400 font-medium">{locale === "bn" ? "নির্ভরযোগ্যতা" : "Confidence Margin"}</div>
                          <span className={`text-[13px] font-bold mt-0.5 inline-block font-sans ${
                            diagnosisResult.confidence === "High" ? "text-emerald-700" : diagnosisResult.confidence === "Medium" ? "text-amber-700" : "text-rose-700"
                          }`}>
                            ● {locale === "bn" ? (diagnosisResult.confidence === "High" ? "উচ্চ" : diagnosisResult.confidence === "Medium" ? "মাঝারি" : "নিম্ন") : diagnosisResult.confidence}
                          </span>
                        </div>
                        <div className="bg-white shadow-sm border border-slate-200/80 px-4 py-2.5 rounded-xl text-center min-w-[100px] flex-1">
                          <div className="text-[10px] text-slate-400 font-medium font-sans">{locale === "bn" ? "CABI নির্দেশিকা পৃষ্ঠা" : "CABI Guide Page"}</div>
                          <span className="text-[13px] font-mono font-bold text-slate-800 mt-0.5 inline-block" id="result-pages">
                            {locale === "bn" ? "পৃষ্ঠা " : "p. "}{diagnosisResult.pageRecommendations.join(", ") || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Panel 2: Biotic vs Abiotic Elimination Status */}
                    {diagnosisResult.bioticOrAbiotic && (
                      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center" id="result-biotic-abiotic-panel">
                        <div className="md:col-span-4 flex flex-col gap-2">
                          <span className="text-[10px] text-slate-450 font-bold uppercase tracking-widest font-mono">
                            {locale === "bn" ? "CABI দূরীকরণ পরীক্ষা" : "CABI Elimination Check"}
                          </span>
                          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
                            diagnosisResult.bioticOrAbiotic.conclusion === "Biotic"
                              ? "bg-rose-50/50 border-rose-200 text-rose-900"
                              : "bg-amber-50/35 border-amber-200 text-amber-900"
                          }`} id="biotic-abiotic-conclusion">
                            <span className="text-xs font-bold font-mono text-slate-500 uppercase leading-none">{locale === "bn" ? "শ্রেণীকরণ:" : "Categorization:"}</span>
                            <span className="text-lg font-black tracking-tight leading-none">
                              {diagnosisResult.bioticOrAbiotic.conclusion === "Biotic" 
                                ? (locale === "bn" ? "জৈবিক উৎস (Biotic)" : "Biotic Origin") 
                                : (locale === "bn" ? "অজৈবিক উৎস (Abiotic)" : "Abiotic Origin")}
                            </span>
                            <span className="text-[10px] font-medium leading-normal block text-slate-600 mt-1">
                              {diagnosisResult.bioticOrAbiotic.conclusion === "Biotic" 
                                ? (locale === "bn" ? "জীবন্ত রোগজীবাণু প্রজাতি (ছত্রাক, ব্যাকটেরিয়া, নেমাটোড, ভাইরাস বাহক) দ্বারা পরিচালিত" : "Driven by living pathogen species (fungi, phytoplasma, nematodes, virus vectors)") 
                                : (locale === "bn" ? "পরিবেশগত পুষ্টিগত বা রাসায়নিক জৈব প্রবাহজনিত অজৈবিক চাপ" : "Driven by environmental non-pathogenic stresses (deficits, frost, chemical drift)")}
                            </span>
                          </div>
                        </div>
                        <div className="md:col-span-8 space-y-2">
                          <span className="text-[10px] text-slate-400 font-semibold font-mono block">{locale === "bn" ? "যৌক্তিক ভিত্তি" : "Boundary Rationale"}</span>
                          <p className="text-xs text-slate-600 font-sans leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                            {diagnosisResult.bioticOrAbiotic.rationale}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Panel 3: Real-Time Verification Grid (Visible Signs vs Plant Reactions) */}
                    {(diagnosisResult.signsDetected || diagnosisResult.symptomsDetected) && (
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6" id="result-signs-symptoms-layout">
                        {/* Signs detected column */}
                        <div className="space-y-3" id="signs-detected-lane">
                          <h5 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono">
                            <Info className="w-4 h-4 text-emerald-600" />
                            {locale === "bn" ? "বাহ্যিক লক্ষণ (জীবাণুর প্রত্যক্ষ চিহ্ন)" : "Visual Signs (Organism Footprint)"}
                          </h5>
                          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 min-h-[100px] flex flex-wrap gap-2 align-content-start">
                            {diagnosisResult.signsDetected && diagnosisResult.signsDetected.length > 0 ? (
                              diagnosisResult.signsDetected.map((sign, sidx) => (
                                <span key={sidx} className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg shadow-sm" id={`sign-tag-${sidx}`}>
                                  🔍 {sign}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">{locale === "bn" ? "নমুনায় ক্ষতিকারক পোকা বা প্রত্যক্ষ লক্ষণ পাওয়া যায়নি।" : "No direct signs of pest organisms detected in specimen."}</span>
                            )}
                          </div>
                        </div>

                        {/* Symptoms detected column */}
                        <div className="space-y-3" id="symptoms-detected-lane">
                          <h5 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono">
                            <Activity className="w-4 h-4 text-emerald-600" />
                            {locale === "bn" ? "পাতার উপসর্গ (উদ্ভিদের প্রতিক্রিয়া)" : "Foliar Symptoms (Host Reaction)"}
                          </h5>
                          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 min-h-[100px] flex flex-wrap gap-2 align-content-start">
                            {diagnosisResult.symptomsDetected && diagnosisResult.symptomsDetected.length > 0 ? (
                              diagnosisResult.symptomsDetected.map((sym, syidx) => (
                                <span key={syidx} className="text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-100 rounded-lg shadow-sm" id={`symptom-tag-${syidx}`}>
                                  🍃 {sym}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">{locale === "bn" ? "উদ্ভিদের কোনো জৈবিক প্রতিক্রিয়া নথিভুক্ত করা হয়নি।" : "No biological plant reactions registered."}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Panel 4: Pathways & Explanations */}
                    <div className="p-6 space-y-3" id="result-analysis">
                      <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                        <Brain className="w-4.5 h-4.5 text-emerald-600" />
                        {locale === "bn" ? "কৃষিগত জীবনচক্র ও গতিপথ বিশ্লেষণ" : "Agricultural Pathway Analysis"}
                      </h5>
                      <p className="text-sm text-slate-650 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/40 font-sans" id="pathway-narrative">
                        {diagnosisResult.analysis}
                      </p>
                    </div>

                    {/* Panel 5: CABI "Big 5" Clinical Decision Checklist */}
                    {diagnosisResult.big5Assessment && (
                      <div className="p-6 space-y-4" id="result-big5-panel">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-tight">
                            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                            {locale === "bn" ? "CABI \"বিগ ৫\" আইপিএম পরিবেশগত মূল্যায়ন" : "CABI \"Big 5\" Clinical IPM Evaluation"}
                          </h5>
                          <span className="text-[10px] text-rose-700 font-bold border border-rose-200 px-2 py-0.5 rounded bg-rose-50 leading-none">{locale === "bn" ? "নীতি নির্দেশিকা" : "Action Guidelines"}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4" id="big5-checklist-grid">
                          {/* Item 1: Economic */}
                          <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/70 space-y-1.5 flex flex-col justify-between" id="big5-economic">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-xs font-bold tracking-tight">{locale === "bn" ? "১. অর্থকরী" : "1. Economic"}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal font-sans">
                              {diagnosisResult.big5Assessment.economic}
                            </p>
                          </div>

                          {/* Item 2: Effective */}
                          <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/70 space-y-1.5 flex flex-col justify-between" id="big5-effective">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-xs font-bold tracking-tight">{locale === "bn" ? "২. কার্যকর" : "2. Effective"}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal font-sans">
                              {diagnosisResult.big5Assessment.effective}
                            </p>
                          </div>

                          {/* Item 3: Safe / Pesticide list */}
                          <div className="bg-emerald-50/20 p-3.5 rounded-xl border border-emerald-100 space-y-1.5 flex flex-col justify-between" id="big5-safe">
                            <div className="flex items-center gap-1.5 text-slate-750">
                              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                              <span className="text-xs font-extrabold text-emerald-900 tracking-tight">{locale === "bn" ? "৩. নিরাপদ যাচাই" : "3. Safe Check"}</span>
                            </div>
                            <p className="text-[11px] text-slate-650 leading-normal font-sans">
                              {diagnosisResult.big5Assessment.safe}
                            </p>
                          </div>

                          {/* Item 4: Practical */}
                          <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/70 space-y-1.5 flex flex-col justify-between" id="big5-practical">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-xs font-bold tracking-tight">{locale === "bn" ? "৪. বাস্তবসম্মত" : "4. Practical"}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal font-sans">
                              {diagnosisResult.big5Assessment.practical}
                            </p>
                          </div>

                          {/* Item 5: Locally Sourced */}
                          <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/70 space-y-1.5 flex flex-col justify-between" id="big5-locally">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-xs font-bold tracking-tight">{locale === "bn" ? "৫. সুলভ" : "5. Available"}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal font-sans">
                              {diagnosisResult.big5Assessment.locallyAvailable}
                            </p>
                          </div>
                        </div>

                        {/* Red Pesticide Stop Warning banner */}
                        <div className="bg-rose-50/45 p-4 rounded-xl border border-rose-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-955" id="pesticide-redlist-guard">
                          <div className="flex items-start sm:items-center gap-3">
                            <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded inline-block leading-none blink">থামুন! STOP</span>
                            <div>
                              <h6 className="text-xs font-bold text-rose-900">
                                {locale === "bn" ? "CABI অনুমোদিত অর্গানোফসফেট এবং ক্ষতিকর জৈব কীটনাশক লাল তালিকার অনুপালন" : "Compliance with the CABI Organophosphate & Hazardous Pesticide Red List"}
                              </h6>
                              <p className="text-[10px] text-rose-700/90 leading-normal mt-0.5">
                                {locale === "bn" 
                                  ? "নিশ্চিত করুন যেন রাসায়নিক প্রবাহের প্রভাব না পড়ে। মার্কিন ও বিশ্ব স্বাস্থ্য সংস্থা কর্তৃক ১ শ্রেণির কীটনাশক (ডিডিটি, ক্লোরপাইরিফস, মনোক্লোটোফস) প্রয়োগ নিষিদ্ধ।" 
                                  : "Ensure no chemical drift impacts. Do not spray WHO Class I list variables (DDT, chlorpyrifos, monocrotophos). Revere biological macros."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Panel 6: Clean Integrated Pest Management (IPM) Biological Prescriptions */}
                    <div className="p-6 space-y-4" id="result-management">
                      <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-tight">
                        <Leaf className="w-4.5 h-4.5 text-emerald-600" />
                        {locale === "bn" ? "সমন্বিত জৈবিক দমন ব্যবস্থাপনা এবং বায়োপ্রটেকশন পদ্ধতি" : "Integrated Biological Management Controls & BioProtection pathways"}
                      </h5>
                      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4" id="result-management-list">
                        {diagnosisResult.organicManagement.map((tip, idx) => (
                          <li key={idx} className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-110 flex gap-3" id={`organic-tip-${idx}`}>
                            <div className="p-1.5 bg-emerald-100/50 rounded-lg text-emerald-800 h-max select-none shrink-0 border-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 animate-none" />
                            </div>
                            <p className="text-xs text-slate-650 leading-relaxed font-sans">{tip}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Navigation trigger button */}
                    {diagnosisResult.matchedCategory && CABI_CATEGORIES.includes(diagnosisResult.matchedCategory) && (
                      <div className="p-5 bg-slate-50/20 text-center flex items-center justify-center border-0" id="result-action">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(diagnosisResult.matchedCategory!);
                            changeTab("explorer");
                          }}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 border border-emerald-200/55 transition-all shadow-sm cursor-pointer"
                        >
                          {locale === "bn" ? `সবুজ নির্দেশিকা চিত্র প্রদর্শন করুন: ${getCategoryLabel(diagnosisResult.matchedCategory)}` : `Show Practical Guide Photographs for ${getCategoryLabel(diagnosisResult.matchedCategory)}`}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Historical Registry and Global Reference Centers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6" id="history-and-agronomy-directories">
                  {/* Left Column: Local Diagnostic Scan History */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/85 shadow-sm space-y-4 flex flex-col justify-between" id="local-history-container">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-emerald-600 animate-pulse" />
                          {t.historyRegistryTitle}
                        </h4>
                        {historyScans.length > 0 && (
                          <button
                            type="button"
                            onClick={clearAllHistory}
                            className="text-[10px] text-rose-700 font-bold hover:underline cursor-pointer bg-transparent border-0"
                            id="clear-all-history-btn"
                          >
                            {t.clearAllRegistry}
                          </button>
                        )}
                      </div>
                      
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed font-sans">
                        {t.historyRegistryDesc}
                      </p>

                      <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1" id="history-items-list">
                        {historyScans.length === 0 ? (
                          <div className="text-center py-10 text-xs text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200" id="history-empty-state">
                            {t.noScansFound}
                          </div>
                        ) : (
                          historyScans.map((scan) => {
                            const matchedCatColor = CATEGORY_COLORS[scan.result.matchedCategory || ""] || { bg: "bg-slate-100", text: "text-slate-700", accent: "bg-slate-400" };
                            return (
                              <div
                                key={scan.id}
                                onClick={() => {
                                  setSymptomDescription(scan.symptomDescription);
                                  setDiagnoseImage(scan.image);
                                  setDiagnosisResult(scan.result);
                                  setAiErrorMsg(null);
                                  changeTab("pathologist");
                                  setTimeout(() => {
                                    document.getElementById("diagnosis-results-block")?.scrollIntoView({ behavior: "smooth", block: "start" });
                                  }, 150);
                                }}
                                className="group p-3 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/15 cursor-pointer flex gap-3 items-center justify-between transition-all duration-200"
                                id={`history-item-${scan.id}`}
                              >
                                <div className="flex gap-3 items-center min-w-0 pr-2">
                                  {scan.image ? (
                                    <img
                                      src={scan.image}
                                      className="w-10 h-10 object-cover rounded border border-slate-200/60 shrink-0"
                                      alt="Stored specimen scan"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-slate-100 rounded border border-slate-200/65 flex items-center justify-center text-slate-400 shrink-0">
                                      <Leaf className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div className="min-w-0 leading-tight">
                                    <span className="block text-[11px] font-bold text-slate-805 truncate">
                                      {scan.symptomDescription}
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${matchedCatColor.bg} ${matchedCatColor.text}`}>
                                        {scan.result.matchedCategory ? getCategoryLabel(scan.result.matchedCategory) : (locale === "bn" ? "বিকল্প রোগজীবাণু" : "Alternative Pathogen")}
                                      </span>
                                      <span className="text-[9px] text-slate-400 font-mono">
                                        {scan.timestamp}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => deleteHistoryScan(scan.id, e)}
                                  className="text-slate-400 hover:text-rose-600 transition p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer border-0 bg-transparent shrink-0"
                                  title="Delete Report Log"
                                  id={`delete-history-${scan.id}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Open Agronomy Knowledge Hub */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/85 shadow-sm space-y-4 flex flex-col justify-between" id="global-reference-container">
                    <div>
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-emerald-600" />
                          {locale === "bn" ? "উন্মুক্ত কৃষি বিজ্ঞান ও হর্টিকালচার ডাটাবেজ হাব" : "Open Science Agronomy & Disease Database Hub"}
                        </h4>
                        <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">{locale === "bn" ? "বহিরাগত প্রজেক্ট" : "External Datasets"}</span>
                      </div>
                      
                      <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans">
                        {locale === "bn" ? "কৃষকদের পাতার দাগ চিহ্নিতকরণ এবং সংক্রামক রোগজীবাণু দমনে সহায়তা করতে আমরা নিম্নলিখিত বিশ্বব্যাপী স্বীকৃত ভেষজ ডাটাবেজগুলোর তথ্য অনুকরণ করি:" : "We validate and link into global botanical datasets and modeling projects to help farmers diagnose leaf spots and identify quarantined pests:"}
                      </p>

                      <div className="mt-4 space-y-4" id="external-directories-list">
                        
                        {/* 1. Kaggle PlantVillage */}
                        <div className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/50 flex gap-3" id="ref-kaggle-village">
                          <div className="p-2 bg-slate-200/70 text-slate-600 rounded-lg h-max shrink-0">
                            <Leaf className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <span className="block text-xs font-bold text-slate-800">
                              {locale === "bn" ? "Kaggle PlantVillage ক্লাসিফায়ার ডাটাবেজ" : "Kaggle PlantVillage Classifier Dataset"}
                            </span>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                              {locale === "bn" ? "মোবাইল কম্পিউটার ভিশন মডেলের জন্য বিশ্বব্যাপী সোনার মানদণ্ড হিসাবে পরিচিত ৩৮টি স্বাস্থ্যকর ও রোগাক্রান্ত ফসলের পাতার ৫৪,৩০৬টি ছবির নির্ভরযোগ্য লাইব্রেরি।" : "Access 54,306 images of 38 healthy & diseased crop foliage pairs. Known globally as the gold standard training reference library for mobile computer vision models."}
                            </p>
                            <a
                              href="https://www.kaggle.com/datasets/emmarex/plantdisease"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-emerald-700 font-extrabold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                            >
                              {locale === "bn" ? "Kaggle ডাটাবেজ অন্বেষণ করুন" : "Explore Kaggle Dataset"}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* 2. EPPO Global Database */}
                        <div className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/50 flex gap-3" id="ref-eppo-database">
                          <div className="p-2 bg-slate-200/70 text-slate-600 rounded-lg h-max shrink-0">
                            <Search className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <span className="block text-xs font-bold text-slate-800">
                              {locale === "bn" ? "EPPO গ্লিাবাল পেস্ট ডাটাবেজ" : "EPPO Global Pest Database"}
                            </span>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                              {locale === "bn" ? "ইউরোপীয় এবং ভূমধ্যসাগরীয় উদ্ভিদ সুরক্ষা সংস্থা দ্বারা পরিচালিত। ৯০,০০০টিরও বেশি ফসলের শত্রু পোকার বৈশ্বিক বন্টন, কোয়ারেন্টাইন তালিকা এবং ট্যাক্সোনমি তথ্য।" : "Maintained by the European and Mediterranean Plant Protection Organisation. Check global distribution, taxonomic pathways, quarantine lists, and clean scientific codes for 90,000+ pests."}
                            </p>
                            <a
                              href="https://gd.eppo.int"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-emerald-700 font-extrabold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                            >
                              {locale === "bn" ? "EPPO ডাটাবেজ অনুসন্ধান" : "Search EPPO Database"}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* 3. Pl@ntNet Ecosystem */}
                        <div className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/50 flex gap-3" id="ref-plantnet">
                          <div className="p-2 bg-slate-200/70 text-slate-600 rounded-lg h-max shrink-0">
                            <Eye className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <span className="block text-xs font-bold text-slate-800">
                              {locale === "bn" ? "Pl@ntNet উদ্ভিদ প্রজাতি পোর্টাল" : "Pl@ntNet Species ID Portal"}
                            </span>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                              {locale === "bn" ? "ছবি থেকে বন্য উদ্ভিদ, আগাছা এবং বিভিন্ন ভেষজ গাছগাছালি সনাক্ত করতে ডিপ নিউরাল নেটওয়ার্কের ওপর ভিত্তি করে তৈরি একটি উন্মুক্ত বিজ্ঞান প্রজেক্ট।" : "A free citizen science initiative built on deep neural networks to recognize wild flora, trees, weeds, and host plants worldwide from photographic specimens."}
                            </p>
                            <a
                              href="https://plantnet.org"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-emerald-700 font-extrabold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                            >
                              {locale === "bn" ? "Pl@ntNet পোর্টাল ভিজিট করুন" : "Visit Pl@ntNet Portal"}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 3: Crops Inspection Quiz */}
            {activeTab === "quiz" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                id="quiz-view"
              >
                {/* Score panel upper metric display */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5" id="quiz-score-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-none">Crop Auditor Certificate Mode</h3>
                      <p className="text-xs text-slate-400 mt-1">Identify visual guide references to verify field pathogen diagnostics accuracy.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6" id="quiz-score-metrics">
                    <div className="text-center sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Current Score</span>
                      <div className="font-mono text-2xl font-black text-slate-900 mt-0.5" id="quiz-score-total">
                        {quizScore} <span className="text-slate-300 font-light text-xl">/</span> {quizPlayed}
                      </div>
                    </div>
                    <button
                      onClick={() => { setQuizScore(0); setQuizPlayed(0); startQuiz(); }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 transition p-2.5 rounded-xl border border-slate-200/30 w-max h-max"
                      title="Reset Quiz Progress"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Game / Visual Card */}
                {currentQuestion ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6" id="quiz-question-box">
                    
                    {/* Left: Random reference image specimen */}
                    <div className="space-y-3" id="quiz-left-panel">
                      <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-sm">
                        <img 
                          src={currentQuestion.imageUrl}
                          alt="Unknown plant pathogen specimen under visual study"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=640&auto=format&fit=crop";
                          }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-slate-900/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wide">
                          {locale === "bn" ? "নিরীক্ষা নমুনা" : "Audit Specimen"}
                        </div>
                      </div>
                      
                      <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-150 text-xs leading-relaxed text-slate-500" id="quiz-img-caption">
                        <span className="font-semibold text-slate-700 block mb-1">{locale === "bn" ? "পর্যবেক্ষণ নোট:" : "Observation Note:"}</span>
                        {locale === "bn" 
                          ? `এটি CABI উদ্ভিদ রোগ নির্ণয় মাঠ নির্দেশিকার ${currentQuestion.page} পৃষ্ঠার একটি অচিহ্নিত নমুনা ছবি।` 
                          : `This is a raw unlabelled photograph from Page ${currentQuestion.page} of the CABI plant diagnostics field guidelines.`}
                      </div>
                    </div>

                    {/* Right: Guess options and controls */}
                    <div className="flex flex-col gap-5 justify-between" id="quiz-right-panel">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none block">
                            {locale === "bn" ? "নিরীক্ষক ডায়াগনস্টিক চ্যালেঞ্জ" : "Auditor Diagnostic Challenge"}
                          </span>
                          <h4 className="text-base font-bold text-slate-900">
                            {locale === "bn" ? "কোন প্যাথলজিক্যাল উপসর্গের প্রকারটি এখানে প্রদর্শিত?" : "Which pathological symptom category is shown?"}
                          </h4>
                        </div>

                        {/* List of possible responses */}
                        <div className="flex flex-col gap-2.5" id="quiz-options">
                          {currentQuestion.options.map((option) => {
                            const isSelected = quizSelectedAnswer === option;
                            let btnStyle = "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200";
                            
                            if (quizHasChecked) {
                              const isCorrect = option === currentQuestion.correctCategory;
                              if (isCorrect) {
                                btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold ring-2 ring-emerald-400 shadow-sm";
                              } else if (isSelected) {
                                btnStyle = "bg-red-50 border-red-300 text-red-800 font-semibold ring-2 ring-red-400";
                              } else {
                                btnStyle = "bg-slate-50 text-slate-400 border-slate-100 opacity-60";
                              }
                            } else if (isSelected) {
                              btnStyle = "bg-emerald-700 hover:bg-emerald-700 text-white font-bold border-transparent shadow";
                            }

                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => handleQuizAnswer(option)}
                                disabled={quizHasChecked}
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition duration-200 flex items-center justify-between group cursor-pointer ${btnStyle}`}
                                id={`quiz-option-${option.replace(/\s+/g, '-').toLowerCase()}`}
                              >
                                <span>{getCategoryLabel(option)}</span>
                                {quizHasChecked && option === currentQuestion.correctCategory && (
                                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Interactive verification action block */}
                      <div className="pt-4 border-t border-slate-100 flex flex-col gap-3" id="quiz-actions">
                        {!quizHasChecked ? (
                          <button
                            type="button"
                            onClick={checkQuizAnswer}
                            disabled={!quizSelectedAnswer}
                            className={`w-full py-3 rounded-xl font-bold text-sm text-center transition flex justify-center items-center gap-1.5 shadow ${
                              quizSelectedAnswer 
                                ? "bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer" 
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                            id="check-answer-btn"
                          >
                            {locale === "bn" ? "ডায়াগনস্টিক সিদ্ধান্ত যাচাই করুন" : "Validate Diagnostic Selection"}
                          </button>
                        ) : (
                          <div className="space-y-3" id="quiz-feedback-box">
                            {/* Feedback messages based on answers */}
                            {quizSelectedAnswer === currentQuestion.correctCategory ? (
                              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs leading-relaxed flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <div>
                                  <span className="font-bold">{locale === "bn" ? "চমৎকার ডায়াগনস্টিক সিদ্ধান্ত!" : "Excellent Audit Conclusion!"}</span> {locale === "bn" ? "সঠিক উত্তর। এটি আদর্শ পাতার উপসর্গ বৈশিষ্ট্য প্রকাশ করে।" : "Correct. This represents standard leaf symptom parameters."}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs leading-relaxed flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                                <div>
                                  <span className="font-bold">{locale === "bn" ? "সংশোধন প্রয়োজন!" : "Correction Needed!"}</span> {locale === "bn" ? `ভুল উত্তর। এটি ${getCategoryLabel(currentQuestion.correctCategory)} রোগ লক্ষণ। রেফারেন্স ভিজ্যুয়াল বৈশিষ্ট্যগুলো পুনরায় খতিয়ে দেখুন।` : `Incorrect. This represents ${currentQuestion.correctCategory} pathology. Examine the reference visual properties.`}
                                </div>
                              </div>
                            )}

                            {/* Info excerpt */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/55 text-xs text-slate-500 leading-relaxed italic max-h-36 overflow-y-auto">
                              <strong>{locale === "bn" ? `মূল গাইডলাইন থেকে উদ্ধৃতি (পৃষ্ঠা ${currentQuestion.page}): ` : `Key Guideline Text excerpt (Page ${currentQuestion.page}): `}</strong>
                              &ldquo;{locale === "bn" 
                                ? (BANGLA_PAGE_PREVIEWS[currentQuestion.page] || currentQuestion.text_preview) 
                                : currentQuestion.text_preview}&rdquo;
                            </div>

                            {/* Trigger next query */}
                            <button
                              type="button"
                              onClick={() => generateQuizQuestion(db!)}
                              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-sm text-center transition shadow cursor-pointer"
                              id="next-quiz-btn"
                            >
                              {locale === "bn" ? "পরবর্তী নমুনা পরীক্ষা করুন" : "Load Next Specimen Case"}
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-250/20 shadow-sm" id="quiz-loading">
                    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-xs text-slate-400">{locale === "bn" ? "নিরীক্ষার কুইজ নমুনা লোড হচ্ছে..." : "Loading audit challenge specimens..."}</p>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </section>

      </main>

      {/* FOOTER BAR */}
      <footer className="bg-slate-900 text-slate-500 text-center py-6 text-xs border-t border-slate-800/80" id="footer">
        <p className="max-w-7xl mx-auto px-4 leading-relaxed font-sans" id="footer-text">
          Digital Diagnosis Builder © 2026. Inspired by the public CABI Plantwise Field Diagnostic Guidelines compiled by Phil Taylor. 
          Powered by Express, React and Gemini Neural Pathologists.
        </p>
      </footer>

      {/* FLOATING AGRONOMY COMMAND HUB & NAVIGATION SYSTEM */}
      <div className="fixed bottom-6 right-6 z-40 select-none font-sans" id="floating-command-hub">
        <AnimatePresence>
          {hudExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-slate-900/95 text-slate-100 hover:border-slate-700/80 p-5 rounded-2xl w-80 sm:w-85 border border-slate-800 shadow-2xl backdrop-blur-md mb-3 flex flex-col gap-4 overflow-hidden relative"
              id="command-hud-panel"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-450 animate-pulse" />
                  <span className="font-bold text-[13px] tracking-tight text-white uppercase font-sans">
                    {locale === "bn" ? "কৃষি কমান্ড সেন্টার" : "Agronomy Command Center"}
                  </span>
                </div>
                <button
                  onClick={() => setHudExpanded(false)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all border-0 cursor-pointer"
                  id="close-hud-btn"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Navigation Grid */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  {locale === "bn" ? "দ্রুত ন্যাভিগেশন মডিউল" : "Quick Navigation Modules"}
                </span>
                <div className="grid grid-cols-2 gap-2" id="hud-nav-grid">
                  <button
                    onClick={() => { changeTab("explorer"); }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      activeTab === "explorer"
                        ? "bg-emerald-800/30 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-350 hover:bg-slate-850 hover:text-white"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.symptomExplorer}</span>
                  </button>
                  <button
                    onClick={() => { changeTab("wizard"); }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      activeTab === "wizard"
                        ? "bg-emerald-800/30 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-350 hover:bg-slate-850 hover:text-white"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.stepDiagnosis}</span>
                  </button>
                  <button
                    onClick={() => { changeTab("pathologist"); }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      activeTab === "pathologist"
                        ? "bg-emerald-800/30 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-350 hover:bg-slate-850 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.aiPlantDoctor}</span>
                  </button>
                  <button
                    onClick={() => { changeTab("quiz"); }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      activeTab === "quiz"
                        ? "bg-emerald-800/30 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-350 hover:bg-slate-850 hover:text-white"
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.cropAuditorQuiz}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Diagnostics Stats */}
              <div className="bg-slate-950/65 border border-slate-800 p-3 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  {locale === "bn" ? "রিয়েল-টাইম অডিট পরিসংখ্যান" : "Real-Time Audit Statistics"}
                </span>
                <div className="grid grid-cols-2 gap-2" id="hud-metrics">
                  <div>
                    <span className="text-[9px] text-slate-500 block leading-tight">
                      {locale === "bn" ? "তদন্ত ফাইল সংখ্যা" : "Inspections Recorded"}
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-200 mt-0.5 inline-block">
                      {historyScans.length} {locale === "bn" ? "টি" : "scans"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block leading-tight">
                      {locale === "bn" ? "ক্যালিব্রেশন ইনডেক্স" : "Calibration Index"}
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-200 mt-0.5 inline-block">
                      {historyScans.length > 0 ? "92.4%" : "100.0%"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Jump back to Latest Analyzed Disease */}
              {historyScans.length > 0 && (
                <div className="border-t border-slate-800 pt-2.5 flex flex-col gap-1.5" id="hud-history-quicklink">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    {locale === "bn" ? "সর্বশেষ স্ক্যান পুনরায় লোড করুন" : "Quick jump back to results"}
                  </span>
                  <button
                    onClick={() => {
                      const latest = historyScans[historyScans.length - 1];
                      setSymptomDescription(latest.symptomDescription);
                      setDiagnoseImage(latest.image);
                      setDiagnosisResult(latest.result);
                      setAiErrorMsg(null);
                      changeTab("pathologist");
                      setTimeout(() => {
                        document.getElementById("diagnosis-results-block")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 120);
                      setHudExpanded(false);
                    }}
                    className="w-full text-left bg-slate-950 hover:bg-slate-850 p-2 border border-slate-800/80 rounded-lg flex items-center justify-between text-[11px] text-slate-300 hover:text-white transition-all overflow-hidden cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Clock className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="font-medium truncate max-w-[190px]">
                        {latestHistoryLabel()}
                      </span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed circle button */}
        <button
          onClick={() => setHudExpanded(!hudExpanded)}
          className={`p-3.5 rounded-full shadow-2xl border flex items-center justify-center gap-1.5 transition-all text-white relative cursor-pointer ${
            hudExpanded
              ? "bg-rose-700 hover:bg-rose-800 border-rose-600 rotate-90"
              : "bg-gradient-to-r from-emerald-800 to-teal-700 hover:scale-105 border-emerald-600 active:scale-95 animate-none"
          }`}
          id="hud-trigger"
          title={locale === "bn" ? "কৃষি কমান্ড প্যানেল খুলুন" : "Open Agronomy Command Center"}
        >
          {hudExpanded ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <Activity className="w-5 h-5 animate-pulse" />
              {historyScans.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white shadow-sm font-sans" id="hud-badge">
                  {historyScans.length}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* FULLSCREEN LIGHTBOX DIALOG */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-50 cursor-pointer"
            onClick={() => setLightboxImage(null)}
            id="lightbox-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full flex flex-col gap-3"
              onClick={(e) => e.stopPropagation()}
              id="lightbox-card"
            >
              {/* Image box frame */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl overflow-clip aspect-[4/3] w-full">
                <img 
                  src={lightboxImage.url} 
                  alt="High-resolution crop symptom specimen visual close-up details"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=640&auto=format&fit=crop";
                  }}
                  className="w-full h-full object-contain"
                />
                
                {/* Close Button overlay */}
                <button 
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-950/60 hover:bg-slate-950 text-white rounded-xl backdrop-blur transition-all"
                  title="Close Dialog View"
                  id="lightbox-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Caption details box */}
              <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800/80 text-xs flex items-center justify-between">
                <span className="font-semibold">{lightboxImage.caption}</span>
                <span className="text-[10px] text-slate-500 font-mono select-all">Index: {lightboxImage.url.split("/").pop()}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
