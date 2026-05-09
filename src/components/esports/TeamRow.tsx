import { SafeImage } from "@/components/shared/SafeImage";
import type { TeamData } from "@/types/dota";
import { getTeamLogoUrl, formatPercent } from "@/lib/utils";

interface TeamRowProps {
  team: TeamData;
  rank: number;
}

export function TeamRow({ team, rank }: TeamRowProps) {
  const logoUrl = getTeamLogoUrl(team.logoUrl, team.teamId);

  return (
    <tr className="border-b border-dota-border hover:bg-dota-surface/50 transition-colors">
      <td className="py-3 px-2 text-center text-sm text-dota-muted font-mono">
        {rank}
      </td>
      <td className="py-3 px-2">
        <div className="flex items-center gap-3">
          <SafeImage
            src={logoUrl}
            alt={team.name}
            className="w-8 h-8 rounded-sm object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-dota-text truncate">{team.name}</p>
            <p className="text-xs text-dota-muted">{team.tag}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-2 text-center">
        <span className="text-sm font-bold text-dota-gold font-mono">
          {team.eptPoints.toLocaleString()}
        </span>
      </td>
      <td className="py-3 px-2 text-center">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-dota-border rounded-full overflow-hidden max-w-[80px] mx-auto">
            <div
              className="h-full bg-dota-accent rounded-full"
              style={{ width: `${Math.min((team.rating - 700) / 800 * 100, 100)}%` }}
            />
          </div>
          <span className="text-sm font-mono text-dota-text w-12 text-right">
            {team.rating}
          </span>
        </div>
      </td>
      <td className="py-3 px-2 text-center text-sm text-dota-green font-mono">
        {team.wins}
      </td>
      <td className="py-3 px-2 text-center text-sm text-dota-red font-mono">
        {team.losses}
      </td>
      <td className="py-3 px-2 text-center">
        <span className={`text-sm font-semibold ${team.winRate >= 0.55 ? "text-dota-green" : team.winRate >= 0.45 ? "text-dota-gold" : "text-dota-red"}`}>
          {formatPercent(team.winRate)}
        </span>
      </td>
    </tr>
  );
}
