import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { refreshNewsCache } from "@/lib/data/news";
import { refreshEsportsCache } from "@/lib/data/esports";
import { refreshHeroStatsCache } from "@/lib/data/heroes";
import { cacheGet, cacheKeys } from "@/lib/data/cache";

const CRON_SECRET = process.env.CRON_SECRET || "dota2-refresh-2026";

// Refresh all cached data from external APIs
export async function POST(req: NextRequest) {
  // Protect with secret
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const start = Date.now();
  const results: Record<string, unknown> = {};

  // Refresh all caches in parallel
  const [newsOk, esportsResult, heroStatsOk] = await Promise.all([
    refreshNewsCache(),
    refreshEsportsCache(),
    refreshHeroStatsCache(),
  ]);

  results.news = newsOk ? "ok" : "failed";
  results.esports = esportsResult;
  results.heroStats = heroStatsOk ? "ok" : "failed";

  results.duration = `${Date.now() - start}ms`;
  results.cacheKeys = cacheKeys();

  // Trigger ISR revalidation for static pages using this data
  revalidatePath("/");
  revalidatePath("/meta");
  revalidatePath("/meta/tier-list");
  revalidatePath("/news");
  revalidatePath("/esports");
  revalidatePath("/esports/schedule");
  revalidatePath("/esports/teams");

  console.log("[Cache] Refresh complete:", results);

  return NextResponse.json({ success: true, ...results });
}

// GET returns current cache status
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const keys = cacheKeys();
  const stats: Record<string, unknown> = {};

  for (const key of keys) {
    const data = cacheGet(key);
    if (data) {
      if (Array.isArray(data)) {
        stats[key] = `${(data as Array<unknown>).length} items`;
      } else {
        stats[key] = "cached";
      }
    }
  }

  return NextResponse.json({ keys, stats });
}
