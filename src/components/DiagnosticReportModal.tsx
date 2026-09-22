"use client";

import React, { useState, useRef } from "react";
import {
  FileText,
  Printer,
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  User,
  MapPin,
  Phone,
  Sprout,
  Shield,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { AIDiagnosisResult } from "@/lib/types";

interface DiagnosticReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AIDiagnosisResult;
  specimenImage?: string | null;
  locale?: "en" | "bn";
  categoryLabel?: string;
}

export const DiagnosticReportModal: React.FC<DiagnosticReportModalProps> = ({
  isOpen,
  onClose,
  result,
  specimenImage,
  locale = "en",
  categoryLabel,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  // Editable Farmer & Field details for the official advisory slip
  const [farmerName, setFarmerName] = useState("");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [villageUpazila, setVillageUpazila] = useState("");
  const [cropVariety, setCropVariety] = useState("");
  const [fieldPlotSize, setFieldPlotSize] = useState("");
  const [reportDate] = useState(() => new Date().toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }));
  const [reportId] = useState(() => `CABI-EXT-${Math.floor(100000 + Math.random() * 900000)}`);

  if (!isOpen) return null;

  // Handle high-resolution PDF download using jsPDF + html2canvas
  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    setPdfSuccessMessage(null);

    try {
      const element = reportRef.current;
      
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      // Capture the styled report canvas with retina 2x scaling
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1024,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width mm
      const pageHeight = 297; // A4 height mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle multi-page if content overflows A4
      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `CABI_Diagnostic_Report_${reportId}.pdf`;
      pdf.save(fileName);
      setPdfSuccessMessage(
        locale === "bn"
          ? "পিডিএফ রিপোর্ট সফলভাবে ডাউনলোড হয়েছে!"
          : "PDF report downloaded successfully!"
      );
      setTimeout(() => setPdfSuccessMessage(null), 4000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      // Fallback to browser print dialog
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const displayCategory = categoryLabel || result.matchedCategory || (locale === "bn" ? "অনির্দিষ্ট রোগ" : "General Foliar Disorder");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Action Header (Excluded from Print) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 text-white no-print">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>{locale === "bn" ? "কৃষি অফিস রিপোর্ট এক্সপোর্ট" : "Agricultural Extension Diagnostic Report"}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                  {reportId}
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                {locale === "bn"
                  ? "উপজেলা কৃষি সম্প্রসারণ অফিসে প্রদর্শনের জন্য প্রমিত প্রিন্ট ও পিডিএফ নথি"
                  : "Formatted advisory slip for farmers to take to local Agricultural Extension Officers"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
              title={locale === "bn" ? "ব্রাউজার থেকে সরাসরি প্রিন্ট করুন" : "Print using browser dialog"}
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{locale === "bn" ? "প্রিন্ট" : "Print"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-50"
              title={locale === "bn" ? "পিডিএফ ফাইল ডাউনলোড করুন" : "Save as PDF file"}
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{locale === "bn" ? "পিডিএফ তৈরি হচ্ছে..." : "Generating..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{locale === "bn" ? "PDF ডাউনলোড" : "Save PDF"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Farmer Information Fill Banner (Excluded from Print) */}
        <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/60 no-print">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {locale === "bn" ? "ঐচ্ছিক কৃষকের বিবরণ যোগ করুন (প্রিন্ট কপিতে যুক্ত হবে):" : "Add Farmer Field Details (Included on official slip):"}
            </span>
            {pdfSuccessMessage && (
              <span className="text-xs text-emerald-400 font-semibold animate-pulse">
                ✓ {pdfSuccessMessage}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <input
              type="text"
              placeholder={locale === "bn" ? "কৃষকের নাম..." : "Farmer's Name..."}
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 text-xs focus:border-emerald-500 outline-none"
            />
            <input
              type="text"
              placeholder={locale === "bn" ? "মোবাইল নম্বর..." : "Phone Number..."}
              value={farmerPhone}
              onChange={(e) => setFarmerPhone(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 text-xs focus:border-emerald-500 outline-none"
            />
            <input
              type="text"
              placeholder={locale === "bn" ? "গ্রাম / উপজেলা..." : "Village / Upazila..."}
              value={villageUpazila}
              onChange={(e) => setVillageUpazila(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 text-xs focus:border-emerald-500 outline-none"
            />
            <input
              type="text"
              placeholder={locale === "bn" ? "ফসলের জাত..." : "Crop Variety..."}
              value={cropVariety}
              onChange={(e) => setCropVariety(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 text-xs focus:border-emerald-500 outline-none"
            />
            <input
              type="text"
              placeholder={locale === "bn" ? "প্লট / জমির মাপ..." : "Plot / Acreage..."}
              value={fieldPlotSize}
              onChange={(e) => setFieldPlotSize(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 text-xs focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* REPORT SHEET BODY (This area is rendered onto canvas / printed) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/90 print:bg-white print:p-0">
          <div
            ref={reportRef}
            id="printable-diagnostic-report"
            className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-300 print:border-0 print:shadow-none max-w-[210mm] mx-auto text-[12px] leading-normal font-sans"
            style={{ width: "100%", minHeight: "270mm", backgroundColor: "#ffffff" }}
          >
            
            {/* 1. Official Letterhead Header */}
            <div className="border-b-2 border-emerald-700 pb-4 mb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0 border border-emerald-600">
                    🌱
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-emerald-950 uppercase tracking-tight font-serif">
                      {locale === "bn" ? "উদ্ভিদ স্বাস্থ্য ও রোগ নির্ণয় পরামর্শপত্র" : "CABI Plantwise Field Diagnostic Advisory"}
                    </h1>
                    <p className="text-[11px] font-semibold text-emerald-800 mt-0.5">
                      {locale === "bn"
                        ? "কৃষি সম্প্রসারণ অধিদপ্তর ও মাঠ পর্যায়ের কর্মকর্তাদের জন্য প্রামাণ্য নথি"
                        : "Field Prescription & Diagnostic Referral Slip for Agricultural Extension Service"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      CABI Plantwise Diagnostic Guidelines Standard • Reference Edition
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-block bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-right">
                    <span className="block text-[9px] font-mono text-emerald-800 font-bold uppercase">Case ID</span>
                    <span className="text-xs font-mono font-black text-slate-900">{reportId}</span>
                  </div>
                  <span className="block text-[9px] text-slate-500 font-mono mt-1">Date: {reportDate}</span>
                </div>
              </div>

              {/* Farmer & Field Plot Identification Table */}
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[9px] font-semibold uppercase">{locale === "bn" ? "কৃষক:" : "Farmer:"}</span>
                  <span className="font-bold text-slate-900">{farmerName || (locale === "bn" ? "সাধারণ চাষী" : "Local Farmer")}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] font-semibold uppercase">{locale === "bn" ? "মোবাইল:" : "Phone:"}</span>
                  <span className="font-bold text-slate-900 font-mono">{farmerPhone || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] font-semibold uppercase">{locale === "bn" ? "এলাকা / উপজেলা:" : "Village / Upazila:"}</span>
                  <span className="font-bold text-slate-900">{villageUpazila || (locale === "bn" ? "উপজেলা কৃষি কার্যালয় এলাকা" : "Extension Zone")}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] font-semibold uppercase">{locale === "bn" ? "ফসল ও জাত:" : "Crop & Variety:"}</span>
                  <span className="font-bold text-emerald-800">{cropVariety || "Field Sample"} {fieldPlotSize ? `(${fieldPlotSize})` : ""}</span>
                </div>
              </div>
            </div>

            {/* 2. Core Clinical Assessment & Specimen Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-start">
              
              {/* Primary Diagnostic Findings (2 columns) */}
              <div className="md:col-span-2 space-y-3">
                <div className="bg-emerald-50/70 border-l-4 border-emerald-600 p-3 rounded-r-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono uppercase text-emerald-800 tracking-wider">
                      {locale === "bn" ? "সনাক্তকৃত রোগ বা লক্ষণ শ্রেণী:" : "Identified Symptom Category:"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white">
                      {result.confidence || "High"} Confidence
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 mt-0.5">
                    {displayCategory}
                  </h2>
                  <p className="text-[11px] text-slate-700 mt-1 font-serif leading-relaxed">
                    {result.analysis}
                  </p>
                </div>

                {/* Biotic vs Abiotic Elimination */}
                {result.bioticOrAbiotic && (
                  <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50/60 flex items-start gap-2.5">
                    <div className={`p-1.5 rounded-lg shrink-0 ${result.bioticOrAbiotic.conclusion === "Biotic" ? "bg-rose-100 text-rose-800" : "bg-teal-100 text-teal-800"}`}>
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-600">
                          {locale === "bn" ? "উৎস শ্রেণীকরণ:" : "Causal Classification:"}
                        </span>
                        <span className={`text-[11px] font-bold uppercase ${result.bioticOrAbiotic.conclusion === "Biotic" ? "text-rose-700" : "text-teal-700"}`}>
                          {result.bioticOrAbiotic.conclusion === "Biotic" 
                            ? (locale === "bn" ? "জৈবিক (Biotic - ছত্রাক/ব্যাকটেরিয়া/ভাইরাস)" : "Biotic (Living Pathogen / Pest)") 
                            : (locale === "bn" ? "অজৈবিক (Abiotic - পুষ্টিহীনতা বা আবহাওয়া)" : "Abiotic (Nutrient Deficit / Stress)")}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-650 mt-0.5 leading-normal">
                        {result.bioticOrAbiotic.rationale}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Specimen Photo Preview */}
              <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-mono uppercase text-slate-500 font-bold mb-1">
                  {locale === "bn" ? "আক্রান্ত পাতার নমুনা ছবি" : "Specimen Photograph"}
                </span>
                {specimenImage ? (
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center">
                    <img
                      src={specimenImage}
                      alt="Crop disease specimen"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[4/3] rounded-lg border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 p-2">
                    <Sprout className="w-8 h-8 text-emerald-400 mb-1" />
                    <span className="text-[9px] font-mono text-center">Specimen verified via CABI manual visual key</span>
                  </div>
                )}
                <span className="text-[9px] text-slate-400 mt-1 font-mono">Verified Field Specimen</span>
              </div>
            </div>

            {/* 3. Observed Host Symptoms vs Pest Signs */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50/40">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-600" />
                  {locale === "bn" ? "উদ্ভিদের প্রতিক্রিয়া (লক্ষণ)" : "Host Symptoms Observed"}
                </span>
                <ul className="space-y-1 text-[10px] text-slate-700">
                  {result.symptomsDetected && result.symptomsDetected.length > 0 ? (
                    result.symptomsDetected.map((sym, sidx) => (
                      <li key={sidx} className="flex items-start gap-1">
                        <span className="text-teal-600 font-bold">✓</span>
                        <span>{sym}</span>
                      </li>
                    ))
                  ) : (
                    <li className="italic text-slate-400">Typical foliar symptoms consistent with diagnosis</li>
                  )}
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50/40">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  {locale === "bn" ? "জীবাণুর প্রত্যক্ষ চিহ্ন (Signs)" : "Pest Organism Signs"}
                </span>
                <ul className="space-y-1 text-[10px] text-slate-700">
                  {result.signsDetected && result.signsDetected.length > 0 ? (
                    result.signsDetected.map((sig, sidx) => (
                      <li key={sidx} className="flex items-start gap-1">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>{sig}</span>
                      </li>
                    ))
                  ) : (
                    <li className="italic text-slate-400">No physical insect parts; pathogen mycelium microscopic</li>
                  )}
                </ul>
              </div>
            </div>

            {/* 4. Actionable Management & Advisory Protocols (IPM) */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase text-emerald-900 tracking-wide flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {locale === "bn" ? "মাঠ পর্যায়ের প্রতিকার ও সমন্বিত বালাই ব্যবস্থাপনা (IPM)" : "Recommended Integrated Pest Management (IPM) Plan"}
                </span>
                <span className="text-[9px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  CABI Green List Safe
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {result.organicManagement && result.organicManagement.slice(0, 3).map((tip, idx) => (
                  <div key={idx} className="border border-emerald-200/80 rounded-xl p-2.5 bg-emerald-50/30 text-[10px] text-slate-800">
                    <span className="font-bold text-emerald-800 block mb-0.5">
                      {idx === 0 ? "১. জমি ও সাংস্কৃতিক পরিচর্যা" : idx === 1 ? "২. জৈবিক প্রতিকার / বায়োপ্রটেকশন" : "৩. রাসায়নিক ও প্রতিরোধমূলক ব্যবস্থা"}
                    </span>
                    <p className="leading-snug text-slate-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Pesticide Red List Safety Notice */}
            <div className="mb-4 border border-rose-200 bg-rose-50/60 rounded-xl p-2.5 flex items-center gap-2 text-[10px] text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold uppercase tracking-wider text-rose-800">
                  {locale === "bn" ? "সতর্কতা ও পরিবেশ বান্ধব চাষাবাদ বিধি:" : "WHO Class I & Hazardous Pesticides Prohibition Notice:"}
                </span>
                <p className="text-[9px] text-rose-700 mt-0.5 leading-normal">
                  {locale === "bn"
                    ? "উপজেলা কৃষি কর্মকর্তার অনুমোদন ছাড়া কোনো উচ্চমাত্রার নিষিদ্ধ কীটনাশক প্রয়োগ করবেন না। শুধুমাত্র অনুমোদিত ডোজ এবং সঠিক সময় মেনে ওষুধ স্প্রে করুন।"
                    : "Do not use unapproved hazardous agrochemicals (monocrotophos, DDT, endosulfan). Strictly obtain extension officer prescription before synthetic application."}
                </p>
              </div>
            </div>

            {/* 6. Official Agricultural Extension Officer Verification & Prescription Section */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50/50 mt-4 page-break-inside-avoid">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-800" />
                  <span className="text-xs font-black uppercase text-emerald-950 tracking-wider">
                    {locale === "bn" ? "উপজেলা কৃষি সম্প্রসারণ কর্মকর্তা / এসএএও (SAAO) এর জন্য স্থান" : "For Agricultural Extension Officer (SAAO / AEO) Official Use"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-600">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" className="rounded" /> {locale === "bn" ? "মাঠ পরিদর্শন সম্পন্ন" : "Field Visited"}
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" className="rounded" /> {locale === "bn" ? "ল্যাব নমুনা প্রেরিত" : "Lab Sent"}
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px]">
                <div>
                  <span className="block text-[9px] font-semibold uppercase text-slate-500 mb-1">
                    {locale === "bn" ? "কর্মকর্তার পর্যবেক্ষণ ও প্রেসক্রিপশন:" : "Official Prescription & Observations:"}
                  </span>
                  <div className="border border-slate-200 rounded-lg p-2 h-16 bg-white space-y-2">
                    <div className="border-b border-dashed border-slate-200 h-3"></div>
                    <div className="border-b border-dashed border-slate-200 h-3"></div>
                    <div className="border-b border-dashed border-slate-200 h-3"></div>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <span className="block text-[9px] font-semibold uppercase text-slate-500 mb-1">
                      {locale === "bn" ? "সুপারিশকৃত বালাইনাশকের নাম ও মাত্রা:" : "Prescribed Active Ingredient & Dose:"}
                    </span>
                    <div className="border border-slate-200 rounded-lg p-2 h-7 bg-white"></div>
                  </div>

                  <div className="flex justify-between items-end pt-3 text-[9px] text-slate-500">
                    <div>
                      <span>তারিখ: ________________</span>
                    </div>
                    <div className="text-right">
                      <div className="w-28 border-b border-slate-400 mb-1"></div>
                      <span>কর্মকর্তার স্বাক্ষর ও সীলমোহর</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Disclaimer */}
            <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[8px] font-mono text-slate-400">
              <span>CABI Plantwise Diagnostic Engine • Powered by Open Agriculture Pathology Standards</span>
              <span>Doc Ref: {reportId} • Generated via PWA Offline Agricultural Terminal</span>
            </div>

          </div>
        </div>

        {/* Modal Footer Controls (Excluded from Print) */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 no-print">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {locale === "bn"
                ? "A4 সাইজে প্রিন্ট বা পিডিএফে সংরক্ষণের জন্য নিখুঁত ফরম্যাট"
                : "Calibrated for standard A4 printing and mobile PDF archival"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
            >
              {locale === "bn" ? "বন্ধ করুন" : "Close"}
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{locale === "bn" ? "PDF ডাউনলোড করুন" : "Download PDF Report"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
