import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllHeroesWithMeta } from "@/lib/data";
import { HeroWinRateBadge } from "@/components/hero/HeroWinRateBadge";
import { formatPercent } from "@/lib/utils";

const tiers = [
  { label: "T1", minWR: 0.52, color: "text-dota-gold", bg: "bg-dota-gold/10" },
  { label: "T2", minWR: 0.50, color: "text-dota-text", bg: "bg-dota-surface" },
  { label: "T3", minWR: 0.48, color: "text-dota-muted", bg: "bg-dota-bg" },
  { label: "T4", minWR: 0.0, color: "text-dota-muted", bg: "bg-dota-bg" },
];

const tierBorder: Record<string, string> = {
  T1: "border-dota-gold/50",
  T2: "border-dota-border",
  T3: "border-dota-border",
  T4: "border-dota-border",
};

export default async function TierListPage() {
  const heroesWithMeta = await getAllHeroesWithMeta("api");
  const sorted = [...heroesWithMeta].sort(
    (a, b) => (b.meta?.winRate ?? 0) - (a.meta?.winRate ?? 0)
  );

  const grouped: Record<string, typeof sorted> = {};
  for (const h of sorted) {
    const wr = h.meta?.winRate ?? 0;
    const tier =
      wr >= 0.52 ? "T1" : wr >= 0.50 ? "T2" : wr >= 0.48 ? "T3" : "T4";
    if (!grouped[tier]) grouped[tier] = [];
    grouped[tier].push(h);
  }

  return (
    <Container className="py-8">
      <PageHeader
        title="英雄梯队排名"
        description="基于当前版本胜率和出场率的英雄分级"
      />

      <div className="space-y-6">
        {tiers.map((tier) => {
          const heroes = grouped[tier.label];
          if (!heroes?.length) return null;
          return (
            <div key={tier.label}>
              <div className={`flex items-center gap-3 mb-3 p-3 rounded-lg ${tier.bg}`}>
                <Badge variant="outline" className={`text-lg font-bold ${tier.color}`}>
                  {tier.label}
                </Badge>
                <span className="text-sm text-dota-muted">
                  胜率{" "}
                  {tier.label === "T1"
                    ? ">= 52%"
                    : tier.label === "T2"
                      ? ">= 50%"
                      : tier.label === "T3"
                        ? ">= 48%"
                        : "< 48%"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {heroes.map((hero) => (
                  <Link
                    key={hero.id}
                    href={`/heroes/${hero.name}`}
                    className="block"
                  >
                    <Card className={`${tierBorder[tier.label]} card-hover`}>
                      <CardContent className="py-3 flex items-center gap-3">
                        <img
                          src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.imageIcon}.png`}
                          alt={hero.localizedNameZh}
                          className="w-10 h-10 rounded object-cover shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dota-text truncate">
                            {hero.localizedNameZh}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-dota-muted">
                            <span>出场 {formatPercent(hero.meta?.pickRate ?? 0)}</span>
                            <span>·</span>
                            <span>禁用 {formatPercent(hero.meta?.banRate ?? 0)}</span>
                          </div>
                        </div>
                        <HeroWinRateBadge winRate={hero.meta?.winRate ?? 0} />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
