// Bring-your-own-key AI diagnosis via any OpenAI-compatible chat API.
//
// Why BYOK: the app deploys as a static site on GitHub Pages, so there is no
// server to hold a secret. Truly key-less browser AI endpoints either require
// a CAPTCHA (Pollinations Turnstile) or block CORS (Groq). OpenRouter, on the
// other hand, sends permissive CORS headers AND offers genuinely free models
// (model ids ending in `:free` cost $0 even with a $0-credit account). So the
// user pastes one free OpenRouter key into the in-app settings panel; it lives
// only in their browser's localStorage and is never committed to the repo.
//
// Resolution order (see staticDiagnose.ts):
//   1. This module — if a key is configured, call the OpenAI-compatible API.
//   2. Deterministic heuristic — always available, works fully offline.

import { AIDiagnosisResult } from "./types";

type Locale = "bn" | "en";

interface FreeAiInput {
  symptomDescription: string;
  image?: string | null;
  locale?: Locale;
}

export interface AiConfig {
  endpoint: string; // OpenAI-compatible chat completions URL
  apiKey: string;
  model: string;
}

const STORAGE_KEY = "cabi_ai_config";
const REQUEST_TIMEOUT_MS = 60_000;

// Sensible defaults per provider so the user only has to paste a key.
export const PROVIDER_PRESETS: Record<
  string,
  { label: string; endpoint: string; model: string; keyUrl: string }
> = {
  openrouter: {
    label: "OpenRouter (free models)",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    model: "meta-llama/llama-3.2-3b-instruct:free",
    keyUrl: "https://openrouter.ai/keys",
  },
  groq: {
    label: "Groq (free tier)",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.1-8b-instant",
    keyUrl: "https://console.groq.com/keys",
  },
  custom: {
    label: "Custom OpenAI-compatible",
    endpoint: "",
    model: "",
    keyUrl: "",
  },
};

export function loadAiConfig(): AiConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cfg = JSON.parse(raw) as Partial<AiConfig>;
    if (cfg && cfg.apiKey && cfg.endpoint && cfg.model) {
      return { endpoint: cfg.endpoint, apiKey: cfg.apiKey, model: cfg.model };
    }
  } catch {
    // corrupt / missing — treat as unconfigured
  }
  return null;
}

export function saveAiConfig(cfg: AiConfig | null): void {
  if (typeof window === "undefined") return;
  try {
    if (cfg) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // storage disabled — non-fatal
  }
}

export function isAiEnabled(): boolean {
  return loadAiConfig()?.apiKey != null;
}

const CABI_TAXONOMY = [
  "Wilt — loss of leaf turgor / drooping; vascular pathogens (Fusarium, Verticillium, Ralstonia) blocking xylem, or severe water stress.",
  "Leaf spot — circular or elliptical necrotic lesions, often with a yellow halo; fungal (Cercospora, Alternaria, Bipolaris) or bacterial.",
  "Witches' broom — a dense mass of stunted shoots growing from one point; phytoplasma or fungal infection.",
  "Canker — a localized, often sunken dead area on a stem or branch; fungal or bacterial bark infection.",
  "Mosaic — uneven mottled yellow-and-green variegation on leaves; virus spread by aphids or whitefly.",
  "Yellowing of leaves — symmetric, generalized chlorosis; usually abiotic (nitrogen/magnesium deficiency or root stress).",
  "Distortion of leaves — curling, rolling, puckering or blistering; virus, mites or aphid saliva toxicity.",
  "Little leaf — marked reduction in leaf size with stunted bunchy stems; phytoplasma pathogen.",
  "Galls — abnormal swellings on roots, stems or leaves; nematodes, Agrobacterium or insects.",
  "Drying/necrosis/blight — rapid browning and withering of foliage, water-soaked margins; Phytophthora or Alternaria under moist heat.",
].join("\n");

function systemPrompt(locale: Locale): string {
  const lang =
    locale === "bn"
      ? "Bengali (Bangla). Use Bengali numerals (১২৩) for page numbers and write every human-readable string in Bangla."
      : "English.";
  return [
    "You are a senior CABI Plantwise field plant pathologist. Diagnose the crop symptom the farmer describes and return a structured result following the CABI Plantwise Diagnostic Field Guide.",
    "",
    "Choose matchedCategory from EXACTLY one of these 10 CABI visual symptom categories:",
    CABI_TAXONOMY,
    "",
    "Return ONLY a single valid JSON object (no markdown fences, no commentary) with this exact schema:",
    JSON.stringify(
      {
        matchedCategory: "<one of the 10 category names above, exactly as written before the em dash>",
        confidence: "High | Medium | Low",
        analysis: "<2-4 sentence paragraph explaining the diagnosis and likely causal pathogen>",
        pageRecommendations: "<array of 1-3 integers, CABI field-guide page numbers 15-118>",
        organicManagement: "<array of 3 strings, each an actionable organic/low-input management step>",
        bioticOrAbiotic: { conclusion: "Biotic | Abiotic", rationale: "<one sentence>" },
        signsDetected: "<array of 2-3 strings: direct evidence of the pathogen itself>",
        symptomsDetected: "<array of 2-3 strings: the plant's visible reactions>",
        big5Assessment: {
          economic: "<is the treatment cost-effective vs yield loss? one sentence>",
          effective: "<is it scientifically proven to control this pathogen? one sentence>",
          safe: "<does it avoid CABI Red List harmful pesticides? one sentence>",
          practical: "<can a smallholder farmer implement it? one sentence>",
          locallyAvailable: "<are inputs obtainable locally/cheaply? one sentence>",
        },
      },
      null,
      2
    ),
    "",
    `Write EVERY human-readable string in ${lang}`,
    'matchedCategory must be the English category name exactly as listed (e.g. "Leaf spot"), never translated.',
    "Do NOT include any field outside this schema.",
  ].join("\n");
}

