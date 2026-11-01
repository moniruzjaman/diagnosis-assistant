// Client-side diagnosis heuristic — used on static deployments (GitHub Pages)
// where the server-side /api/diagnose route is not available.
//
// This ports the keyword-matching expert system from the original Next.js
// API route. It maps symptom descriptions to one of the 10 CABI visual
// symptom categories and produces a structured result (signs, symptoms,
// biotic/abiotic verdict, Big 5 IPM assessment, organic management) in
// Bangla or English. It is deterministic and works fully offline.

import { AIDiagnosisResult } from "./types";
import { diagnoseViaFreeAi } from "./freeAiDiagnose";

type Locale = "bn" | "en";

interface DiagnoseInput {
  symptomDescription: string;
  image?: string | null;
  locale?: Locale;
}

// Default management / assessment blocks (used when no keyword matches)
function defaultBlocks(locale: Locale) {
  if (locale === "bn") {
    return {
      analysis:
        "কোনো নির্দিষ্ট রোগ সনাক্তকরণ সম্পন্ন হয়নি। বিস্তারিত উপদেশের জন্য এআই ইঞ্জিন সংযুক্ত করুন।",
      pageRecommendations: [15] as number[],
      organicManagement: [
        "জীবাণুমুক্ত কাঁচি দিয়ে রোগাক্রান্ত পাতা কেটে ফেলুন যাতে জীবাণুর স্পোর ছড়াতে না পারে।",
        "ফসলের সঠিক দূরত্ব বজায় রেখে বাতাস চলাচলের সুযোগ করে দিন এবং সন্ধ্যায় অতিরিক্ত পানি দেওয়া বন্ধ করুন।",
        "রোগ প্রতিরোধে ট্রাইকোডার্মা বা জৈব নিম তেলের মিশ্রণ স্প্রে করুন।",
      ],
      bioticOrAbiotic: {
        conclusion: "Biotic" as "Biotic" | "Abiotic",
        rationale:
          "পাতার ক্ষত চিহ্নের স্পষ্ট সীমানা দেখে ধারণা করা হচ্ছে এটি একটি জীবন্ত প্যাথোজেন (ছত্রাক বা ব্যাকটেরিয়া) দ্বারা আক্রান্ত।",
      },
      signsDetected: ["পাতার নিচের দিকে ছত্রাকের স্পোর", "কোনো দৃশ্যমান পোকার মলমূত্র নেই"],
      symptomsDetected: ["ক্লোরোটিক বা হলুদ ছোপ দাগ", "স্থানীয় কোষকলা ক্ষয় (নেক্রোসিস)"],
      big5Assessment: {
        economic:
          "পাতার চিকিৎসা সময়মতো করলে ফসলের সালোকসংশ্লেষণ ক্ষমতা রক্ষা পাবে, যা ফলন হ্রাসের তুলনায় বেশি সাশ্রয়ী।",
        effective:
          "নিম পাতার নির্যাস এবং ট্রাইকোডার্মা মাটিতে রোগ সৃষ্টিকারী ছত্রাকের বৃদ্ধির হার নিয়ন্ত্রণে বিজ্ঞানসম্মতভাবে প্রমাণিত।",
        safe: "১০০% নিরাপদ। ক্ষতিকারক অর্গানোফসফেট কীটনাশক বর্জন করে CABI লাল তালিকার নীতিমালা সম্পূর্ণরূপে মেনে চলে।",
        practical:
          "রোগাক্রান্ত অংশ কেটে ফেলা ক্ষুদ্র ও মাঝারি কৃষকদের জন্য অত্যন্ত সহজ ও মাঠপর্যায়ে সরাসরি বাস্তবায়নযোগ্য।",
        locallyAvailable:
          "নিম পাতা, ছাই ও অন্যান্য উপাদান স্থানীয় বাজারে নামমাত্র মূল্যে বা খামারে বিনামূল্যে সংগ্রহ করা সম্ভব।",
      },
    };
  }
  return {
    analysis:
      "No diagnostic match concluded. Connect the AI engine to enable active smart assistant recommendations.",
    pageRecommendations: [15] as number[],
    organicManagement: [
      "Prune infected leaves with disinfected shears to halt spreading pathogen spores.",
      "Promote air circulation by proper crop spacing and avoid overhead watering in evenings.",
      "Apply organic microbial compost tea or neem oil spray as a preventative natural bio-pesticide.",
    ],
    bioticOrAbiotic: {
      conclusion: "Biotic" as "Biotic" | "Abiotic",
      rationale:
        "Clear boundaries and visual lesions suggest a living active pathogen (fungus/bacteria) rather than a symmetrical background nutrient deficit.",
    },
    signsDetected: ["Pathogen spores on leaf undersides", "No visible insect frass"],
    symptomsDetected: ["Chlorotic spots", "Local tissue death"],
    big5Assessment: {
      economic:
        "Foliar treatments pay for themselves by salvaging photosynthetic capability before spreading.",
      effective:
        "Neem extracts and biological copper washes are scientifically proven to restrict spore germination.",
      safe: "100% safe. Adheres strictly to the CABI Red List policy by avoiding chemical organophosphate pesticides.",
      practical: "Physical pruning is highly practical for small-holder farmers and household scale.",
      locallyAvailable: "Neem leaves and wood ash are easily collected on-farm at zero financial cost.",
    },
  };
}

