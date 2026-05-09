import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SafeImage } from "@/components/shared/SafeImage";
import { DraftBoard } from "@/components/esports/DraftBoard";
import { getMatchDetail } from "@/lib/data";
import { formatDate, formatMatchDuration, formatMatchTime, getHeroImageUrl, getTeamLogoUrl } from "@/lib/utils";
import { ArrowLeft, Clock, Swords } from "lucide-react";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  const { id } = await params;
  const matchId = Number(id);
  if (isNaN(matchId)) notFound();

  const match = await getMatchDetail(matchId);
  if (!match) notFound();

  const radiantTag = match.radiantTeam.tag || match.radiantTeam.name || "天辉";
  const direTag = match.direTeam.tag || match.direTeam.name || "夜魇";

  const radiantPlayers = match.players?.filter((p) => p.isRadiant) ?? [];
  const direPlayers = match.players?.filter((p) => !p.isRadiant) ?? [];

  return (
    <Container className="py-8">
      <Link
        href="/esports/matches"
        className="inline-flex items-center gap-1 text-sm text-dota-muted hover:text-dota-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回比赛列表
      </Link>

      <article className="max-w-4xl">
        {/* Score header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-6 mb-4">
            {/* Radiant */}
            <div className="flex flex-col items-center gap-2">
              <SafeImage
                src={getTeamLogoUrl(match.radiantTeam.logoUrl, match.radiantTeam.teamId)}
                alt={radiantTag}
                className="w-14 h-14 rounded object-cover"
              />
              <span className={`text-sm font-semibold ${match.radiantWin ? "text-dota-green" : "text-dota-text"}`}>
                {radiantTag}
              </span>
            </div>

            {/* Score */}
            <div className="text-center">
              <div className="text-3xl font-bold text-dota-text tracking-wider">
                {match.radiantScore} - {match.direScore}
              </div>
              <Badge variant={match.radiantWin ? "str" : "agi"} className="mt-1">
                {match.radiantWin ? "天辉胜利" : "夜魇胜利"}
              </Badge>
            </div>

            {/* Dire */}
            <div className="flex flex-col items-center gap-2">
              <SafeImage
                src={getTeamLogoUrl(match.direTeam.logoUrl, match.direTeam.teamId)}
                alt={direTag}
                className="w-14 h-14 rounded object-cover"
              />
              <span className={`text-sm font-semibold ${!match.radiantWin ? "text-dota-green" : "text-dota-text"}`}>
                {direTag}
              </span>
            </div>
          </div>

          {/* Match meta */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-dota-muted">
            <span>{match.league.name}</span>
            <Badge variant="outline" className="text-xs">{match.league.tierLabel}</Badge>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatMatchDuration(match.duration)}
            </span>
            <span>{formatDate(new Date(match.startTime * 1000))}</span>
            <span className="text-xs">{formatMatchTime(match.startTime)}</span>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Draft Board */}
        {match.draftData && match.draftData.length > 0 && (
          <>
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-dota-text mb-4 flex items-center gap-2">
                <Swords className="w-5 h-5 text-dota-accent" />
                Ban/Pick
              </h2>
              <Card>
                <CardContent className="py-6">
                  <DraftBoard draftData={match.draftData} />
                </CardContent>
              </Card>
            </section>
            <Separator className="mb-8" />
          </>
        )}

        {/* Player performance */}
        {match.players && match.players.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-dota-text mb-4">选手数据</h2>

            {/* Radiant players */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-dota-green mb-3">天辉</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dota-border text-left text-xs text-dota-muted">
                      <th className="py-2 px-2">英雄</th>
                      <th className="py-2 px-2">选手</th>
                      <th className="py-2 px-2 text-center">等级</th>
                      <th className="py-2 px-2 text-center">K</th>
                      <th className="py-2 px-2 text-center">D</th>
                      <th className="py-2 px-2 text-center">A</th>
                      <th className="py-2 px-2 text-center">KDA</th>
                      <th className="py-2 px-2 text-center">GPM</th>
                      <th className="py-2 px-2 text-center">XPM</th>
                      <th className="py-2 px-2">装备</th>
                    </tr>
                  </thead>
                  <tbody>
                    {radiantPlayers.map((p) => (
                      <tr key={p.accountId} className="border-b border-dota-border/50 hover:bg-dota-surface/30">
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            <SafeImage
                              src={getHeroImageUrl(p.heroIcon)}
                              alt={p.heroNameZh}
                              className="w-8 h-8 rounded object-cover shrink-0"
                            />
                            <span className="text-xs">{p.heroNameZh}</span>
                          </div>
                        </td>
                        <td className="py-2 px-2 font-medium">{p.name}</td>
                        <td className="py-2 px-2 text-center">{p.level}</td>
                        <td className="py-2 px-2 text-center text-dota-green">{p.kills}</td>
                        <td className="py-2 px-2 text-center text-dota-red">{p.deaths}</td>
                        <td className="py-2 px-2 text-center">{p.assists}</td>
                        <td className="py-2 px-2 text-center font-mono text-xs">
                          {p.deaths > 0 ? ((p.kills + p.assists) / p.deaths).toFixed(1) : "∞"}
                        </td>
                        <td className="py-2 px-2 text-center text-dota-gold">{p.gpm}</td>
                        <td className="py-2 px-2 text-center">{p.xpm}</td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-0.5">
                            {p.items.map((itemId, i) => (
                              <SafeImage
                                key={`${itemId}-${i}`}
                                src={getHeroImageUrl(`item_${itemId}`, "icon")}
                                alt={`item ${itemId}`}
                                className="w-6 h-5 rounded-sm object-cover bg-dota-border/50"
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dire players */}
            <div>
              <h3 className="text-sm font-medium text-dota-red mb-3">夜魇</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dota-border text-left text-xs text-dota-muted">
                      <th className="py-2 px-2">英雄</th>
                      <th className="py-2 px-2">选手</th>
                      <th className="py-2 px-2 text-center">等级</th>
                      <th className="py-2 px-2 text-center">K</th>
                      <th className="py-2 px-2 text-center">D</th>
                      <th className="py-2 px-2 text-center">A</th>
                      <th className="py-2 px-2 text-center">KDA</th>
                      <th className="py-2 px-2 text-center">GPM</th>
                      <th className="py-2 px-2 text-center">XPM</th>
                      <th className="py-2 px-2">装备</th>
                    </tr>
                  </thead>
                  <tbody>
                    {direPlayers.map((p) => (
                      <tr key={p.accountId} className="border-b border-dota-border/50 hover:bg-dota-surface/30">
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            <SafeImage
                              src={getHeroImageUrl(p.heroIcon)}
                              alt={p.heroNameZh}
                              className="w-8 h-8 rounded object-cover shrink-0"
                            />
                            <span className="text-xs">{p.heroNameZh}</span>
                          </div>
                        </td>
                        <td className="py-2 px-2 font-medium">{p.name}</td>
                        <td className="py-2 px-2 text-center">{p.level}</td>
                        <td className="py-2 px-2 text-center text-dota-green">{p.kills}</td>
                        <td className="py-2 px-2 text-center text-dota-red">{p.deaths}</td>
                        <td className="py-2 px-2 text-center">{p.assists}</td>
                        <td className="py-2 px-2 text-center font-mono text-xs">
                          {p.deaths > 0 ? ((p.kills + p.assists) / p.deaths).toFixed(1) : "∞"}
                        </td>
                        <td className="py-2 px-2 text-center text-dota-gold">{p.gpm}</td>
                        <td className="py-2 px-2 text-center">{p.xpm}</td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-0.5">
                            {p.items.map((itemId, i) => (
                              <SafeImage
                                key={`${itemId}-${i}`}
                                src={getHeroImageUrl(`item_${itemId}`, "icon")}
                                alt={`item ${itemId}`}
                                className="w-6 h-5 rounded-sm object-cover bg-dota-border/50"
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </article>
    </Container>
  );
}
