import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Lazily initialised ZAI client (bypass API key — no real key required)
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;
async function getZai() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

interface DiagnoseBody {
  symptomDescription: string;
  image?: string | null;
  locale?: "bn" | "en";
}

const JSON_SCHEMA_HINT = `Respond strictly in valid JSON format mapping this exact schema:
{
  "matchedCategory": string | null,
  "confidence": "High" | "Medium" | "Low",
  "analysis": "A concise expert pathological pathway detailing what is happening",
  "pageRecommendations": number[],
  "organicManagement": string[], // 3 actionable, biological, sustainable ways to address or control this organically
  "bioticOrAbiotic": {
    "conclusion": "Biotic" | "Abiotic",
    "rationale": "Agronomical context explaining how boundary lines or gradients suggest biotic/abiotic pathways"
  },
  "signsDetected": string[], // e.g. ["black fruiting bodies", "boring frass"]
  "symptomsDetected": string[], // e.g. ["yellowing borders", "marginal necrosis"]
  "big5Assessment": {
    "economic": string,
    "effective": string,
    "safe": string,
    "practical": string,
    "locallyAvailable": string
  }
}`;

function buildPrompt(symptomDescription: string, locale: "bn" | "en") {
  let languageInstruction = "";
  if (locale === "bn") {
    languageInstruction = `
IMPORTANT DIRECTIVE: The user has selected the Bangla language. You MUST translate all explanation strings, diagnostic text values, and bullet items in the JSON response into professional, natural, high-quality agricultural Bangla (বাংলা).
Specifically:
- Translate the "analysis" narrative text to Bangla.
- Translate each string element inside the "organicManagement" array to Bangla.
- Translate the "bioticOrAbiotic.rationale" text to Bangla.
- Translate each item in the "signsDetected" and "symptomsDetected" arrays to Bangla.
- Translate all descriptions inside the "big5Assessment" object ("economic", "effective", "safe", "practical", "locallyAvailable") to Bangla.
- KEEP safety-critical botanical names, chemical terms, page numbers, confidence levels ("High" | "Medium" | "Low"), and "bioticOrAbiotic.conclusion" ("Biotic" | "Abiotic") in English, but explain them beautifully in Bangla.
`;
  }

  return `You are a clinical agricultural pathologist assisting a farmer or plant inspector. Analyze the following crop symptom description and the attached crop specimen photograph (if any). Real-time validate and cross-reference them with the CABI Plantwise Field Diagnostic, Ready Reckoner, and BioControl guidelines.

Identify:
1. Matched CABI symptom visual category (one of the 10).
2. Biotic vs Abiotic categorization based on patterns shown: Biotic usually displays clean dividing edges or lesion spot boundaries, whereas Abiotic (like nutrient shortage, frost, or herbicide scorch) typically yields broad symmetric leaf coverage/gradients across the foliage.
3. Actual visible 'Signs' vs 'Symptoms':
   - 'Signs' are concrete evidences of the pest itself: black pinpoint fruiting bodies, white sporulation, webbing, grubs, boring exit holes, or frass.
   - 'Symptoms' are the plant's physiological reactions: wilt, spots with yellow rings, leaf stunting, margin drying, distortion, etc.
4. Recommendation check using the CABI 'Big 5' Assessment framework:
   - Economic (Should we act or do nothing if the damage is minor/near-harvest?)
   - Effective (Scientifically validated biological active controls or standard protocols)
   - Safe (Completely free of Pesticide Red List chemicals; utilizing organic biocontrols like neem extract, Trichoderma, Bacillus thuringiensis, or ladybird predators)
   - Practical (Manageable steps for the farmer in field settings)
   - Locally Available (Materials easily sourced on local markets or made on-farm)

User symptom description:
"${symptomDescription}"
${languageInstruction}

${JSON_SCHEMA_HINT}

Return ONLY the JSON object — no Markdown fences, no commentary, no text before or after.`;
}

