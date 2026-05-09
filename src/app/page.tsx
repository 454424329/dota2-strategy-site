import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { HeroGrid } from "@/components/hero/HeroGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllHeroesWithMeta, getLatestNews } from "@/lib/data";
import { SafeImage } from "@/components/shared/SafeImage";
import { MOCK_GUIDES } from "@/lib/mock-data";
import { formatDate, formatTimeAgo, getHeroImageUrl } from "@/lib/utils";
import {
  ArrowRight,
  TrendingUp,
  BookOpen,
  Newspaper,
  Trophy,
} from "lucide-react";

const latestGuides = MOCK_GUIDES.filter((g) => g.status === "published").slice(
  0,
  3
);

const categoryLabels: Record<string, string> = {
  esports: "赛事",
  patch: "版本更新",
  news: "新闻",
};

export default async function HomePage() {
  const [heroesWithMeta, { items: newsItems }] = await Promise.all([
    getAllHeroesWithMeta("api"),
    getLatestNews("api"),
  ]);
  const sortedByWinRate = [...heroesWithMeta]
    .sort((a, b) => (b.meta?.winRate ?? 0) - (a.meta?.winRate ?? 0))
    .slice(0, 12);

  const featuredNews = newsItems.filter((n) => n.isFeatured);
  const latestNews = newsItems.slice(0, 3);
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-dota-border">
        <div className="absolute inset-0 bg-gradient-to-br from-dota-red/10 via-dota-bg to-dota-blue/10" />
        <Container className="relative py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="text-dota-gold">DOTA2</span>
              <span className="text-dota-text"> 攻略站</span>
            </h1>
            <p className="text-lg text-dota-muted mb-8 max-w-2xl">
              实时Meta数据、深度英雄攻略、最新赛事资讯 —
              一站式提升你的DOTA2水平
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/heroes">
                <Button variant="dota">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  查看英雄数据
                </Button>
              </Link>
              <Link href="/guides">
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  浏览攻略
                </Button>
              </Link>
              <Link href="/news">
                <Button variant="outline">
                  <Newspaper className="w-4 h-4 mr-2" />
                  最新资讯
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12 space-y-16">
        {/* Trending Heroes */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-dota-text">
                <TrendingUp className="w-5 h-5 inline mr-2 text-dota-red" />
                版本强势英雄
              </h2>
              <p className="text-sm text-dota-muted mt-1">
                当前版本胜率最高的英雄
              </p>
            </div>
            <Link
              href="/heroes"
              className="text-sm text-dota-accent hover:underline flex items-center gap-1"
            >
              查看全部 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <HeroGrid heroes={sortedByWinRate.slice(0, 10)} />
        </section>

        <Separator />

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-dota-text">
                  <Newspaper className="w-5 h-5 inline mr-2 text-dota-accent" />
                  头条新闻
                </h2>
              </div>
              <Link
                href="/news"
                className="text-sm text-dota-accent hover:underline flex items-center gap-1"
              >
                全部新闻 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredNews.map((news) => (
                <Link key={news.id} href={`/news/${news.slug}`}>
                  <Card className="h-full card-hover">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {categoryLabels[news.category] || news.category}
                        </Badge>
                        <span className="text-xs text-dota-muted">
                          {news.sourceName}
                        </span>
                      </div>
                      <h3 className="font-semibold text-dota-text leading-snug line-clamp-2">
                        {news.title}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-dota-muted line-clamp-2 mb-3">
                        {news.content}
                      </p>
                      <span className="text-xs text-dota-muted">
                        {formatTimeAgo(news.publishedAt)}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest News + Latest Guides row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest News */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-dota-text">最新资讯</h2>
              <Link
                href="/news"
                className="text-sm text-dota-accent hover:underline flex items-center gap-1"
              >
                更多 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {latestNews.map((news) => (
                <Link key={news.id} href={`/news/${news.slug}`}>
                  <Card className="card-hover">
                    <CardContent className="py-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="shrink-0">
                              {categoryLabels[news.category] || news.category}
                            </Badge>
                            <h3 className="text-sm font-medium text-dota-text truncate">
                              {news.title}
                            </h3>
                          </div>
                          <p className="text-xs text-dota-muted line-clamp-1">
                            {news.content}
                          </p>
                        </div>
                        <span className="text-xs text-dota-muted shrink-0">
                          {formatTimeAgo(news.publishedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Latest Guides */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-dota-text">最新攻略</h2>
              <Link
                href="/guides"
                className="text-sm text-dota-accent hover:underline flex items-center gap-1"
              >
                更多 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {latestGuides.map((guide) => (
                <Link key={guide.id} href={`/guides/${guide.slug}`}>
                  <Card className="card-hover">
                    <CardContent className="py-3">
                      <div className="flex items-center gap-4">
                        <SafeImage
                          src={getHeroImageUrl(guide.hero.imageIcon)}
                          alt={guide.hero.localizedNameZh}
                          className="w-10 h-10 rounded object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-medium text-dota-text truncate">
                            {guide.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-dota-accent">
                              {guide.hero.localizedNameZh}
                            </span>
                            <span className="text-xs text-dota-muted">·</span>
                            <span className="text-xs text-dota-muted">
                              {guide.difficulty === "beginner"
                                ? "新手"
                                : guide.difficulty === "intermediate"
                                ? "进阶"
                                : "高手"}
                            </span>
                            <span className="text-xs text-dota-muted">·</span>
                            <span className="text-xs text-dota-muted">
                              {guide.author.name}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-dota-muted">
                            {formatDate(guide.createdAt)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Esports quick link */}
        <section>
          <Card className="bg-gradient-to-r from-dota-surface to-dota-blue/5 border-dota-border">
            <CardContent className="py-8 text-center">
              <Trophy className="w-8 h-8 text-dota-gold mx-auto mb-3" />
              <h2 className="text-lg font-bold text-dota-text mb-2">
                DOTA2 赛事中心
              </h2>
              <p className="text-sm text-dota-muted mb-4 max-w-md mx-auto">
                职业比赛实时数据、赛程安排、队伍排名 — 即将上线
              </p>
              <Link href="/esports">
                <Button variant="dota">
                  进入赛事中心 <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </Container>
    </div>
  );
}