function extractJson(text: string): unknown | null {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // continue
  }
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    try {
      return JSON.parse(fence[1].trim());
    } catch {
      // continue
    }
  }
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    try {
      return JSON.parse(trimmed.slice(first, last + 1));
    } catch {
      // continue
    }
  }
  return null;
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x)).filter((s) => s.length > 0);
  return [];
}

function asNumberArray(v: unknown): number[] {
  if (Array.isArray(v)) {
    return v
      .map((x) => (typeof x === "number" ? x : parseInt(String(x), 10)))
      .filter((n) => Number.isFinite(n) && n > 0);
  }
  return [];
}

const VALID_CATEGORIES = [
  "Wilt",
  "Leaf spot",
  "Witches' broom",
  "Canker",
  "Mosaic",
  "Yellowing of leaves",
  "Distortion of leaves",
  "Little leaf",
  "Galls",
  "Drying/necrosis/blight",
];

function normaliseCategory(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const lower = raw.toLowerCase().trim();
  const exact = VALID_CATEGORIES.find((c) => c.toLowerCase() === lower);
  if (exact) return exact;
  const partial = VALID_CATEGORIES.find((c) => lower.includes(c.toLowerCase()));
  return partial || null;
}

function coerceResult(parsed: unknown, locale: Locale): AIDiagnosisResult | null {
  const o = (parsed ?? {}) as Record<string, unknown>;
  const category = normaliseCategory(o.matchedCategory);
  if (!category) return null;
  const conf = o.confidence;
  const confidence: AIDiagnosisResult["confidence"] =
    conf === "High" || conf === "Medium" || conf === "Low" ? conf : "Medium";

  const boa = (o.bioticOrAbiotic ?? {}) as Record<string, unknown>;
  const b5 = (o.big5Assessment ?? {}) as Record<string, unknown>;
  const fallbackText = locale === "bn" ? "তথ্য অনুপস্থিত।" : "Information unavailable.";
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : fallbackText);

  return {
    matchedCategory: category,
    confidence,
    analysis: str(o.analysis),
    pageRecommendations: asNumberArray(o.pageRecommendations).length
      ? asNumberArray(o.pageRecommendations)
      : [15],
    organicManagement: asStringArray(o.organicManagement).length
      ? asStringArray(o.organicManagement)
      : [fallbackText],
    bioticOrAbiotic: {
      conclusion: boa.conclusion === "Abiotic" ? "Abiotic" : "Biotic",
      rationale: str(boa.rationale),
    },
    signsDetected: asStringArray(o.signsDetected),
    symptomsDetected: asStringArray(o.symptomsDetected),
    big5Assessment: {
      economic: str(b5.economic),
      effective: str(b5.effective),
      safe: str(b5.safe),
      practical: str(b5.practical),
      locallyAvailable: str(b5.locallyAvailable),
    },
    errorInfo: undefined,
  };
}

// Public entry point. Returns a validated AIDiagnosisResult, or null if no key
// is configured or the call failed (caller falls back to the heuristic).
export async function diagnoseViaFreeAi(
  input: FreeAiInput
): Promise<AIDiagnosisResult | null> {
  const symptomDescription = (input.symptomDescription || "").trim();
  if (!symptomDescription) return null;
  const cfg = loadAiConfig();
  if (!cfg || !cfg.apiKey) return null;

  const locale: Locale = input.locale || "bn";
  const userContent = input.image
    ? `${symptomDescription}\n\n(An image was uploaded with this report; if your model cannot see images, base your diagnosis on the text description above.)`
    : symptomDescription;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(cfg.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
        // OpenRouter requests these for attribution; harmless on other providers.
        "HTTP-Referer":
          typeof window !== "undefined" ? window.location.origin : "https://github.com",
        "X-Title": "CABI Plant Diagnosis Assistant",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: cfg.model,
        messages: [
          { role: "system", content: systemPrompt(locale) },
          { role: "user", content: userContent },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = extractJson(content);
    if (!parsed) return null;
    return coerceResult(parsed, locale);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
