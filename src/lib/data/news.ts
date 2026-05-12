import type { NewsArticle } from "@/types/dota";
import { MOCK_NEWS } from "@/lib/mock-data";
import { cacheGet, cacheSet } from "./cache";
import { batchTranslate } from "@/lib/translate";

// Steam "GetNewsForApp" API for Dota 2 (appid=570)
const STEAM_NEWS_API = "https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/";
const CACHE_KEY = "steam:news";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

interface NewsFetchResult {
  items: NewsArticle[];
  source: "api" | "mock";
}

interface SteamNewsItem {
  gid: string;
  title: string;
  url: string;
  is_external_url: boolean;
  author: string;
  contents: string;
  feedlabel: string;
  date: number; // Unix timestamp
  feedname: string;
  feed_type: number; // 1 = official
  tags?: string[];
}

interface SteamNewsResponse {
  appnews: {
    appid: number;
    newsitems: SteamNewsItem[];
    count: number;
  };
}

function stripHtml(html: string): string {
  // Remove Steam image tags like {STEAM_CLAN_IMAGE}/...
  let cleaned = html.replace(/\{STEAM_CLAN_IMAGE\}\/[^\s]*/g, "");
  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, " ");
  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  return cleaned;
}

function extractImageFromContent(contents: string): string | null {
  // {STEAM_CLAN_IMAGE}/3703047/221cbdb6394fb7f0d037aada83d1312b0f59f869.png
  const re = /\{STEAM_CLAN_IMAGE\}\/([^\s]+)/;
  const m = contents.match(re);
  if (m) {
    return `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans/${m[1]}`;
  }
  return null;
}

function classifyNews(item: SteamNewsItem): string {
  if (item.tags?.includes("patchnotes")) return "patch";
  const t = item.title.toLowerCase();
  if (t.includes("patch") || t.includes("update") || t.includes("gameplay")) return "patch";
  if (t.includes("tournament") || t.includes("esport") || t.includes("major") || t.includes("international") || t.includes("ti ")) return "esports";
  if (t.includes("hero") || t.includes("item")) return "heroes";
  if (t.includes("event") || t.includes("battle pass") || t.includes("crownfall") || t.includes("season")) return "event";
  if (item.feed_type === 1) return "official";
  return "news";
}

async function fetchSteamNews(): Promise<NewsArticle[] | null> {
  try {
    const url = `${STEAM_NEWS_API}?appid=570&count=30&maxlength=600`;
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return null;

    const json: SteamNewsResponse = await res.json();
    const items = json.appnews?.newsitems;

    if (!items || items.length === 0) return null;

    // Map raw items and translate to Chinese in parallel
    const now = new Date();
    const articles: NewsArticle[] = items.map((item) => {
      const plainContent = stripHtml(item.contents);
      const imageUrl = extractImageFromContent(item.contents);
      const category = classifyNews(item);
      const slug = item.gid;
      const publishedAt = new Date(item.date * 1000).toISOString();
      const isFeatured =
        item.feed_type === 1 &&
        (item.tags?.includes("patchnotes") ?? false);

      return {
        id: `steam-${item.gid}`,
        sourceName: item.feedlabel || "DOTA2",
        sourceUrl: item.url,
        title: item.title,
        content: plainContent.slice(0, 600),
        imageUrl,
        category,
        tags: item.tags || [],
        publishedAt,
        slug,
        isFeatured,
        viewCount: 0,
      };
    });

    // Translate all titles and contents to Chinese (batched)
    const [titles, contents] = await Promise.all([
      batchTranslate(articles.map((a) => a.title), 5),
      batchTranslate(articles.map((a) => a.content), 5),
    ]);

    return articles.map((a, i) => ({
      ...a,
      title: titles[i],
      content: contents[i],
    }));
  } catch {
    return null;
  }
}

// Update mock news dates to appear current
function getRefreshedMockNews(): NewsArticle[] {
  const now = new Date();
  return MOCK_NEWS.map((n, i) => {
    const daysAgo = i * 3;
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return { ...n, publishedAt: d.toISOString() };
  });
}

export async function getLatestNews(source: "api" | "mock" = "api"): Promise<NewsFetchResult> {
  if (source === "api") {
    // Check cache first
    const cached = cacheGet<NewsArticle[]>(CACHE_KEY);
    if (cached) {
      return { items: cached, source: "api" };
    }

    const apiNews = await fetchSteamNews();
    if (apiNews && apiNews.length > 0) {
      cacheSet(CACHE_KEY, apiNews, CACHE_TTL);
      return { items: apiNews, source: "api" };
    }
  }

  return { items: getRefreshedMockNews(), source: "mock" };
}

// Called by cache refresh to pre-warm
export async function refreshNewsCache(): Promise<boolean> {
  const apiNews = await fetchSteamNews();
  if (apiNews && apiNews.length > 0) {
    cacheSet(CACHE_KEY, apiNews, CACHE_TTL);
    console.log(`[Cache] News refreshed: ${apiNews.length} articles`);
    return true;
  }
  console.warn("[Cache] News refresh failed, cache not updated");
  return false;
}
