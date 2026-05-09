import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/shared/SafeImage";
import type { ProMatchData } from "@/types/dota";
import { formatMatchDuration, formatMatchTime, getTeamLogoUrl } from "@/lib/utils";
import { Swords } from "lucide-react";

interface MatchCardProps {
  match: ProMatchData;
  showDetails?: boolean;
  compact?: boolean;
}

export function MatchCard({ match, showDetails, compact }: MatchCardProps) {
  const radiantWon = match.radiantWin;
  const radiantTag = match.radiantTeam.tag || match.radiantTeam.name || "天辉";
  const direTag = match.direTeam.tag || match.direTeam.name || "夜魇";
  const radiantLogo = getTeamLogoUrl(match.radiantTeam.logoUrl, match.radiantTeam.teamId);
  const direLogo = getTeamLogoUrl(match.direTeam.logoUrl, match.direTeam.teamId);

  const inner = (
    <Card className={compact ? "" : "card-hover"}>
      <CardContent className={compact ? "py-3" : "py-4"}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <SafeImage
                  src={radiantLogo}
                  alt={radiantTag}
                  className="w-5 h-5 rounded-sm object-cover shrink-0"
                />
                <span className={`text-sm font-semibold truncate ${radiantWon ? "text-dota-green" : "text-dota-text"}`}>
                  {radiantTag}
                </span>
              </div>
              <span className="text-sm font-bold text-dota-gold shrink-0">
                {match.radiantScore} - {match.direScore}
              </span>
              <span className={`text-sm font-semibold truncate ${!radiantWon ? "text-dota-green" : "text-dota-text"}`}>
                {direTag}
              </span>
              <SafeImage
                src={direLogo}
                alt={direTag}
                className="w-5 h-5 rounded-sm object-cover shrink-0"
              />
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
              <span>{formatMatchTime(match.startTime)}</span>
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

  if (showDetails) {
    return (
      <Link href={`/esports/matches/${match.matchId}`}>
        {inner}
      </Link>
    );
  }

  return inner;
}
