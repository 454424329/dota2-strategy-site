import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsSummary } from "@/components/esports/StatsSummary";
import { MatchCard } from "@/components/esports/MatchCard";
import { getProMatches, getTeams, getLeagues } from "@/lib/data";
import { Swords, Users, Calendar } from "lucide-react";

export default async function EsportsHubPage() {
  const matches = await getProMatches();
  const teams = await getTeams();
  const leagues = await getLeagues();

  const now = Math.floor(Date.now() / 1000);
  const upcoming = matches.filter((m) => m.startTime > now).slice(0, 5);
  const recent = matches.filter((m) => m.startTime <= now).slice(0, 5);

  return (
    <Container className="py-8">
      <PageHeader
        title="赛事中心"
        description="职业比赛数据、赛程安排和队伍排名"
      />

      <StatsSummary
        totalMatches={matches.length}
        activeTeams={teams.length}
        upcomingMatches={upcoming.length}
        activeLeagues={leagues.length}
      />

      {/* Quick access */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/esports/matches">
          <Card className="card-hover h-full">
            <CardContent className="py-6 flex flex-col items-center text-center">
              <Swords className="w-8 h-8 text-dota-accent mb-3" />
              <h3 className="font-semibold text-dota-text mb-1">比赛数据</h3>
              <p className="text-xs text-dota-muted">查看所有职业比赛记录</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/esports/teams">
          <Card className="card-hover h-full">
            <CardContent className="py-6 flex flex-col items-center text-center">
              <Users className="w-8 h-8 text-dota-accent mb-3" />
              <h3 className="font-semibold text-dota-text mb-1">战队排名</h3>
              <p className="text-xs text-dota-muted">全球战队实力排行榜</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/esports/schedule">
          <Card className="card-hover h-full">
            <CardContent className="py-6 flex flex-col items-center text-center">
              <Calendar className="w-8 h-8 text-dota-accent mb-3" />
              <h3 className="font-semibold text-dota-text mb-1">赛程安排</h3>
              <p className="text-xs text-dota-muted">即将进行的比赛一览</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent matches */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dota-text">最近比赛</h2>
          <Link href="/esports/matches" className="text-sm text-dota-accent hover:underline">
            查看全部
          </Link>
        </div>
        <div className="space-y-3">
          {recent.map((m) => (
            <MatchCard key={m.matchId} match={m} showDetails />
          ))}
        </div>
      </section>

      {/* Popular leagues */}
      <section>
        <h2 className="text-lg font-semibold text-dota-text mb-4">热门联赛</h2>
        <div className="flex flex-wrap gap-2">
          {leagues.slice(0, 10).map((l) => (
            <a key={l.leagueId} href={`/esports/matches?league=${l.leagueId}`}>
              <Badge
                variant="outline"
                className="cursor-pointer hover:opacity-100 opacity-80 transition-opacity"
              >
                {l.name}
                <span className="ml-1.5 text-dota-muted">({l.tierLabel})</span>
              </Badge>
            </a>
          ))}
        </div>
      </section>
    </Container>
  );
}
