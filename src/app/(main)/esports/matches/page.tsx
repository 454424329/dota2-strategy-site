import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { MatchCard } from "@/components/esports/MatchCard";
import { MatchFilters } from "@/components/esports/MatchFilters";
import { getProMatches, getLeagues } from "@/lib/data";
import { Swords } from "lucide-react";

export const metadata: Metadata = {
  title: "比赛数据",
  description: "DOTA2职业比赛记录与数据统计",
};

interface MatchesPageProps {
  searchParams: Promise<{ league?: string; tier?: string }>;
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const sp = await searchParams;
  const matches = await getProMatches();
  const leagues = await getLeagues();

  const leagueFilter = sp.league ?? "";
  const tierFilter = sp.tier ?? "";

  let filtered = matches;

  if (leagueFilter) {
    filtered = filtered.filter((m) => m.league.leagueId === Number(leagueFilter));
  }

  if (tierFilter) {
    filtered = filtered.filter((m) => m.league.tier === tierFilter);
  }

  return (
    <Container className="py-8">
      <PageHeader title="比赛数据" description="职业比赛记录与数据统计" />

      <MatchFilters
        currentLeague={leagueFilter}
        currentTier={tierFilter}
        leagues={leagues}
      />

      {filtered.length > 0 ? (
        <>
          <p className="text-xs text-dota-muted mb-4">
            共 {filtered.length} 场比赛
            {leagueFilter ? ` — 联赛筛选` : ""}
            {tierFilter ? ` — ${tierFilter}` : ""}
          </p>
          <div className="space-y-3">
            {filtered.map((m) => (
              <MatchCard key={m.matchId} match={m} showDetails />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Swords className="w-12 h-12 text-dota-border mx-auto mb-4" />
          <p className="text-dota-muted">没有匹配的比赛记录</p>
        </div>
      )}
    </Container>
  );
}
