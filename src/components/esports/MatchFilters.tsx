"use client";

import { Badge } from "@/components/ui/badge";
import type { LeagueData } from "@/types/dota";

interface MatchFiltersProps {
  currentLeague: string;
  currentTier: string;
  leagues: LeagueData[];
}

const tiers: { value: string; label: string }[] = [
  { value: "", label: "全部级别" },
  { value: "premier", label: "顶级" },
  { value: "professional", label: "职业" },
  { value: "semi_professional", label: "半职业" },
  { value: "minor", label: "次级" },
  { value: "amateur", label: "业余" },
];

export function MatchFilters({ currentLeague, currentTier, leagues }: MatchFiltersProps) {
  function buildUrl(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    const qs = p.toString();
    return `/esports/matches${qs ? `?${qs}` : ""}`;
  }

  // Show top leagues as pills
  const topLeagues = leagues.slice(0, 8);

  return (
    <div className="space-y-4 mb-8">
      {/* Tier filters */}
      <div className="flex flex-wrap gap-2">
        {tiers.map((t) => {
          const href = buildUrl({
            league: currentLeague || undefined,
            tier: t.value || undefined,
          });
          return (
            <a key={t.value} href={href}>
              <Badge
                variant="default"
                className={`cursor-pointer transition-opacity ${
                  currentTier === t.value ? "opacity-100 ring-1 ring-dota-accent" : "opacity-60 hover:opacity-100"
                }`}
              >
                {t.label}
              </Badge>
            </a>
          );
        })}
      </div>

      {/* League filters */}
      {topLeagues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <a href={buildUrl({ tier: currentTier || undefined })}>
            <Badge
              variant="outline"
              className={`cursor-pointer transition-opacity ${
                !currentLeague ? "opacity-100 ring-1 ring-dota-accent" : "opacity-60 hover:opacity-100"
              }`}
            >
              全部联赛
            </Badge>
          </a>
          {topLeagues.map((l) => {
            const href = buildUrl({
              league: l.leagueId.toString(),
              tier: currentTier || undefined,
            });
            return (
              <a key={l.leagueId} href={href}>
                <Badge
                  variant="outline"
                  className={`cursor-pointer transition-opacity ${
                    currentLeague === l.leagueId.toString() ? "opacity-100 ring-1 ring-dota-accent" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {l.name}
                </Badge>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