// Robust JSON extractor — strips ```json fences and trailing prose
function extractJson(raw: string): any {
  if (!raw) return null;
  let text = raw.trim();

  // Strip code fences if present
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fence) {
    text = fence[1].trim();
  }

  // Find the first { and the last } to carve out the JSON object
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    text = text.slice(first, last + 1);
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Offline / failure fallback — kept identical to the original app's heuristic
function buildFallback(symptomDescription: string, locale: "bn" | "en", errorMsg?: string) {
  let matchedCategory: string | null = null;
  let analysis =
    "No diagnostic match concluded. Connect the AI engine to enable active smart assistant recommendations.";
  let pageRecommendations = [15];
  let organicManagement = [
    "Prune infected leaves with disinfected shears to halt spreading pathogen spores.",
    "Promote air circulation by proper crop spacing and avoid overhead watering in evenings.",
    "Apply organic microbial compost tea or neem oil spray as a preventative natural bio-pesticide.",
  ];
  let bioticOrAbiotic = {
    conclusion: "Biotic" as "Biotic" | "Abiotic",
    rationale:
      "Clear boundaries and visual lesions suggest a living active pathogen (fungus/bacteria) rather than a symmetrical background nutrient deficit.",
  };
  let signsDetected = ["Pathogen spores on leaf undersides", "No visible insect frass"];
  let symptomsDetected = ["Chlorotic spots", "Local tissue death"];
  let big5Assessment = {
    economic:
      "Foliar treatments pay for themselves by salvaging photosynthetic capability before spreading.",
    effective:
      "Neem extracts and biological copper washes are scientifically proven to restrict spore germination.",
    safe: "100% safe. Adheres strictly to the CABI Red List policy by avoiding chemical organophosphate pesticides.",
    practical: "Physical pruning is highly practical for small-holder farmers and household scale.",
    locallyAvailable: "Neem leaves and wood ash are easily collected on-farm at zero financial cost.",
  };

  if (locale === "bn") {
    analysis =
      "কোনো নির্দিষ্ট রোগ সনাক্তকরণ সম্পন্ন হয়নি। বিস্তারিত উপদেশের জন্য এআই ইঞ্জিন সংযুক্ত করুন।";
    organicManagement = [
      "জীবাণুমুক্ত কাঁচি দিয়ে রোগাক্রান্ত পাতা কেটে ফেলুন যাতে জীবাণুর স্পোর ছড়াতে না পারে।",
      "ফসলের সঠিক দূরত্ব বজায় রেখে বাতাস চলাচলের সুযোগ করে দিন এবং সন্ধ্যায় অতিরিক্ত পানি দেওয়া বন্ধ করুন।",
      "রোগ প্রতিরোধে ট্রাইকোডার্মা বা জৈব নিম তেলের মিশ্রণ স্প্রে করুন।",
    ];
    bioticOrAbiotic = {
      conclusion: "Biotic",
      rationale:
        "পাতার ক্ষত চিহ্নের স্পষ্ট সীমানা দেখে ধারণা করা হচ্ছে এটি একটি জীবন্ত প্যাথোজেন (ছত্রাক বা ব্যাকটেরিয়া) দ্বারা আক্রান্ত।",
    };
    signsDetected = ["পাতার নিচের দিকে ছত্রাকের স্পোর", "কোনো দৃশ্যমান পোকার মলমূত্র নেই"];
    symptomsDetected = ["ক্লোরোটিক বা হলুদ ছোপ দাগ", "স্থানীয় কোষকলা ক্ষয় (নেক্রোসিস)"];
    big5Assessment = {
      economic:
        "পাতার চিকিৎসা সময়মতো করলে ফসলের সালোকসংশ্লেষণ ক্ষমতা রক্ষা পাবে, যা ফলন হ্রাসের তুলনায় বেশি সাশ্রয়ী।",
      effective:
        "নিম পাতার নির্যাস এবং ট্রাইকোডার্মা মাটিতে রোগ সৃষ্টিকারী ছত্রাকের বৃদ্ধির হার নিয়ন্ত্রণে বিজ্ঞানসম্মতভাবে প্রমাণিত।",
      safe: "১০০% নিরাপদ। ক্ষতিকারক অর্গানোফসফেট কীটনাশক বর্জন করে CABI লাল তালিকার নীতিমালা সম্পূর্ণরূপে মেনে চলে।",
      practical:
        "রোগাক্রান্ত অংশ কেটে ফেলা ক্ষুদ্র ও মাঝারি কৃষকদের জন্য অত্যন্ত সহজ ও মাঠপর্যায়ে সরাসরি বাস্তবায়নযোগ্য।",
      locallyAvailable:
        "নিম পাতা, ছাই ও অন্যান্য উপাদান স্থানীয় বাজারে নামমাত্র মূল্যে বা খামারে বিনামূল্যে সংগ্রহ করা সম্ভব।",
    };
  }

  const lower = symptomDescription.toLowerCase();
  if (lower.includes("spot") || lower.includes("circle") || lower.includes("lesion")) {
    matchedCategory = "Leaf spot";
    analysis =
      "Matched 'Leaf spot' based on visual references of circular lesions and necrotic spots identified in your details.";
    pageRecommendations = [15, 32, 99];
    signsDetected = [
      "Fungal fruiting bodies (black pinpoints under magnification)",
      "Yellow halo boundary",
    ];
    symptomsDetected = ["Circular necrotic leaf lesions", "Localized chlorosis"];
  } else if (lower.includes("wilt") || lower.includes("droop") || lower.includes("hang")) {
    matchedCategory = "Wilt";
    analysis =
      "Matched 'Wilt' based on moisture loss patterns reported in leaves and stem structural collapses.";
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
      effective:
        "Using resistant varieties is the only 100% effective long-term defense against soil wilt pathogens.",
      safe: "Avoids soil sterilizers; relies on biological suppressive soil enhancements (Trichoderma).",
      practical: "Irrigation drainage modification is physically demanding but highly feasible.",
      locallyAvailable: "Beneficial composts and resistant seeds are easily obtained on local markets.",
    };
  } else if (
    lower.includes("burn") ||
    lower.includes("dry") ||
    lower.includes("wither") ||
    lower.includes("brown") ||
    lower.includes("blight")
  ) {
    matchedCategory = "Drying/necrosis/blight";
    if (locale === "bn") {
      analysis =
        "পাতা শুকিয়ে লালচে-বাদামী হয়ে যাওয়া এবং নেক্রোটিক কলার বিকাশের কারণে এটি 'Drying/necrosis/blight' (পাতা ঝলসে যাওয়া/শুকানো) রোগ হিসেবে চিহ্নিত হয়েছে।";
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "তীব্র এবং অসম আকৃতির ক্ষত দাগ নির্দেশ করে আর্দ্র স্যাঁতসেঁতে আবহাওয়ায় প্যাথোজেনটি আক্রমণ ছড়িয়ে দিচ্ছে।",
      };
      signsDetected = ["আক্রান্ত পাতার নিচের পৃষ্ঠে সাদাটে তুলার মতো ছত্রাকের জীবাণু স্পোর"];
      symptomsDetected = ["পাতা দ্রুত বাদামী হয়ে যাওয়া", "পানি ভেজা স্পট বা দাগ", "পাতা কুঁচকে যাওয়া"];
    } else {
      analysis =
        "Matched 'Drying/necrosis/blight' due to symptoms of progressive terminal leaf drying and necrotic cell path development.";
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "Aggressive, randomly blotched necrosis indicates a foliar pathogen (like Phytophthora water mould) spreading under moist heat.",
      };
      signsDetected = ["White fluffy sporulation on the underside margins of wet leaves"];
      symptomsDetected = ["Rapid browning of foliage", "Water-soaked margins", "Tissue shriveling"];
    }
  } else if (
    lower.includes("mottle") ||
    lower.includes("mosaic") ||
    lower.includes("stripe") ||
    lower.includes("yellow green")
  ) {
    matchedCategory = "Mosaic";
    if (locale === "bn") {
      analysis =
        "পাতায় ছোপ ছোপ হলুদ-সবুজ বুটিদার মোজাইক দাগের জন্য এটি 'Mosaic' (মোজাইক ছোপ ছোপ রোগ) হিসেবে চিহ্নিত হয়েছে।";
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "রঙের অসম পরিবর্তন রাসায়নিক ঘাটতির চেয়ে বরং কোনো ভাইরাস এবং জাব পোকা (Aphids) আক্রান্ত হওয়ার সম্ভাবনা প্রকাশ করে।",
      };
      signsDetected = ["পাতার নিচে সক্রিয় জাব পোকা বা মাছি"];
      symptomsDetected = ["অসম হলুদ-সবুজ মোজাইক ডিজাইন", "পাতার উপরিভাগ অসমান বা কুঁচকানো"];
    } else {
      analysis =
        "Matched 'Mosaic' pattern characterized by leaf mottling chlorosis and standard mosaic patterns.";
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "Variegated mottling points to a viral sap-sucking vector mechanism transmission rather than background deficiency.",
      };
      signsDetected = ["Active whitefly/aphid populations"];
      symptomsDetected = ["Variegated yellow-green leaf patterns", "Rugose surface puckering"];
    }
  } else if (
    lower.includes("curl") ||
    lower.includes("roll") ||
    lower.includes("distort") ||
    lower.includes("crumple")
  ) {
    matchedCategory = "Distortion of leaves";
    if (locale === "bn") {
      analysis =
        "পাতা কুঁচকে যাওয়া, বিকৃত হওয়া বা অমসৃণ বুদবুদের মতো বৃদ্ধির জন্য এটি 'Distortion of leaves' (পাতা বিকৃতি হওয়া) রোগ হিসেবে চিহ্নিত হয়েছে।";
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "পাতা বিকৃত হওয়া মূলত গাছের কচি অংশে মাকড় (Mites) বা এফিডের মতো রস চোষক পোকার লালার বিষক্রিয়ার জন্য হয়।",
      };
      signsDetected = ["পাতার নিচে সুক্ষ্ম মাকড়সার জালের মতো অংশ", "জাব পোকার খোলস"];
      symptomsDetected = ["পাতা উপরের দিকে বা নিচের দিকে কোঁকড়ানো", "অমসৃণ ফুসকুড়ি যুক্ত পাতা"];
    } else {
      analysis =
        "Matched 'Distortion of leaves' relating of leaf blistering, curling, wrinkling, or unusual dimensions.";
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "Cupped puckering often matches virus or sap feeding by microscopic mites or aphids that distort growth buds.",
      };
      signsDetected = ["Microscopic silken webbing on leaf undersides", "Cast aphid exuviae"];
      symptomsDetected = ["Leaves curled upward or downward", "Bubbling puckered lamina"];
    }
  } else if (lower.includes("little") || lower.includes("small leaf") || lower.includes("miniature")) {
    matchedCategory = "Little leaf";
    if (locale === "bn") {
      analysis =
        "পাতার আকার ব্যাপকভাবে কমে ক্ষুদ্রাকৃতি হয়ে যাওয়ার জন্য এটি 'Little leaf' (ক্ষুদ্রাকৃতির পাতা রোগ) হিসেবে সনাক্ত হয়েছে।";
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "কচি পাতা খুব বেশি ছোট এবং ঘন ঝোপের মতো হয়ে যাওয়া মূলত মাইক্রোপ্লাজমা বা ফাইটোোপ্লাজমার কারণে ঘটে।",
      };
      signsDetected = ["কাণ্ড ও পর্বমধ্য খুব ছোট ফাঁকবিশিষ্ট হওয়া, কোনো পচনশীল দাগ নেই"];
      symptomsDetected = ["ক্ষুদ্রাকৃতির ত্রুটিহীন সবুজ পাতা", "কাণ্ডের কচি ডগায় অতিরিক্ত পাতার ঝোপ"];
    } else {
      analysis =
        "Matched 'Little leaf' showing clear stunted bunch stem structures with miniature leaf growths.";
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale:
          "Severe dwarfing of leaves into miniature scales points directly to a phytoplasma pathogen (living biotic factor).",
      };
      signsDetected = ["Severe internode shortening, no visible necrotic leaf spots"];
      symptomsDetected = ["Miniature perfectly formed leaves", "Bunchy main stalk growth"];
    }
  }

  return {
    matchedCategory,
    confidence: "Medium" as "High" | "Medium" | "Low",
    analysis,
    pageRecommendations,
    organicManagement,
    bioticOrAbiotic,
    signsDetected,
    symptomsDetected,
    big5Assessment,
    errorInfo: errorMsg,
  };
}

