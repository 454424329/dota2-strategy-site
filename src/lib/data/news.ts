import type { NewsArticle } from "@/types/dota";
import { MOCK_NEWS } from "@/lib/mock-data";

const DOTA2_BLOG_RSS = "https://www.dota2.com/news/rss";

interface NewsFetchResult {
  items: NewsArticle[];
  source: "api" | "mock";
}

async function fetchRSSNews(): Promise<NewsArticle[] | null> {
  try {
    // Try the Dota 2 blog RSS
    const res = await fetch(DOTA2_BLOG_RSS, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/xml" },
    });

    if (!res.ok) return null;

    const text = await res.text();

    // Simple XML parsing of RSS feed
    const items: NewsArticle[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(text)) !== null) {
      const block = match[1];
      const title = extractTag(block, "title");
      const link = extractTag(block, "link");
      const desc = extractTag(block, "description");
      const pubDate = extractTag(block, "pubDate");

      if (!title) continue;

      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .slice(0, 80);

      items.push({
        id: `rss-${slug}`,
        sourceName: "DOTA2 官方",
        sourceUrl: link || "https://www.dota2.com/news",
        title,
        content: stripHtml(desc || "").slice(0, 500),
        imageUrl: null,
        category: "patch",
        tags: [],
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        slug,
        isFeatured: false,
        viewCount: 0,
      });
    }

    return items.length > 0 ? items : null;
  } catch {
    return null;
  }
}

function extractTag(text: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
  const cdata = text.match(re);
  if (cdata) return cdata[1];

  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = text.match(plain);
  return m ? m[1] : "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
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
    const apiNews = await fetchRSSNews();
    if (apiNews && apiNews.length > 0) {
      return { items: apiNews, source: "api" };
    }
  }

  return { items: getRefreshedMockNews(), source: "mock" };
}
