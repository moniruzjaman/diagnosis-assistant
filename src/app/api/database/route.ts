import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// In-memory cache to avoid re-reading the file or re-fetching GitHub per request
let cachedDb: any = null;

const FALLBACK_DB = {
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
      page: 58,
      symptom_category: "Galls",
      text_preview:
        "Root knots and swellings caused by nematode infestations. Galls also show up on stems or foliage as abnormal tissue growths in response to pest feeds.",
      images: ["img_page58_0.jpeg", "img_page58_1.jpeg"],
    },
  ],
};

export async function GET() {
  try {
    if (cachedDb) {
      return NextResponse.json(cachedDb);
    }

    // 1. Try local cached file first
    const localPath = path.join(process.cwd(), "public", "output", "database.json");
    try {
      const stat = fs.statSync(localPath);
      if (stat.size > 0) {
        const raw = fs.readFileSync(localPath, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && parsed.diagnostic_keys && parsed.diagnostic_keys.length > 0) {
          cachedDb = parsed;
          return NextResponse.json(parsed);
        }
      }
    } catch {
      // ignore — try fetching from remote
    }

    // 2. Try fetching from CABI GitHub repository
    try {
      const rawUrl =
        "https://raw.githubusercontent.com/moniruzjaman/cabi-diagnosis-builder/krishiai4.0/output/database.json";
      const response = await fetch(rawUrl, { cache: "no-store" });
      if (response.ok) {
        const dbData = await response.json();
        // Cache to local file so subsequent sessions are offline/near-instant
        try {
          fs.mkdirSync(path.dirname(localPath), { recursive: true });
          fs.writeFileSync(localPath, JSON.stringify(dbData, null, 2), "utf-8");
        } catch {
          // ignore disk write errors
        }
        cachedDb = dbData;
        return NextResponse.json(dbData);
      }
    } catch {
      // fall through to fallback
    }

    // 3. Return offline mock fallback
    cachedDb = FALLBACK_DB;
    return NextResponse.json(FALLBACK_DB);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to load database", detail: err?.message },
      { status: 500 }
    );
  }
}