export async function POST(req: NextRequest) {
  let body: DiagnoseBody;
  try {
    body = (await req.json()) as DiagnoseBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { symptomDescription, image, locale = "bn" } = body;
  if (!symptomDescription || typeof symptomDescription !== "string") {
    return NextResponse.json(
      { error: "Symptom description is required as a string." },
      { status: 400 }
    );
  }

  const prompt = buildPrompt(symptomDescription, locale);
  const hasImage = typeof image === "string" && image.startsWith("data:");

  try {
    const zai = await getZai();

    let rawText = "";

    if (hasImage) {
      // Multimodal diagnosis — preserve full accuracy by using the vision model
      const visionResponse = await zai.chat.completions.createVision({
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: image as string } },
            ],
          },
        ],
        thinking: { type: "enabled" },
      });
      rawText = visionResponse.choices?.[0]?.message?.content ?? "";
    } else {
      // Text-only diagnosis — use the strongest text model
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: "assistant",
            content:
              "You are a clinical agricultural pathologist. You return ONLY a single JSON object — no Markdown, no commentary, no code fences.",
          },
          { role: "user", content: prompt },
        ],
        thinking: { type: "enabled" },
      });
      rawText = completion.choices?.[0]?.message?.content ?? "";
    }

    const parsed = extractJson(rawText);
    if (parsed && parsed.matchedCategory !== undefined) {
      // Normalise confidence enum
      const validConf = ["High", "Medium", "Low"];
      if (!validConf.includes(parsed.confidence)) {
        parsed.confidence = "Medium";
      }
      // Normalise bioticOrAbiotic.conclusion
      if (parsed.bioticOrAbiotic && !["Biotic", "Abiotic"].includes(parsed.bioticOrAbiotic.conclusion)) {
        parsed.bioticOrAbiotic.conclusion = "Biotic";
      }
      return NextResponse.json(parsed);
    }

    // Could not parse — fall back to heuristic but flag it
    const fb = buildFallback(symptomDescription, locale, "Model returned non-JSON response");
    return NextResponse.json(fb);
  } catch (error: any) {
    console.error("ZAI Diagnosis failed:", error);
    const fb = buildFallback(symptomDescription, locale, error?.message ?? "Unknown error");
    return NextResponse.json(fb);
  }
}
