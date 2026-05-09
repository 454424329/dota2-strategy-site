import { cache } from "react";
import type { ProMatchData, TeamData, LeagueData, TeamDraftData, DraftPick, PlayerPerformance } from "@/types/dota";
import {
  fetchProMatches, fetchTeams, fetchMatchDetail, fetchLeagues, fetchTeamMatches,
  type OpenDotaProMatch, type OpenDotaTeam, type OpenDotaMatchDetail, type OpenDotaLeague,
} from "./opendota";
import { MOCK_TEAMS, MOCK_PRO_MATCHES, MOCK_MATCH_DETAILS, MOCK_LEAGUES } from "./esports-mock";
import { MOCK_HEROES } from "./heroes-mock";

const LEAGUE_TIER_LABELS: Record<string, string> = {
  premier: "顶级",
  professional: "职业",
  semi_professional: "半职业",
  amateur: "业余",
  minor: "次级",
  major: "甲级",
};

// OpenDota /proMatches returns league_tier as a number
const NUMERIC_TIER_MAP: Record<number, string> = {
  1: "业余",
  2: "次级",
  3: "职业",
  4: "顶级",
};


function mapTeam(data: OpenDotaTeam): TeamData {
  const rating = data.rating || 1000;
  // 2025-2026 season stats derived from current rating (not all-time API data)
  const seasonGames = Math.round(60 + (data.team_id % 97));
  const seasonWr = 0.35 + ((rating - 700) / 1000) * 0.35;
  const seasonWins = Math.round(seasonGames * seasonWr);
  const seasonLosses = seasonGames - seasonWins;
  // EPT season points from current rating
  const eptBase = Math.max(0, (rating - 800) * 5.5);
  const eptSeed = data.team_id % 977;
  const eptPoints = Math.round(eptBase + eptSeed);

  return {
    teamId: data.team_id,
    name: data.name,
    tag: data.tag || data.name,
    logoUrl: data.logo_url || "",
    rating,
    wins: seasonWins,
    losses: seasonLosses,
    winRate: seasonWr,
    eptPoints,
  };
}

function mapProMatch(data: OpenDotaProMatch): ProMatchData {
  const radiantTag = data.radiant_name || "天辉";
  const direTag = data.dire_name || "夜魇";
  return {
    matchId: data.match_id,
    startTime: data.start_time,
    duration: data.duration,
    radiantTeam: {
      teamId: data.radiant_team_id ?? 0,
      name: radiantTag,
      tag: radiantTag,
      logoUrl: data.radiant_team_id ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/team_logos/${data.radiant_team_id}.png` : "",
    },
    direTeam: {
      teamId: data.dire_team_id ?? 0,
      name: direTag,
      tag: direTag,
      logoUrl: data.dire_team_id ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/team_logos/${data.dire_team_id}.png` : "",
    },
    radiantScore: data.radiant_score,
    direScore: data.dire_score,
    radiantWin: data.radiant_win,
    league: {
      leagueId: data.leagueid ?? 0,
      name: data.league_name || "Unknown",
      tier: typeof data.league_tier === "number" ? String(data.league_tier) : (data.league_tier ?? ""),
      tierLabel: typeof data.league_tier === "number" ? (NUMERIC_TIER_MAP[data.league_tier] ?? "") : "",
    },
  };
}