// Keyword → CABI category mapping with full localized payloads.
// Bangla keyword fragments are matched alongside English ones so the
// heuristic works for farmers typing in either language.
//
// Diagnosis resolution order:
//   1. Free Pollinations AI (browser-callable, no key, works on static Pages)
//   2. Dev-only /api/diagnose route (when running locally with the Next server)
//   3. Deterministic client-side heuristic (offline fallback)
// The heuristic is always available, so the app never fails to produce a
// structured result even if the network or AI service is unavailable.
export async function diagnoseViaApiOrHeuristic(
  input: DiagnoseInput
): Promise<AIDiagnosisResult> {
  const { symptomDescription, image, locale } = input;

  // 1. Free Pollinations AI — primary path on the published static site.
  const aiResult = await diagnoseViaFreeAi({ symptomDescription, image, locale });
  if (aiResult) {
    return aiResult;
  }

  // 2. Dev-only server route (absent on a static export).
  try {
    const res = await fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptomDescription, image, locale }),
    });
    if (res.ok) {
      const data = (await res.json()) as AIDiagnosisResult;
      if (data && data.matchedCategory !== undefined) {
        return data;
      }
    }
  } catch {
    // static export — route absent; fall through to heuristic
  }

  // 3. Deterministic heuristic fallback.
  return diagnoseSymptoms(input);
}

