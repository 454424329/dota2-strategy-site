import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchProMatches, type OpenDotaProMatch } from "@/lib/data/opendota";
import { Trophy, Swords } from "lucide-react";

export const metadata: Metadata = {
  title: "赛事中心",
  description: "DOTA2职业比赛数据、赛程安排和队伍排名。",
};

function formatMatchDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatMatchTime(unixTime: number): string {
  const d = new Date(unixTime * 1000);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return "刚刚结束";
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export default async function EsportsPage() {
  const matches = await fetchProMatches();

  return (
    <Container className="py-8">
      <PageHeader
        title="赛事中心"
        description="职业比赛数据、赛程安排和队伍排名"
      />

      {matches && matches.length > 0 ? (
        <div className="space-y-3">
          {matches.slice(0, 30).map((match) => (
            <MatchCard key={match.match_id} match={match} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Trophy className="w-16 h-16 text-dota-border mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-dota-text mb-2">
              赛事中心即将上线
            </h2>
            <p className="text-sm text-dota-muted max-w-md mx-auto">
              我们将接入职业比赛数据，提供实时比赛信息、赛程安排和队伍排名。敬请期待！
            </p>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

function MatchCard({ match }: { match: OpenDotaProMatch }) {
  const radiantWon = match.radiant_win;
  const radiantTag = match.radiant_team?.tag || match.radiant_team?.name || "天辉";
  const direTag = match.dire_team?.tag || match.dire_team?.name || "夜魇";

  return (
    <Card className="card-hover">
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Teams and score */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <Swords className="w-4 h-4 text-dota-accent shrink-0" />
                <span className={`text-sm font-semibold truncate ${radiantWon ? "text-dota-green" : "text-dota-text"}`}>
                  {radiantTag}
                </span>
              </div>
              <span className="text-sm font-bold text-dota-gold shrink-0">
                {match.radiant_score} - {match.dire_score}
              </span>
              <span className={`text-sm font-semibold truncate ${!radiantWon ? "text-dota-green" : "text-dota-text"}`}>
                {direTag}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-dota-muted">
              {match.league && (
                <>
                  <span>{match.league.name}</span>
                  <span>·</span>
                </>
              )}
              <span>{formatMatchDuration(match.duration)}</span>
              <span>·</span>
              <span>{formatMatchTime(match.start_time)}</span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <Badge variant={radiantWon ? "str" : "agi"}>
              {radiantWon ? "天辉胜" : "夜魇胜"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
