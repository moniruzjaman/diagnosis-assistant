// Client-side database loader for static deployments (GitHub Pages).
//
// On a static export there is no /api/database route. The CABI database is
// shipped as a static JSON file at <basePath>/output/database.json and
// fetched directly by the browser. A small offline fallback is kept so the
// app still renders reference content even if the JSON fetch fails.

import { DatabaseSchema } from "./types";

const FALLBACK_DB: DatabaseSchema = {
  metadata: {
    source: "CABI Plantwise Diagnostic Field Guide (Local Offline Cache Fallback)",
    total_pages: 118,
  },
  diagnostic_keys: [
    {
      page: 15,
      symptom_category: "Leaf spot",
      text_preview:
        "This cashew leaf has leaf spots, which are clearly defined and are all a similar size. This clear delineation between healthy and infected tissue is typical.",
      images: ["img_page15_0.jpeg", "img_page15_1.jpeg"],
    },
    {
      page: 26,
      symptom_category: "Drying/necrosis/blight",
      text_preview:
        "Wilt YES can be common. Often caused by root-attacking phytophthoras. Leaves turn brown, starting from margins, drying up rapidly in hot sun.",
      images: ["img_page26_0.jpeg", "img_page26_1.jpeg", "img_page26_2.jpeg"],
    },
    {
      page: 43,
      symptom_category: "Mosaic",
      text_preview:
        "Mosaic pattern has an uneven mottled colour on leaves, yellow areas mixed with normal green areas giving a variegated appearance.",
      images: ["img_page43_0.jpeg", "img_page43_1.jpeg", "img_page43_2.jpeg"],
    },
    {
      page: 52,
      symptom_category: "Distortion of leaves",
      text_preview:
        "Leaf distortion in tomato plants, leaves curl upward or downward, puckering, bubbling and showing abnormal growth patterns.",
      images: ["img_page52_0.jpeg", "img_page52_1.jpeg"],
    },
    {
      page: 56,
      symptom_category: "Little leaf",
      text_preview:
        "Little leaf is often considered to be the classic phytoplasma symptom. Marked reduction in leaf size with stunted bunchy stems.",
      images: ["img_page56_0.jpeg", "img_page56_1.jpeg"],
    },
    {
      page: 33,
      symptom_category: "Yellowing of leaves",
      text_preview:
        "Yellowing of leaves (chlorosis) is a symptom of nutrient deficiency, commonly nitrogen or magnesium, or of impaired root function.",
      images: ["img_page33_0.jpeg", "img_page33_1.jpeg"],
    },
    {
      page: 18,
      symptom_category: "Wilt",
      text_preview:
        "Wilt is the loss of turgor pressure in leaves, often caused by vascular pathogens blocking xylem vessels or by severe water stress.",
      images: ["img_page18_0.jpeg", "img_page18_1.jpeg"],
    },
    {
      page: 70,
      symptom_category: "Canker",
      text_preview:
        "Canker is a localized dead area on a stem or branch, often sunken, caused by fungal or bacterial infection of the bark.",
      images: ["img_page70_0.jpeg", "img_page70_1.jpeg"],
    },
    {
      page: 84,
      symptom_category: "Galls",
      text_preview:
        "Galls are abnormal swellings on roots, stems or leaves, induced by insects, mites, nematodes or bacteria such as Agrobacterium.",
      images: ["img_page84_0.jpeg", "img_page84_1.jpeg"],
    },
    {
      page: 95,
      symptom_category: "Witches' broom",
      text_preview:
        "Witches' broom is a dense mass of shoots growing from a single point, often caused by phytoplasma or fungal infection.",
      images: ["img_page95_0.jpeg", "img_page95_1.jpeg"],
    },
  ],
};

// Resolve the static JSON URL honouring the configured basePath.
// NEXT_PUBLIC_BASE_PATH is injected by next.config.ts and is empty in dev.
function staticDbUrl(): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${basePath}/output/database.json`;
}

export async function loadDatabase(): Promise<DatabaseSchema> {
  // 1. Try the shipped static JSON (works on GitHub Pages and locally).
  try {
    const res = await fetch(staticDbUrl(), { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as DatabaseSchema;
      if (data && Array.isArray(data.diagnostic_keys) && data.diagnostic_keys.length > 0) {
        return data;
      }
    }
  } catch {
    // fall through to the API attempt / fallback
  }

  // 2. Try the dev-only server route (works when running `next dev` with the
  //    API routes present, before static export).
  try {
    const res = await fetch("/api/database", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as DatabaseSchema;
      if (data && Array.isArray(data.diagnostic_keys)) {
        return data;
      }
    }
  } catch {
    // fall through to the fallback
  }

  // 3. Offline fallback so the UI still renders reference content.
  return FALLBACK_DB;
}
