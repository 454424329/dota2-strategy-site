import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllHeroesWithMeta, getAllItems } from "@/lib/data";
import { MOCK_GUIDES, MOCK_NEWS } from "@/lib/mock-data";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "搜索",
  description: "搜索DOTA2英雄、物品、攻略和新闻。",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.toLowerCase() ?? "";

  return (
    <Container className="py-8">
      <PageHeader title="搜索" description="搜索英雄、物品、攻略和新闻资讯" />

      <div className="max-w-xl mb-8">
        <form action="/search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dota-muted" />
            <Input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="搜索英雄、物品、攻略..."
              className="pl-12 h-12 text-lg"
              autoFocus
            />
          </div>
        </form>
      </div>

      {!query ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 text-dota-border mx-auto mb-4" />
            <p className="text-sm text-dota-muted">输入关键词开始搜索</p>
          </CardContent>
        </Card>
      ) : (
        <SearchResults query={query} />
      )}
    </Container>
  );
}

async function SearchResults({ query }: { query: string }) {
  const [heroes, items] = await Promise.all([
    getAllHeroesWithMeta("api"),
    getAllItems("api"),
  ]);

  // Search heroes
  const matchedHeroes = heroes.filter(
    (h) =>
      h.localizedNameZh.includes(query) ||
      h.localizedNameEn.toLowerCase().includes(query)
  );

  // Search items
  const matchedItems = items.filter(
    (i) =>
      i.localizedNameZh.includes(query) ||
      i.localizedNameEn.toLowerCase().includes(query)
  );

  // Search guides
  const matchedGuides = MOCK_GUIDES.filter(
    (g) =>
      g.status === "published" &&
      (g.title.toLowerCase().includes(query) ||
        g.summary?.toLowerCase().includes(query) ||
        g.hero.localizedNameZh.includes(query))
  );

  // Search news
  const matchedNews = MOCK_NEWS.filter(
    (n) =>
      n.title.toLowerCase().includes(query) ||
      n.content.toLowerCase().includes(query) ||
      n.tags.some((t) => t.toLowerCase().includes(query))
  );

  const totalResults =
    matchedHeroes.length +
    matchedItems.length +
    matchedGuides.length +
    matchedNews.length;

  if (totalResults === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Search className="w-12 h-12 text-dota-border mx-auto mb-4" />
          <p className="text-sm text-dota-muted">
            未找到与 &quot;{query}&quot; 相关的结果
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-dota-muted">
        找到 {totalResults} 个结果
      </p>

      {/* Heroes results */}
      {matchedHeroes.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-dota-text mb-3">
            英雄 ({matchedHeroes.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {matchedHeroes.slice(0, 10).map((hero) => (
              <Link key={hero.id} href={`/heroes/${hero.name}`}>
                <Card className="h-full card-hover">
                  <CardContent className="p-3 text-center">
                    <img
                      src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.imageIcon}.png`}
                      alt={hero.localizedNameZh}
                      className="w-12 h-12 mx-auto rounded object-cover mb-2"
                      loading="lazy"
                    />
                    <p className="text-xs font-medium text-dota-text truncate">
                      {hero.localizedNameZh}
                    </p>
                    {hero.meta && (
                      <p className="text-xs text-dota-muted mt-1">
                        胜率 {(hero.meta.winRate * 100).toFixed(1)}%
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Items results */}
      {matchedItems.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-dota-text mb-3">
            物品 ({matchedItems.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {matchedItems.slice(0, 12).map((item) => (
              <Link key={item.id} href={`/items/${item.id}`}>
                <Card className="h-full card-hover">
                  <CardContent className="p-3 text-center">
                    <img
                      src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${item.imageIcon}.png`}
                      alt={item.localizedNameZh}
                      className="w-12 h-8 mx-auto rounded object-cover mb-2"
                      loading="lazy"
                    />
                    <p className="text-xs font-medium text-dota-text truncate">
                      {item.localizedNameZh}
                    </p>
                    <p className="text-xs text-dota-gold mt-1">{item.cost}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Guides results */}
      {matchedGuides.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-dota-text mb-3">
            攻略 ({matchedGuides.length})
          </h2>
          <div className="space-y-2">
            {matchedGuides.slice(0, 5).map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`}>
                <Card className="card-hover">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${guide.hero.imageIcon}.png`}
                        alt={guide.hero.localizedNameZh}
                        className="w-10 h-10 rounded object-cover shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-dota-text truncate">
                          {guide.title}
                        </p>
                        <p className="text-xs text-dota-muted">
                          {guide.hero.localizedNameZh} · {guide.author.name}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {guide.difficulty === "beginner"
                          ? "新手"
                          : guide.difficulty === "intermediate"
                            ? "进阶"
                            : "高手"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* News results */}
      {matchedNews.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-dota-text mb-3">
            新闻 ({matchedNews.length})
          </h2>
          <div className="space-y-2">
            {matchedNews.slice(0, 5).map((news) => (
              <Link key={news.id} href={`/news/${news.slug}`}>
                <Card className="card-hover">
                  <CardContent className="py-3">
                    <p className="text-sm font-medium text-dota-text truncate mb-1">
                      {news.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-dota-muted">
                        {news.sourceName}
                      </span>
                      <span className="text-xs text-dota-muted">·</span>
                      <span className="text-xs text-dota-muted">
                        {news.category === "esports"
                          ? "赛事"
                          : news.category === "patch"
                            ? "版本更新"
                            : "新闻"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
