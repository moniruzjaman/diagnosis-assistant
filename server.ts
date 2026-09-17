import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Database cache file path
const PUBLIC_DIR = path.join(process.cwd(), "public");
const DB_DIR = path.join(PUBLIC_DIR, "output");
const DB_FILE = path.join(DB_DIR, "database.json");

// Lazy initialised Gemini client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please add it to Settings > Secrets or .env file.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiInstance;
}

// Ensure output directories exist for caching
try {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
} catch (e) {
  console.error("Failed to bootstrap local cache directory structure:", e);
}

// 1. Host guide database proxy with fallback
app.get("/api/database", async (req, res) => {
  try {
    // If we have a local cached database.json, send it
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return res.json(JSON.parse(data));
    }

    // Otherwise, fetch from the main CABI GitHub repository
    console.log("Fetching database.json from CABI repository source...");
    const rawUrl = "https://raw.githubusercontent.com/moniruzjaman/cabi-diagnosis-builder/krishiai4.0/output/database.json";
    const response = await fetch(rawUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch from github raw: status ${response.status}`);
    }
    const dbData = await response.json();

    // Cache it locally so subsequent sessions are offline/near-instant
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
      console.log("Cached database.json successfully into public asset workspace directory.");
    } catch (saveError) {
      console.error("Warning: could not write local database file cache:", saveError);
    }

    return res.json(dbData);
  } catch (err: any) {
    console.error("Error retrieving database.json, performing fallback response:", err.message);
    
    // Send a solid offline mock fallback database to let the app work anyway
    return res.json({
      metadata: {
        source: "CABI Plantwise Diagnostic Field Guide (Local Offline Cache Fallback)",
        total_pages: 118
      },
      diagnostic_keys: [
        {
          page: 15,
          symptom_category: "Leaf spot",
          text_preview: "This cashew leaf has leaf spots, which are clearly defined and are all a similar size. This clear delineation between healthy and infected tissue is typical.",
          images: ["img_page15_0.jpeg", "img_page15_1.jpeg"]
        },
        {
          page: 26,
          symptom_category: "Drying/necrosis/blight",
          text_preview: "Wilt YES can be common. Often caused by root-attacking phytophthoras. Leaves turn brown, starting from margins, drying up rapidly in hot sun.",
          images: ["img_page26_0.jpeg", "img_page26_1.jpeg", "img_page26_2.jpeg"]
        },
        {
          page: 43,
          symptom_category: "Mosaic",
          text_preview: "Mosaic pattern has an uneven mottled colour on leaves, yellow areas mixed with normal green areas giving a variegated appearance.",
          images: ["img_page43_0.jpeg", "img_page43_1.jpeg", "img_page43_2.jpeg"]
        },
        {
          page: 52,
          symptom_category: "Distortion of leaves",
          text_preview: "Leaf distortion in tomato plants, leaves curl upward or downward, puckering, bubbling and showing abnormal growth patterns.",
          images: ["img_page52_0.jpeg", "img_page52_1.jpeg"]
        },
        {
          page: 56,
          symptom_category: "Little leaf",
          text_preview: "Little leaf is often considered to be the classic phytoplasma symptom. Marked reduction in leaf size with stunted bunchy stems.",
          images: ["img_page56_0.jpeg", "img_page56_1.jpeg"]
        },
        {
          page: 58,
          symptom_category: "Galls",
          text_preview: "Root knots and swellings caused by nematode infestations. Galls also show up on stems or foliage as abnormal tissue growths in response to pest feeds.",
          images: ["img_page58_0.jpeg", "img_page58_1.jpeg"]
        }
      ]
    });
  }
});

// 2. AI Plant Doctor Diagnostic Service
app.post("/api/diagnose", async (req, res) => {
  const { symptomDescription, image, locale = "bn" } = req.body;
  if (!symptomDescription || typeof symptomDescription !== "string") {
    return res.status(400).json({ error: "Symptom description is required as a string." });
  }

  try {
    const ai = getGeminiClient();
    
    let languageInstruction = "";
    if (locale === "bn") {
      languageInstruction = `
IMPORTANT DIRECTIVE: The user has selected the Bangla language. You MUST translate all explanation strings, diagnostic text values, and bullet items in the JSON response into professional, natural, high-quality agricultural Bangla (বংলা).
Specifically:
- Translate the "analysis" narrative text to Bangla.
- Translate each string element inside the "organicManagement" array to Bangla.
- Translate the "bioticOrAbiotic.rationale" text to Bangla.
- Translate each item in the "signsDetected" and "symptomsDetected" arrays to Bangla.
- Translate all descriptions inside the "big5Assessment" object ("economic", "effective", "safe", "practical", "locallyAvailable") to Bangla.
- KEEP safety-critical botanical names, chemical terms, page numbers, confidence levels ("High" | "Medium" | "Low"), and "bioticOrAbiotic.conclusion" ("Biotic" | "Abiotic") in English, but explain them beautifully in Bangla.
`;
    }

    const prompt = `You are a clinical agricultural pathologist assisting a farmer or plant inspector. Analyze the following crop symptom description and the attached crop specimen photograph (if any). Real-time validate and cross-reference them with the CABI Plantwise Field Diagnostic, Ready Reckoner, and BioControl guidelines.

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

Respond strictly in valid JSON format mapping this exact schema:
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

    let contentsPayload: any;
    if (image && typeof image === "string") {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const data = match[2];
        contentsPayload = {
          parts: [
            {
              inlineData: {
                mimeType,
                data
              }
            },
            {
              text: prompt
            }
          ]
        };
      } else {
        contentsPayload = prompt;
      }
    } else {
      contentsPayload = prompt;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentsPayload,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedCategory: {
              type: Type.STRING,
              description: "Must be exactly one of the 10 CABI visual Categories or null."
            },
            confidence: {
              type: Type.STRING,
              enum: ["High", "Medium", "Low"]
            },
            analysis: {
              type: Type.STRING
            },
            pageRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER }
            },
            organicManagement: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            bioticOrAbiotic: {
              type: Type.OBJECT,
              properties: {
                conclusion: {
                  type: Type.STRING,
                  enum: ["Biotic", "Abiotic"]
                },
                rationale: {
                  type: Type.STRING
                }
              },
              required: ["conclusion", "rationale"]
            },
            signsDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            symptomsDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            big5Assessment: {
              type: Type.OBJECT,
              properties: {
                economic: { type: Type.STRING },
                effective: { type: Type.STRING },
                safe: { type: Type.STRING },
                practical: { type: Type.STRING },
                locallyAvailable: { type: Type.STRING }
              },
              required: ["economic", "effective", "safe", "practical", "locallyAvailable"]
            }
          },
          required: [
            "matchedCategory", 
            "confidence", 
            "analysis", 
            "pageRecommendations", 
            "organicManagement",
            "bioticOrAbiotic",
            "signsDetected",
            "symptomsDetected",
            "big5Assessment"
          ]
        }
      }
    });

    const parsedResponse = JSON.parse(response.text || "{}");
    return res.json(parsedResponse);
  } catch (error: any) {
    console.error("Gemini AI Diagnosis failed:", error);
    
    // Heuristic fallbacks when offline or missing key
    let matchedCategory: string | null = null;
    let analysis = "No diagnostic match concluded. Connect Gemini API to enable active smart assistant recommendations.";
    let pageRecommendations = [15];
    let organicManagement = [
      "Prune infected leaves with disinfected shears to halt spreading pathogen spores.",
      "Promote air circulation by proper crop spacing and avoid overhead watering in evenings.",
      "Apply organic microbial compost tea or neem oil spray as a preventative natural bio-pesticide."
    ];
    let bioticOrAbiotic = {
      conclusion: "Biotic" as "Biotic" | "Abiotic",
      rationale: "Clear boundaries and visual lesions suggest a living active pathogen (fungus/bacteria) rather than a symmetrical background nutrient deficit."
    };
    let signsDetected = ["Pathogen spores on leaf undersides", "No visible insect frass"];
    let symptomsDetected = ["Chlorotic spots", "Local tissue death"];
    let big5Assessment = {
      economic: "Foliar treatments pay for themselves by salvaging photosynthetic capability before spreading.",
      effective: "Neem extracts and biological copper washes are scientifically proven to restrict spore germination.",
      safe: "100% safe. Adheres strictly to the CABI Red List policy by avoiding chemical organophosphate pesticides.",
      practical: "Physical pruning is highly practical for small-holder farmers and household scale.",
      locallyAvailable: "Neem leaves and wood ash are easily collected on-farm at zero financial cost."
    };

    if (locale === "bn") {
      analysis = "কোনো নির্দিষ্ট রোগ সনাক্তকরণ সম্পন্ন হয়নি। বিস্তারিত উপদেশের জন্য আপনার জেমিনি এপিআই কি সংযুক্ত করুন।";
      organicManagement = [
        "জীবাণুমুক্ত কাঁচি দিয়ে রোগাক্রান্ত পাতা কেটে ফেলুন যাতে জীবাণুর স্পোর ছড়াতে না পারে।",
        "ফসলের সঠিক দূরত্ব বজায় রেখে বাতাস চলাচলের সুযোগ করে দিন এবং সন্ধ্যায় অতিরিক্ত পানি দেওয়া বন্ধ করুন।",
        "রোগ প্রতিরোধে ট্রাইকোডার্মা বা জৈব নিম তেলের মিশ্রণ স্প্রে করুন।"
      ];
      bioticOrAbiotic = {
        conclusion: "Biotic",
        rationale: "পাতার ক্ষত চিহ্নের স্পষ্ট সীমানা দেখে ধারণা করা হচ্ছে এটি একটি জীবন্ত প্যাথোজেন (ছত্রাক বা ব্যাকটেরিয়া) দ্বারা আক্রান্ত।"
      };
      signsDetected = ["পাতার নিচের দিকে ছত্রাকের স্পোর", "কোনো দৃশ্যমান পোকার মলমূত্র নেই"];
      symptomsDetected = ["ক্লোরোটিক বা হলুদ ছোপ দাগ", "স্থানীয় কোষকলা ক্ষয় (নেক্রোসিস)"];
      big5Assessment = {
        economic: "পাতার চিকিৎসা সময়মতো করলে ফসলের সালোকসংশ্লেষণ ক্ষমতা রক্ষা পাবে, যা ফলন হ্রাসের তুলনায় বেশি সাশ্রয়ী।",
        effective: "নিম পাতার নির্যাস এবং ট্রাইকোডার্মা মাটিতে রোগ সৃষ্টিকারী ছত্রাকের বৃদ্ধির হার নিয়ন্ত্রণে বিজ্ঞানসম্মতভাবে প্রমাণিত।",
        safe: "১০০% নিরাপদ। ক্ষতিকারক অর্গানোফসফেট কীটনাশক বর্জন করে CABI লাল তালিকার নীতিমালা সম্পূর্ণরূপে মেনে চলে।",
        practical: "রোগাক্রান্ত অংশ কেটে ফেলা ক্ষুদ্র ও মাঝারি কৃষকদের জন্য অত্যন্ত সহজ ও মাঠপর্যায়ে সরাসরি বাস্তবায়নযোগ্য।",
        locallyAvailable: "নিম পাতা, ছাই ও অন্যান্য উপাদান স্থানীয় বাজারে নামমাত্র মূল্যে বা খামারে বিনামূল্যে সংগ্রহ করা সম্ভব।"
      };
    }

    const lower = symptomDescription.toLowerCase();
    if (lower.includes("spot") || lower.includes("circle") || lower.includes("lesion")) {
      matchedCategory = "Leaf spot";
      analysis = "Matched 'Leaf spot' based on visual references of circular lesions and necrotic spots identified in your details.";
      pageRecommendations = [15, 32, 99];
      signsDetected = ["Fungal fruiting bodies (black pinpoints under magnification)", "Yellow halo boundary"];
      symptomsDetected = ["Circular necrotic leaf lesions", "Localized chlorosis"];
    } else if (lower.includes("wilt") || lower.includes("droop") || lower.includes("hang")) {
      matchedCategory = "Wilt";
      analysis = "Matched 'Wilt' based on moisture loss patterns reported in leaves and stem structural collapses.";
      pageRecommendations = [26, 93];
      organicManagement = [
        "Inspect roots for phytophthora rot or wireworms, improve drainage significantly.",
        "Add beneficial mycorrhizal fungi to bolster root immunity against vascular blockages.",
        "Practice strict crop rotation with cover crops to break weed/soil pathogen lifecycles."
      ];
      bioticOrAbiotic = {
        conclusion: "Biotic" as "Biotic" | "Abiotic",
        rationale: "Rapid localized drooping suggests microbial vascular blockages in the xylem vessels rather than a gradual drought."
      };
      signsDetected = ["Discoloured dark xylem streaks inside a split stem", "Minor bacterial streaming in water"];
      symptomsDetected = ["Loss of turgor pressure", "Leaf drooping", "Downward collapse of petioles"];
      big5Assessment = {
        economic: "High priority since unchecked wilts can destroy 100% of Solanaceous crop yields.",
        effective: "Using resistant varieties is the only 100% effective long-term defense against soil wilt pathogens.",
        safe: "Avoids soil sterilizers; relies on biological suppressive soil enhancements (Trichoderma).",
        practical: "Irrigation drainage modification is physically demanding but highly feasible.",
        locallyAvailable: "Beneficial composts and resistant seeds are easily obtained on local markets."
      };
    } else if (lower.includes("burn") || lower.includes("dry") || lower.includes("wither") || lower.includes("brown") || lower.includes("blight")) {
      matchedCategory = "Drying/necrosis/blight";
      if (locale === "bn") {
        analysis = "পাতা শুকিয়ে লালচে-বাদামী হয়ে যাওয়া এবং নেক্রোটিক কলার বিকাশের কারণে এটি 'Drying/necrosis/blight' (পাতা ঝলসে যাওয়া/শুকানো) রোগ হিসেবে চিহ্নিত হয়েছে।";
        bioticOrAbiotic = {
          conclusion: "Biotic",
          rationale: "তীব্র এবং অসম আকৃতির ক্ষত দাগ নির্দেশ করে আর্দ্র স্যাঁতসেঁতে আবহাওয়ায় প্যাথোজেনটি আক্রমণ ছড়িয়ে দিচ্ছে।"
        };
        signsDetected = ["আক্রান্ত পাতার নিচের পৃষ্ঠে সাদাটে তুলার মতো ছত্রাকের জীবাণু স্পোর"];
        symptomsDetected = ["পাতা দ্রুত বাদামী হয়ে যাওয়া", "পানি ভেজা স্পট বা দাগ", "পাতা কুঁচকে যাওয়া"];
      } else {
        analysis = "Matched 'Drying/necrosis/blight' due to symptoms of progressive terminal leaf drying and necrotic cell path development.";
        bioticOrAbiotic = {
          conclusion: "Biotic" as "Biotic" | "Abiotic",
          rationale: "Aggressive, randomly blotched necrosis indicates a foliar pathogen (like Phytophthora water mould) spreading under moist heat."
        };
        signsDetected = ["White fluffy sporulation on the underside margins of wet leaves"];
        symptomsDetected = ["Rapid browning of foliage", "Water-soaked margins", "Tissue shriveling"];
      }
    } else if (lower.includes("mottle") || lower.includes("mosaic") || lower.includes("stripe") || lower.includes("yellow green")) {
      matchedCategory = "Mosaic";
      if (locale === "bn") {
        analysis = "পাতায় ছোপ ছোপ হলুদ-সবুজ বুটিদার মোজাইক দাগের জন্য এটি 'Mosaic' (মোজাইক ছোপ ছোপ রোগ) হিসেবে চিহ্নিত হয়েছে।";
        bioticOrAbiotic = {
          conclusion: "Biotic",
          rationale: "রঙের অসম পরিবর্তন রাসায়নিক ঘাটতির চেয়ে বরং কোনো ভাইরাস এবং জাব পোকা (Aphids) আক্রান্ত হওয়ার সম্ভাবনা প্রকাশ করে।"
        };
        signsDetected = ["পাতার নিচে সক্রিয় জাব পোকা বা মাছি"];
        symptomsDetected = ["অসম হলুদ-সবুজ মোজাইক ডিজাইন", "পাতার উপরিভাগ অসমান বা কুঁচকানো"];
      } else {
        analysis = "Matched 'Mosaic' pattern characterized by leaf mottling chlorosis and standard mosaic patterns.";
        bioticOrAbiotic = {
          conclusion: "Biotic" as "Biotic" | "Abiotic",
          rationale: "Variegated mottling points to a viral sap-sucking vector mechanism transmission rather than background deficiency."
        };
        signsDetected = ["Active whitefly/aphid populations"];
        symptomsDetected = ["Variegated yellow-green leaf patterns", "Rugose surface puckering"];
      }
    } else if (lower.includes("curl") || lower.includes("roll") || lower.includes("distort") || lower.includes("crumple")) {
      matchedCategory = "Distortion of leaves";
      if (locale === "bn") {
        analysis = "পাতা কুঁচকে যাওয়া, বিকৃত হওয়া বা অমসৃণ বুদবুদের মতো বৃদ্ধির জন্য এটি 'Distortion of leaves' (পাতা বিকৃতি হওয়া) রোগ হিসেবে চিহ্নিত হয়েছে।";
        bioticOrAbiotic = {
          conclusion: "Biotic",
          rationale: "পাতা বিকৃত হওয়া মূলত গাছের কচি অংশে মাকড় (Mites) বা এফিডের মতো রস চোষক পোকার লালার বিষক্রিয়ার জন্য হয়।"
        };
        signsDetected = ["পাতার নিচে সুক্ষ্ম মাকড়সার জালের মতো অংশ", "জাব পোকার খোলস"];
        symptomsDetected = ["পাতা উপরের দিকে বা নিচের দিকে কোঁকড়ানো", "অমসৃণ ফুসকুড়ি যুক্ত পাতা"];
      } else {
        analysis = "Matched 'Distortion of leaves' relating of leaf blistering, curling, wrinkling, or unusual dimensions.";
        bioticOrAbiotic = {
          conclusion: "Biotic" as "Biotic" | "Abiotic",
          rationale: "Cupped puckering often matches virus or sap feeding by microscopic mites or aphids that distort growth buds."
        };
        signsDetected = ["Microscopic silken webbing on leaf undersides", "Cast aphid exuviae"];
        symptomsDetected = ["Leaves curled upward or downward", "Bubbling puckered lamina"];
      }
    } else if (lower.includes("little") || lower.includes("small leaf") || lower.includes("miniature")) {
      matchedCategory = "Little leaf";
      if (locale === "bn") {
        analysis = "পাতার আকার ব্যাপকভাবে কমে ক্ষুদ্রাকৃতি হয়ে যাওয়ার জন্য এটি 'Little leaf' (ক্ষুদ্রাকৃতির পাতা রোগ) হিসেবে সনাক্ত হয়েছে।";
        bioticOrAbiotic = {
          conclusion: "Biotic",
          rationale: "কচি পাতা খুব বেশি ছোট এবং ঘন ঝোপের মতো হয়ে যাওয়া মূলত মাইক্রোপ্লাজমা বা ফাইটোোপ্লাজমার কারণে ঘটে।"
        };
        signsDetected = ["কাণ্ড ও পর্বমধ্য খুব ছোট ফাঁকবিশিষ্ট হওয়া, কোনো পচনশীল দাগ নেই"];
        symptomsDetected = ["ক্ষুদ্রাকৃতির ত্রুটিহীন সবুজ পাতা", "কাণ্ডের কচি ডগায় অতিরিক্ত পাতার ঝোপ"];
      } else {
        analysis = "Matched 'Little leaf' showing clear stunted bunch stem structures with miniature leaf growths.";
        bioticOrAbiotic = {
          conclusion: "Biotic" as "Biotic" | "Abiotic",
          rationale: "Severe dwarfing of leaves into miniature scales points directly to a phytoplasma pathogen (living biotic factor)."
        };
        signsDetected = ["Severe internode shortening, no visible necrotic leaf spots"];
        symptomsDetected = ["Miniature perfectly formed leaves", "Bunchy main stalk growth"];
      }
    }

    return res.json({
      matchedCategory,
      confidence: "Medium",
      analysis,
      pageRecommendations,
      organicManagement,
      bioticOrAbiotic,
      signsDetected,
      symptomsDetected,
      big5Assessment,
      errorInfo: error.message
    });
  }
});

// Configure Vite middleware in development
import { createServer as createViteServer } from "vite";

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static frontend compiled bundle
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CABI Diagnosis Builder Server listening at http://localhost:${PORT}`);
  });
}

startServer();