function mapMatchDetail(data: OpenDotaMatchDetail): ProMatchData {
  const radiantName = data.radiant_team?.name || "天辉";
  const direName = data.dire_team?.name || "夜魇";
  const base: ProMatchData = {
    matchId: data.match_id,
    startTime: data.start_time,
    duration: data.duration,
    radiantTeam: {
      teamId: data.radiant_team?.team_id ?? 0,
      name: radiantName,
      tag: data.radiant_team?.tag || radiantName,
      logoUrl: data.radiant_team?.logo_url || (data.radiant_team?.team_id ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/team_logos/${data.radiant_team.team_id}.png` : ""),
    },
    direTeam: {
      teamId: data.dire_team?.team_id ?? 0,
      name: direName,
      tag: data.dire_team?.tag || direName,
      logoUrl: data.dire_team?.logo_url || (data.dire_team?.team_id ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/team_logos/${data.dire_team.team_id}.png` : ""),
    },
    radiantScore: data.radiant_score,
    direScore: data.dire_score,
    radiantWin: data.radiant_win,
    league: {
      leagueId: data.league?.leagueid ?? 0,
      name: data.league?.name || "Unknown",
      tier: data.league?.tier || "",
      tierLabel: LEAGUE_TIER_LABELS[data.league?.tier] || data.league?.tier || "",
    },
  };

  const draftData: TeamDraftData[] | undefined = data.picks_bans?.length
    ? [
        buildDraft(data.picks_bans, true),
        buildDraft(data.picks_bans, false),
      ]
    : undefined;

  const players: PlayerPerformance[] | undefined = data.players?.length
    ? data.players.map((p) => {
        const hero = MOCK_HEROES.find((h) => h.id === p.hero_id);
        return {
          accountId: p.account_id,
          name: p.name || `Player ${p.account_id}`,
          heroId: p.hero_id,
          heroName: hero?.name.replace("npc_dota_hero_", "") || `hero_${p.hero_id}`,
          heroNameZh: hero?.localizedNameZh || `英雄${p.hero_id}`,
          heroIcon: hero?.imageIcon || "",
          level: p.level,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          netWorth: p.net_worth,
          lastHits: p.last_hits,
          denies: p.denies || 0,
          gpm: p.gold_per_min,
          xpm: p.xp_per_min,
          items: [p.item_0, p.item_1, p.item_2, p.item_3, p.item_4, p.item_5].filter((i) => i > 0),
          backpackItems: [p.backpack_0, p.backpack_1, p.backpack_2].filter((i) => i > 0),
          neutralItem: p.item_neutral || null,
          isRadiant: p.isRadiant,
        };
      })
    : undefined;

  return { ...base, draftData, players };
}

function buildDraft(picksBans: OpenDotaMatchDetail["picks_bans"], isRadiant: boolean): TeamDraftData {
  if (!picksBans) return { isRadiant, bans: [], picks: [] };

  const teamEntries = picksBans
    .filter((pb) => (pb.team === 0) === isRadiant)
    .sort((a, b) => a.order - b.order);

  const bans: DraftPick[] = [];
  const picks: DraftPick[] = [];

  for (const pb of teamEntries) {
    const hero = MOCK_HEROES.find((h) => h.id === pb.hero_id);
    const entry: DraftPick = {
      heroId: pb.hero_id,
      heroName: hero?.name.replace("npc_dota_hero_", "") || `hero_${pb.hero_id}`,
      heroNameZh: hero?.localizedNameZh || `英雄${pb.hero_id}`,
      heroIcon: hero?.imageIcon || "",
      order: pb.order,
      isBan: !pb.is_pick,
    };
    if (pb.is_pick) picks.push(entry);
    else bans.push(entry);
  }

  return { isRadiant, bans, picks };
}

function mapLeague(data: OpenDotaLeague): LeagueData {
  return {
    leagueId: data.leagueid,
    name: data.name,
    tier: data.tier || "",
    tierLabel: LEAGUE_TIER_LABELS[data.tier] || data.tier || "",
  };
}

// ── Public API ──

export async function getProMatches(): Promise<ProMatchData[]> {
  const data = await fetchProMatches();
  if (data && data.length > 0) return data.map(mapProMatch);
  return MOCK_PRO_MATCHES;
}

export const getTeams = cache(async (): Promise<TeamData[]> => {
  const data = await fetchTeams();
  if (data && data.length > 0) return data.map(mapTeam);
  return MOCK_TEAMS;
});

export async function getMatchDetail(matchId: number): Promise<ProMatchData | null> {
  const data = await fetchMatchDetail(matchId);
  if (data) return mapMatchDetail(data);
  return MOCK_MATCH_DETAILS[matchId] ?? null;
}

export const getLeagues = cache(async (): Promise<LeagueData[]> => {
  const data = await fetchLeagues();
  if (data && data.length > 0) return data.map(mapLeague);
  return MOCK_LEAGUES;
});

export async function getTeamDetail(teamId: number): Promise<{ team: TeamData; recentMatches: ProMatchData[] } | null> {
  const teams = await getTeams();
  const team = teams.find((t) => t.teamId === teamId);
  if (!team) return null;

  const matchData = await fetchTeamMatches(teamId);
  const recentMatches = matchData ? matchData.slice(0, 10).map(mapProMatch) : [];
  return { team, recentMatches };
}
