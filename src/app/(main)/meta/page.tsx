import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllHeroesWithMeta } from "@/lib/data";
import { formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, BarChart3, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Meta数据",
  description: "DOTA2当前版本Meta数据分析，英雄胜率排名和梯队分级。",
};

export default async function MetaPage() {
  const heroes = await getAllHeroesWithMeta("api");

  const totalHeroes = heroes.length;
  const avgWinRate =
    heroes.reduce((sum, h) => sum + (h.meta?.winRate ?? 0), 0) / totalHeroes;
  const avgPickRate =
    heroes.reduce((sum, h) => sum + (h.meta?.pickRate ?? 0), 0) / totalHeroes;
  const sortedByWR = [...heroes]
    .sort((a, b) => (b.meta?.winRate ?? 0) - (a.meta?.winRate ?? 0));
  const top5 = sortedByWR.slice(0, 5);
  const bottom5 = sortedByWR.slice(-5).reverse();

  return (
    <Container className="py-8">
      <PageHeader
        title="Meta数据总览"
        description="当前版本DOTA2英雄数据统计与分析"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-dota-accent" />
              <p className="text-xs text-dota-muted">英雄总数</p>
            </div>
            <p className="text-2xl font-bold text-dota-text">{totalHeroes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-dota-accent" />
              <p className="text-xs text-dota-muted">平均胜率</p>
            </div>
            <p className="text-2xl font-bold text-dota-text">
              {formatPercent(avgWinRate)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-dota-green" />
              <p className="text-xs text-dota-muted">最高胜率</p>
            </div>
            <p className="text-2xl font-bold text-dota-green">
              {formatPercent(top5[0]?.meta?.winRate ?? 0)}
            </p>
            <p className="text-xs text-dota-muted truncate">
              {top5[0]?.localizedNameZh}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-dota-red" />
              <p className="text-xs text-dota-muted">最低胜率</p>
            </div>
            <p className="text-2xl font-bold text-dota-red">
              {formatPercent(bottom5[0]?.meta?.winRate ?? 0)}
            </p>
            <p className="text-xs text-dota-muted truncate">
              {bottom5[0]?.localizedNameZh}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top/Bottom 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top 5 */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-dota-text flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-dota-green" />
              版本强势
            </h2>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-dota-border">
              {top5.map((hero, i) => (
                <Link
                  key={hero.id}
                  href={`/heroes/${hero.name}`}
                  className="flex items-center gap-3 py-2 hover:bg-dota-bg transition-colors -mx-2 px-2 rounded"
                >
                  <span className="text-sm text-dota-muted w-4">{i + 1}</span>
                  <img
                    src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.imageIcon}.png`}
                    alt={hero.localizedNameZh}
                    className="w-8 h-8 rounded object-cover shrink-0"
                    loading="lazy"
                  />
                  <span className="text-sm text-dota-text flex-1">
                    {hero.localizedNameZh}
                  </span>
                  <span className="text-sm font-medium text-dota-green">
                    {formatPercent(hero.meta?.winRate ?? 0)}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom 5 */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-dota-text flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-dota-red" />
              亟待加强
            </h2>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-dota-border">
              {bottom5.map((hero, i) => (
                <Link
                  key={hero.id}
                  href={`/heroes/${hero.name}`}
                  className="flex items-center gap-3 py-2 hover:bg-dota-bg transition-colors -mx-2 px-2 rounded"
                >
                  <span className="text-sm text-dota-muted w-4">
                    {totalHeroes - 4 + i}
                  </span>
                  <img
                    src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.imageIcon}.png`}
                    alt={hero.localizedNameZh}
                    className="w-8 h-8 rounded object-cover shrink-0"
                    loading="lazy"
                  />
                  <span className="text-sm text-dota-text flex-1">
                    {hero.localizedNameZh}
                  </span>
                  <span className="text-sm font-medium text-dota-red">
                    {formatPercent(hero.meta?.winRate ?? 0)}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Link to tier list */}
      <Card className="bg-gradient-to-r from-dota-surface to-dota-gold/5 border-dota-border">
        <CardContent className="py-6 text-center">
          <h2 className="text-lg font-bold text-dota-text mb-2">
            查看完整梯队排名
          </h2>
          <p className="text-sm text-dota-muted mb-4">
            按T1-T4分级查看所有英雄的Meta数据
          </p>
          <Link
            href="/meta/tier-list"
            className="inline-flex items-center gap-1 text-sm text-dota-gold hover:underline font-medium"
          >
            前往梯队列表 <BarChart3 className="w-4 h-4" />
          </Link>
        </CardContent>
      </Card>
    </Container>
  );
}
