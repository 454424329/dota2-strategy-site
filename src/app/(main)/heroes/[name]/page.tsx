import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/PageHeader";
import { HeroWinRateBadge } from "@/components/hero/HeroWinRateBadge";
import { HeroRoleTags } from "@/components/hero/HeroRoleTags";
import { getHeroByName } from "@/lib/data";
import { generateMockAbilities } from "@/lib/mock-data";
import {
  ATTRIBUTE_NAMES,
  ATTRIBUTE_COLORS,
  ROLE_NAMES,
  type AttributeType,
  type ItemBuildData,
} from "@/types/dota";
import {
  getWinRateColor,
  formatPercent,
  formatNumber,
} from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Swords,
  Shield,
  Zap,
  Clock,
  ArrowLeft,
  BookOpen,
} from "lucide-react";

interface HeroPageProps {
  params: Promise<{ name: string }>;
}

const heroImageUrl = (icon: string) =>
  `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${icon}.png`;
const itemImageUrl = (icon: string) =>
  `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${icon}.png`;

const phaseLabels: Record<string, string> = {
  starting: "出门装",
  early: "前期",
  mid: "中期核心",
  late: "后期",
};

export default async function HeroPage({ params }: HeroPageProps) {
  const { name } = await params;
  const result = await getHeroByName(name, "api", "api");
  if (!result) notFound();

  const { hero, meta, matchups, itemBuilds } = result;
  const abilities = generateMockAbilities(hero);

  const attr = hero.primaryAttribute as AttributeType;

  // Group item builds by phase
  const buildsByPhase = itemBuilds.reduce<
    Record<string, ItemBuildData[]>
  >((acc, build) => {
    const phase = build.gamePhase;
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(build);
    return acc;
  }, {});

  const sortedMatchups = [...matchups].sort(
    (a, b) => b.advantage - a.advantage
  );

  return (
    <Container className="py-8">
      {/* Back link */}
      <Link
        href="/heroes"
        className="inline-flex items-center gap-1 text-sm text-dota-muted hover:text-dota-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回英雄列表
      </Link>

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Hero Image */}
        <div className="shrink-0">
          <img
            src={heroImageUrl(hero.imagePortrait)}
            alt={hero.localizedNameZh}
            className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover border border-dota-border"
          />
        </div>

        {/* Hero Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-dota-text">
              {hero.localizedNameZh}
            </h1>
            <p className="text-sm text-dota-muted mt-1">{hero.localizedNameEn}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={attr} className="text-sm px-3 py-1">
              {ATTRIBUTE_NAMES[attr]}
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {hero.attackType === "Melee" ? "近战" : "远程"}
            </Badge>
            <HeroWinRateBadge winRate={meta.winRate} />
          </div>

          <HeroRoleTags roles={hero.roles} />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickStat
              label="胜率"
              value={formatPercent(meta.winRate)}
              valueClass={getWinRateColor(meta.winRate)}
            />
            <QuickStat label="出场率" value={formatPercent(meta.pickRate)} />
            <QuickStat label="Ban率" value={formatPercent(meta.banRate)} />
            <QuickStat label="对局数" value={formatNumber(meta.totalMatches)} />
          </div>
        </div>
      </div>

      {/* Detail Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="items">装备</TabsTrigger>
          <TabsTrigger value="matchups">克制</TabsTrigger>
          <TabsTrigger value="abilities">技能</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Swords className="w-4 h-4" />}
              label="场均击杀"
              value={meta.avgKills?.toFixed(1) ?? "-"}
            />
            <StatCard
              icon={<Shield className="w-4 h-4" />}
              label="场均死亡"
              value={meta.avgDeaths?.toFixed(1) ?? "-"}
            />
            <StatCard
              icon={<Zap className="w-4 h-4" />}
              label="场均助攻"
              value={meta.avgAssists?.toFixed(1) ?? "-"}
            />
            <StatCard
              icon={<Clock className="w-4 h-4" />}
              label="平均时长"
              value={
                meta.avgDuration
                  ? `${Math.floor(meta.avgDuration / 60)}:${String(meta.avgDuration % 60).padStart(2, "0")}`
                  : "-"
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="场均GPM" value={meta.avgGPM?.toFixed(0) ?? "-"} />
            <StatCard label="场均XPM" value={meta.avgXPM?.toFixed(0) ?? "-"} />
            <StatCard
              label="场均补刀"
              value={meta.avgLastHits?.toFixed(0) ?? "-"}
            />
            <StatCard label="梯队排名" value={`T${meta.tierRank ?? "-"}`} />
          </div>

          {/* Quick Item Build Summary */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-dota-text">
                热门出装路线
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(["starting", "early", "mid", "late"] as const).map(
                  (phase) => {
                    const items = buildsByPhase[phase];
                    if (!items || items.length === 0) return null;
                    return (
                      <div key={phase}>
                        <p className="text-xs font-medium text-dota-muted mb-2 uppercase tracking-wider">
                          {phaseLabels[phase]}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {items.slice(0, 4).map((item) => (
                            <Link
                              key={item.itemId}
                              href={`/items/${item.itemId}`}
                              className="flex items-center gap-2 rounded border border-dota-border bg-dota-bg px-2 py-1 text-sm hover:border-dota-accent transition-colors"
                            >
                              <img
                                src={itemImageUrl(item.itemIcon)}
                                alt={item.itemNameZh}
                                className="w-6 h-6 rounded"
                                loading="lazy"
                              />
                              <span className="text-dota-text">
                                {item.itemNameZh}
                              </span>
                              <span className="text-xs text-dota-muted">
                                {formatPercent(item.popularity)}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Items Tab */}
        <TabsContent value="items" className="space-y-6">
          {(["starting", "early", "mid", "late"] as const).map((phase) => {
            const items = buildsByPhase[phase];
            if (!items || items.length === 0) return null;
            return (
              <Card key={phase}>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-dota-text">
                    {phaseLabels[phase]}
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.itemId}
                        className="flex items-center justify-between rounded border border-dota-border bg-dota-bg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={itemImageUrl(item.itemIcon)}
                            alt={item.itemNameZh}
                            className="w-10 h-8 rounded object-cover"
                            loading="lazy"
                          />
                          <div>
                            <p className="text-sm font-medium text-dota-text">
                              {item.itemNameZh}
                            </p>
                            <p className="text-xs text-dota-muted">
                              价格: {item.cost} 金币
                              {item.avgTiming &&
                                ` · 平均 ${item.avgTiming} 分钟`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-dota-text">
                            {formatPercent(item.popularity)}
                          </p>
                          <p
                            className={`text-xs ${getWinRateColor(item.winRate)}`}
                          >
                            胜率 {formatPercent(item.winRate)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Matchups Tab */}
        <TabsContent value="matchups">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-dota-text">
                克制关系
              </h3>
              <p className="text-sm text-dota-muted">
                基于近期比赛数据，展示{hero.localizedNameZh}面对其他英雄的表现
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Best Against */}
                <div>
                  <h4 className="text-sm font-semibold text-dota-green mb-3 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    优势对局
                  </h4>
                  <div className="space-y-2">
                    {sortedMatchups
                      .filter((m) => m.advantage > 0)
                      .slice(0, 5)
                      .map((m) => (
                        <MatchupRow key={m.heroId} matchup={m} />
                      ))}
                  </div>
                </div>

                {/* Worst Against */}
                <div>
                  <h4 className="text-sm font-semibold text-dota-red mb-3 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4" />
                    劣势对局
                  </h4>
                  <div className="space-y-2">
                    {sortedMatchups
                      .filter((m) => m.advantage < 0)
                      .slice(-5)
                      .reverse()
                      .map((m) => (
                        <MatchupRow key={m.heroId} matchup={m} />
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Abilities Tab */}
        <TabsContent value="abilities">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {abilities.map((ability) => (
              <Card
                key={ability.slot}
                className={
                  ability.isUltimate
                    ? "border-dota-gold/30"
                    : "border-dota-border"
                }
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <img
                        src={ability.imageIcon}
                        alt={ability.localizedNameZh}
                        className="w-12 h-12 rounded border border-dota-border"
                        loading="lazy"
                      />
                      <p className="text-xs text-center text-dota-muted mt-1">
                        {ability.isUltimate ? "R" : ["Q", "W", "E"][ability.slot - 1]}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-dota-text">
                        {ability.localizedNameZh}
                      </p>
                      <p className="text-xs text-dota-muted mt-1">
                        {ability.descriptionZh}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Guide link */}
      <Separator className="my-8" />
      <Card className="bg-dota-blue/5 border-dota-blue/30">
        <CardContent className="py-6 flex flex-col sm:flex-row items-center gap-4">
          <BookOpen className="w-8 h-8 text-dota-accent shrink-0" />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-dota-text">
              查看{hero.localizedNameZh}的完整攻略
            </h3>
            <p className="text-sm text-dota-muted">
              学习出装路线、技能加点和实战技巧
            </p>
          </div>
          <Link href={`/guides?hero=${hero.id}`}>
            <Button variant="dota" className="shrink-0">
              浏览攻略
            </Button>
          </Link>
        </CardContent>
      </Card>
    </Container>
  );
}

function QuickStat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <Card className="text-center">
      <CardContent className="py-3">
        <p className={`text-lg font-bold ${valueClass ?? "text-dota-text"}`}>
          {value}
        </p>
        <p className="text-xs text-dota-muted">{label}</p>
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="text-dota-accent">{icon}</span>}
          <p className="text-xs text-dota-muted">{label}</p>
        </div>
        <p className="text-xl font-bold text-dota-text">{value}</p>
      </CardContent>
    </Card>
  );
}

function MatchupRow({
  matchup,
}: {
  matchup: {
    heroId: number;
    heroName: string;
    heroNameZh: string;
    heroIcon: string;
    winRate: number;
    advantage: number;
    gamesPlayed: number;
  };
}) {
  const advantage =
    Math.abs(matchup.advantage) < 0.005
      ? 0
      : matchup.advantage;

  return (
    <Link
      href={`/heroes/${matchup.heroName}`}
      className="flex items-center justify-between rounded border border-dota-border bg-dota-bg p-2 hover:border-dota-accent transition-colors"
    >
      <div className="flex items-center gap-2">
        <img
          src={matchup.heroIcon}
          alt={matchup.heroNameZh}
          className="w-8 h-8 rounded object-cover"
          loading="lazy"
        />
        <span className="text-sm text-dota-text">{matchup.heroNameZh}</span>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-medium ${
            advantage > 0
              ? "text-dota-green"
              : advantage < 0
              ? "text-dota-red"
              : "text-dota-muted"
          }`}
        >
          {advantage > 0 ? "+" : ""}
          {formatPercent(advantage)}
        </p>
        <p className="text-xs text-dota-muted">
          胜率 {formatPercent(matchup.winRate)}
        </p>
      </div>
    </Link>
  );
}