export function diagnoseSymptoms(input: DiagnoseInput): AIDiagnosisResult {
  const symptomDescription = input.symptomDescription || "";
  const locale: Locale = input.locale || "bn";
  const base = defaultBlocks(locale);

  let matchedCategory: string | null = null;
  let analysis = base.analysis;
  let pageRecommendations = base.pageRecommendations;
  let organicManagement = base.organicManagement;
  let bioticOrAbiotic = base.bioticOrAbiotic;
  let signsDetected = base.signsDetected;
  let symptomsDetected = base.symptomsDetected;
  let big5Assessment = base.big5Assessment;

  const lower = symptomDescription.toLowerCase();

  // Leaf spot — circular lesions, halos, brown spots
  if (
    lower.includes("spot") || lower.includes("circle") || lower.includes("lesion") ||
    lower.includes("halo") || lower.includes("দাগ") || lower.includes("ছোপ") ||
    lower.includes("গোল") || lower.includes("বাদামী")
  ) {
    matchedCategory = "Leaf spot";
    if (locale === "bn") {
      analysis =
        "পাতায় গোলাকার বা ডিম্বাকৃতির বাদামী ক্ষতচিহ্ন এবং কেন্দ্রে হালকা রঙের স্পষ্ট সীমানা দেখে এটি 'Leaf spot' (পাতার দাগ) রোগ হিসেবে চিহ্নিত হয়েছে। সাধারণত Bipolaris, Cercospora বা Alternaria প্রজাতির ছত্রাক এর জন্য দায়ী।";
      pageRecommendations = [15, 32, 99];
      signsDetected = [
        "🔍 কেন্দ্রে ছাই রঙের ছত্রাকের দাগ (Fungal lesion center)",
        "ম্যাগনিফায়ার দিয়ে দেখলে কালো বিন্দু ফ্রুটিং বডি",
      ];
      symptomsDetected = [
        "🍃 গোলাকার বা ডিম্বাকৃতির বাদামী ক্ষতচিহ্ন (Elliptical brown spots)",
        "ক্ষতের চারপাশে স্পষ্ট হলুদ বলয় (Halo)",
        "স্থানীয় কোষকলা ক্ষয় (নেক্রোসিস)",
      ];
    } else {
      analysis =
        "Matched 'Leaf spot' based on visual references of circular lesions and necrotic spots identified in your details. Typically caused by fungal genera such as Bipolaris, Cercospora or Alternaria.";
      pageRecommendations = [15, 32, 99];
      signsDetected = [
        "Fungal fruiting bodies (black pinpoints under magnification)",
        "Yellow halo boundary",
      ];
      symptomsDetected = ["Circular necrotic leaf lesions", "Localized chlorosis"];
    }
  }
  // Wilt — drooping, vascular collapse
  else if (
    lower.includes("wilt") || lower.includes("droop") || lower.includes("hang") ||
    lower.includes("ন্তু") || lower.includes("ঝুল") || lower.includes("শুকা")
  ) {
    matchedCategory = "Wilt";
    if (locale === "bn") {
      analysis =
        "পাতা ও কাণ্ড দ্রুত ঝুলে পড়া এবং রস পরিবহন ব্যাহত হওয়ার লক্ষণ থেকে এটি 'Wilt' (অনাবৃষ্টিজনিত শুকানো) রোগ হিসেবে সনাক্ত হয়েছে। সাধারণত Fusarium, Verticillium বা Ralstonia দ্বারা জাইলেম নালি বন্ধ হয়ে যাওয়ার কারণে ঘটে।";
      pageRecommendations = [26, 93];
      organicManagement = [
        "মূল পচন বা তারের মতো পোকার জন্য মূল পরীক্ষা করুন এবং জমির নিষ্কাশন ব্যবস্থা উন্নত করুন।",
        "উপকারী মাইকোরাইজা ছত্রাক মাটিতে যোগ করে মূলের রোগ প্রতিরোধ ক্ষমতা বাড়ান।",
        "কভার ক্রপ দিয়ে কঠোর ফসল চক্র পদ্ধতি মেনে চলে মাটি বাহিত প্যাথোজেনের জীবনচক্র ভাঙুন।",
      ];
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "দ্রুত স্থানীয় ঝুলে পড়া খরা নয় বরং জাইলেম নালিতে অণুজীবের বাধার ইঙ্গিত দেয়।",
      };
      signsDetected = ["কাণ্ড কাটলে ভেতরে কালচে জাইলেম স্তর", "পানিতে সামান্য ব্যাকটেরিয়া স্রাব"];
      symptomsDetected = ["টার্গর চাপ হ্রাস", "পাতা ঝুলে পড়া", "পেটিওল নিচের দিকে ধসে পড়া"];
      big5Assessment = {
        economic: "Solanaceae পরিবারের ফসলে নিয়ন্ত্রণহীন উইল্ট ১০০% ফলন ধ্বংস করতে পারে, তাই উচ্চ অগ্রাধিকার।",
        effective: "রোগ প্রতিরোধী জাত ব্যবহারই মাটি বাহিত উইল্ট প্যাথোজেনের বিরুদ্ধে একমাত্র দীর্ঘমেয়াদী সমাধান।",
        safe: "মাটি স্টেরিলাইজার এড়িয়ে জৈব দমনকারী মাটি (ট্রাইকোডার্মা) উন্নয়নে নির্ভর করে।",
        practical: "সেচ নিষ্কাশন পরিবর্তন শারীরিকভাবে কঠিন কিন্তু অত্যন্ত সম্ভব।",
        locallyAvailable: "উপকারী কম্পোস্ট ও প্রতিরোধী বীজ স্থানীয় বাজারে সহজে পাওয়া যায়।",
      };
    } else {
      analysis =
        "Matched 'Wilt' based on moisture loss patterns reported in leaves and stem structural collapses. Usually caused by xylem-vessel occlusion from Fusarium, Verticillium or Ralstonia.";
      pageRecommendations = [26, 93];
      organicManagement = [
        "Inspect roots for phytophthora rot or wireworms, improve drainage significantly.",
        "Add beneficial mycorrhizal fungi to bolster root immunity against vascular blockages.",
        "Practice strict crop rotation with cover crops to break weed/soil pathogen lifecycles.",
      ];
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "Rapid localized drooping suggests microbial vascular blockages in the xylem vessels rather than a gradual drought.",
      };
      signsDetected = ["Discoloured dark xylem streaks inside a split stem", "Minor bacterial streaming in water"];
      symptomsDetected = ["Loss of turgor pressure", "Leaf drooping", "Downward collapse of petioles"];
      big5Assessment = {
        economic: "High priority since unchecked wilts can destroy 100% of Solanaceous crop yields.",
        effective: "Using resistant varieties is the only 100% effective long-term defense against soil wilt pathogens.",
        safe: "Avoids soil sterilizers; relies on biological suppressive soil enhancements (Trichoderma).",
        practical: "Irrigation drainage modification is physically demanding but highly feasible.",
        locallyAvailable: "Beneficial composts and resistant seeds are easily obtained on local markets.",
      };
    }
  }
  // Drying / necrosis / blight — burning, withering, brown patches
  else if (
    lower.includes("burn") || lower.includes("dry") || lower.includes("wither") ||
    lower.includes("brown") || lower.includes("blight") || lower.includes("necrosis") ||
    lower.includes("ঝলস") || lower.includes("পোড়") || lower.includes("নেক্রোসিস")
  ) {
    matchedCategory = "Drying/necrosis/blight";
    if (locale === "bn") {
      analysis =
        "পাতা শুকিয়ে লালচে-বাদামী হয়ে যাওয়া এবং নেক্রোটিক কলার বিকাশের কারণে এটি 'Drying/necrosis/blight' (পাতা ঝলসে যাওয়া/শুকানো) রোগ হিসেবে চিহ্নিত হয়েছে। সাধারণত Phytophthora বা Alternaria জাতীয় ছত্রাক আর্দ্র গরম আবহাওয়ায় দ্রুত ছড়ায়।";
      pageRecommendations = [26, 45, 78];
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "তীব্র এবং অসম আকৃতির ক্ষত দাগ নির্দেশ করে আর্দ্র স্যাঁতসেঁতে আবহাওয়ায় প্যাথোজেনটি আক্রমণ ছড়িয়ে দিচ্ছে।",
      };
      signsDetected = ["আক্রান্ত পাতার নিচের পৃষ্ঠে সাদাটে তুলার মতো ছত্রাকের জীবাণু স্পোর"];
      symptomsDetected = ["পাতা দ্রুত বাদামী হয়ে যাওয়া", "পানি ভেজা স্পট বা দাগ", "পাতা কুঁচকে যাওয়া"];
    } else {
      analysis =
        "Matched 'Drying/necrosis/blight' due to symptoms of progressive terminal leaf drying and necrotic cell path development. Often Phytophthora or Alternaria spreading under moist heat.";
      pageRecommendations = [26, 45, 78];
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "Aggressive, randomly blotched necrosis indicates a foliar pathogen (like Phytophthora water mould) spreading under moist heat.",
      };
      signsDetected = ["White fluffy sporulation on the underside margins of wet leaves"];
      symptomsDetected = ["Rapid browning of foliage", "Water-soaked margins", "Tissue shriveling"];
    }
  }
  // Mosaic — mottled yellow-green patterns
  else if (
    lower.includes("mottle") || lower.includes("mosaic") || lower.includes("stripe") ||
    lower.includes("yellow green") || lower.includes("variegat") ||
    lower.includes("মোজাইক") || lower.includes("ছোপ ছোপ")
  ) {
    matchedCategory = "Mosaic";
    if (locale === "bn") {
      analysis =
        "পাতায় ছোপ ছোপ হলুদ-সবুজ বুটিদার মোজাইক দাগের জন্য এটি 'Mosaic' (মোজাইক ছোপ ছোপ রোগ) হিসেবে চিহ্নিত হয়েছে। সাধারণত ভাইরাস এবং জাব পোকা (Aphids) বা হোয়াইটফ্লাই দ্বারা ছড়ায়।";
      pageRecommendations = [43, 67];
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "রঙের অসম পরিবর্তন রাসায়নিক ঘাটতির চেয়ে বরং কোনো ভাইরাস এবং জাব পোকা (Aphids) আক্রান্ত হওয়ার সম্ভাবনা প্রকাশ করে।",
      };
      signsDetected = ["পাতার নিচে সক্রিয় জাব পোকা বা মাছি"];
      symptomsDetected = ["অসম হলুদ-সবুজ মোজাইক ডিজাইন", "পাতার উপরিভাগ অসমান বা কুঁচকানো"];
    } else {
      analysis =
        "Matched 'Mosaic' pattern characterized by leaf mottling chlorosis and standard mosaic patterns. Spread by viruses via aphids or whitefly.";
      pageRecommendations = [43, 67];
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "Variegated mottling points to a viral sap-sucking vector mechanism transmission rather than background deficiency.",
      };
      signsDetected = ["Active whitefly/aphid populations"];
      symptomsDetected = ["Variegated yellow-green leaf patterns", "Rugose surface puckering"];
    }
  }
  // Distortion of leaves — curling, rolling, crumpling
  else if (
    lower.includes("curl") || lower.includes("roll") || lower.includes("distort") ||
    lower.includes("crumple") || lower.includes("pucker") ||
    lower.includes("কুঁচ") || lower.includes("বিকৃত") || lower.includes("কোঁকড়")
  ) {
    matchedCategory = "Distortion of leaves";
    if (locale === "bn") {
      analysis =
        "পাতা কুঁচকে যাওয়া, বিকৃত হওয়া বা অমসৃণ বুদবুদের মতো বৃদ্ধির জন্য এটি 'Distortion of leaves' (পাতা বিকৃতি হওয়া) রোগ হিসেবে চিহ্নিত হয়েছে। মূলত গাছের কচি অংশে মাকড় (Mites) বা এফিডের লালার বিষক্রিয়া বা ভাইরাস সংক্রমণের জন্য হয়।";
      pageRecommendations = [52, 61];
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "পাতা বিকৃত হওয়া মূলত গাছের কচি অংশে মাকড় (Mites) বা এফিডের মতো রস চোষক পোকার লালার বিষক্রিয়ার জন্য হয়।",
      };
      signsDetected = ["পাতার নিচে সুক্ষ্ম মাকড়সার জালের মতো অংশ", "জাব পোকার খোলস"];
      symptomsDetected = ["পাতা উপরের দিকে বা নিচের দিকে কোঁকড়ানো", "অমসৃণ ফুসকুড়ি যুক্ত পাতা"];
    } else {
      analysis =
        "Matched 'Distortion of leaves' relating of leaf blistering, curling, wrinkling, or unusual dimensions. Caused by virus or sap-feeding mites/aphids.";
      pageRecommendations = [52, 61];
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "Cupped puckering often matches virus or sap feeding by microscopic mites or aphids that distort growth buds.",
      };
      signsDetected = ["Microscopic silken webbing on leaf undersides", "Cast aphid exuviae"];
      symptomsDetected = ["Leaves curled upward or downward", "Bubbling puckered lamina"];
    }
  }
  // Little leaf — stunted miniature leaves
  else if (
    lower.includes("little") || lower.includes("small leaf") || lower.includes("miniature") ||
    lower.includes("stunt") || lower.includes("ক্ষুদ্র") || lower.includes("ছোট পাতা")
  ) {
    matchedCategory = "Little leaf";
    if (locale === "bn") {
      analysis =
        "পাতার আকার ব্যাপকভাবে কমে ক্ষুদ্রাকৃতি হয়ে যাওয়ার জন্য এটি 'Little leaf' (ক্ষুদ্রাকৃতির পাতা রোগ) হিসেবে সনাক্ত হয়েছে। মাইক্রোপ্লাজমা বা ফাইটোপ্লাজমার কারণে ঘটে।";
      pageRecommendations = [56, 72];
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "কচি পাতা খুব বেশি ছোট এবং ঘন ঝোপের মতো হয়ে যাওয়া মূলত মাইক্রোপ্লাজমা বা ফাইটোোপ্লাজমার কারণে ঘটে।",
      };
      signsDetected = ["কাণ্ড ও পর্বমধ্য খুব ছোট ফাঁকবিশিষ্ট হওয়া, কোনো পচনশীল দাগ নেই"];
      symptomsDetected = ["ক্ষুদ্রাকৃতির ত্রুটিহীন সবুজ পাতা", "কাণ্ডের কচি ডগায় অতিরিক্ত পাতার ঝোপ"];
    } else {
      analysis =
        "Matched 'Little leaf' showing clear stunted bunch stem structures with miniature leaf growths. Caused by phytoplasma pathogens.";
      pageRecommendations = [56, 72];
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "Severe dwarfing of leaves into miniature scales points directly to a phytoplasma pathogen (living biotic factor).",
      };
      signsDetected = ["Severe internode shortening, no visible necrotic leaf spots"];
      symptomsDetected = ["Miniature perfectly formed leaves", "Bunchy main stalk growth"];
    }
  }
  // Yellowing of leaves — chlorosis
  else if (
    lower.includes("yellow") || lower.includes("chloro") || lower.includes("হলুদ")
  ) {
    matchedCategory = "Yellowing of leaves";
    if (locale === "bn") {
      analysis =
        "পাতা সমভাবে হলুদ হয়ে যাওয়ার জন্য এটি 'Yellowing of leaves' (পাতা হলুদ হওয়া) হিসেবে চিহ্নিত হয়েছে। নাইট্রোজেন বা ম্যাগনেসিয়ামের ঘাটতি বা পরিবহন ব্যাহত হলে সমমিত হলুদ হয়।";
      pageRecommendations = [33, 88];
      bioticOrAbiotic = {
        conclusion: "Abiotic",
        rationale:
          "পাতার সমমিত ও ক্রমশ হলুদ হওয়া মূলত পুষ্টি উপাদানের ঘাটতি বা পরিবহন ব্যাহত হওয়ার ইঙ্গিত দেয়, প্যাথোজেনের চেয়ে।",
      };
      signsDetected = ["কোনো দৃশ্যমান প্যাথোজেন স্পোর বা পোকা নেই"];
      symptomsDetected = ["সমমিত হলুদ বর্ণ", "কচি পাতা থেকে শুরু হয়ে বয়স্ক পাতায় ছড়ায়"];
    } else {
      analysis =
        "Matched 'Yellowing of leaves' from generalized chlorosis. Usually abiotic — nitrogen or magnesium deficiency, or vascular transport disruption.";
      pageRecommendations = [33, 88];
      bioticOrAbiotic = {
        conclusion: "Abiotic",
        rationale:
          "Symmetric, gradual yellowing across the foliage indicates a nutrient deficit or transport disruption rather than a localized pathogen.",
      };
      signsDetected = ["No visible pathogen sporulation or insect activity"];
      symptomsDetected = ["Symmetric chlorosis", "Spreads from young to mature leaves"];
    }
  }

  return {
    matchedCategory,
    confidence: matchedCategory ? "Medium" : "Low",
    analysis,
    pageRecommendations,
    organicManagement,
    bioticOrAbiotic,
    signsDetected,
    symptomsDetected,
    big5Assessment,
    errorInfo: undefined,
  };
}
