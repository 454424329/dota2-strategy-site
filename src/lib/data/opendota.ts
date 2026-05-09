const OPENDOTA_BASE = "https://api.opendota.com/api";

// OpenDota response types
interface OpenDotaHero {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  legs: number;
}

interface OpenDotaHeroStat {
  hero_id: number;
  pick_rate: number;
  ban_rate: number;
  win_rate: number;
  total_matches: number;
  avg_kills: number;
  avg_deaths: number;
  avg_assists: number;
  avg_gold_per_min: number;
  avg_xp_per_min: number;
  avg_last_hits: number;
  avg_duration: number;
  pro_pick: number;
  pro_ban: number;
  pro_win: number;
  turbo_pick: number;
  turbo_win: number;
}

interface OpenDotaMatchup {
  hero_id: number;
  games_played: number;
  wins: number;
}

// /proMatches uses flat fields (not nested objects)
interface OpenDotaProMatch {
  match_id: number;
  start_time: number;
  duration: number;
  radiant_team_id?: number;
  radiant_name?: string;
  dire_team_id?: number;
  dire_name?: string;
  radiant_score: number;
  dire_score: number;
  leagueid?: number;
  league_name?: string;
  league_tier?: number;
  radiant_win: boolean;
}

interface OpenDotaTeam {
  team_id: number;
  name: string;
  tag: string;
  logo_url: string;
  rating: number;
  wins: number;
  losses: number;
}

type RevalidateOption = number | false;

const FETCH_TIMEOUT = 3000;

async function fetchOpenDota<T>(
  path: string,
  revalidate: RevalidateOption = 3600,
): Promise<T | null> {
  const url = `${OPENDOTA_BASE}${path}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    const res = await fetch(url, {
      next: typeof revalidate === "number" ? { revalidate } : undefined,
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 429) {
        console.warn(`[OpenDota] Rate limited: ${path}`);
      }
      return null;
    }

    return res.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.warn(`[OpenDota] Timeout after ${FETCH_TIMEOUT}ms: ${path}`);
    } else {
      console.error(`[OpenDota] Fetch failed: ${path}`, err);
    }
    return null;
  }
}

export async function fetchHeroes(): Promise<OpenDotaHero[] | null> {
  return fetchOpenDota<OpenDotaHero[]>("/heroes");
}

export async function fetchHeroStats(): Promise<OpenDotaHeroStat[] | null> {
  return fetchOpenDota<OpenDotaHeroStat[]>("/heroStats");
}

export async function fetchHeroMatchups(
  heroId: number,
): Promise<OpenDotaMatchup[] | null> {
  return fetchOpenDota<OpenDotaMatchup[]>(`/heroes/${heroId}/matchups`);
}

export async function fetchItems(): Promise<Record<string, { id: number; name: string; cost: number; recipe: number }> | null> {
  return fetchOpenDota("/constants/items");
}

export async function fetchProMatches(): Promise<OpenDotaProMatch[] | null> {
  return fetchOpenDota<OpenDotaProMatch[]>("/proMatches");
}

export async function fetchTeams(): Promise<OpenDotaTeam[] | null> {
  return fetchOpenDota<OpenDotaTeam[]>("/teams");
}

// ── Esports detail types ──

interface OpenDotaMatchDetail {
  match_id: number;
  start_time: number;
  duration: number;
  radiant_team: { team_id: number; name: string; tag: string; logo_url?: string };
  dire_team: { team_id: number; name: string; tag: string; logo_url?: string };
  radiant_score: number;
  dire_score: number;
  radiant_win: boolean;
  league: { leagueid: number; name: string; tier: string };
  picks_bans: Array<{
    is_pick: boolean;
    hero_id: number;
    team: number;
    order: number;
  }> | null;
  players: Array<{
    account_id: number;
    name?: string;
    hero_id: number;
    level: number;
    kills: number;
    deaths: number;
    assists: number;
    net_worth: number;
    last_hits: number;
    denies: number;
    gold_per_min: number;
    xp_per_min: number;
    item_0: number;
    item_1: number;
    item_2: number;
    item_3: number;
    item_4: number;
    item_5: number;
    backpack_0: number;
    backpack_1: number;
    backpack_2: number;
    item_neutral: number;
    isRadiant: boolean;
  }> | null;
}

interface OpenDotaLeague {
  leagueid: number;
  name: string;
  ticket?: string;
  banner?: string;
  tier: string;
}

interface OpenDotaTeamMember {
  account_id: number;
  name: string;
  avatar?: string;
  country_code?: string;
  fantasy_role?: number;
  is_current_team_member: boolean;
}

// ── Esports API functions ──

export async function fetchMatchDetail(matchId: number): Promise<OpenDotaMatchDetail | null> {
  return fetchOpenDota<OpenDotaMatchDetail>(`/matches/${matchId}`);
}

export async function fetchLeagues(): Promise<OpenDotaLeague[] | null> {
  return fetchOpenDota<OpenDotaLeague[]>("/leagues");
}

export async function fetchTeamMatches(teamId: number): Promise<OpenDotaProMatch[] | null> {
  return fetchOpenDota<OpenDotaProMatch[]>(`/teams/${teamId}/matches`);
}

export async function fetchTeamPlayers(teamId: number): Promise<OpenDotaTeamMember[] | null> {
  return fetchOpenDota<OpenDotaTeamMember[]>(`/teams/${teamId}/players`);
}

export async function fetchLiveMatches(): Promise<OpenDotaProMatch[] | null> {
  return fetchOpenDota<OpenDotaProMatch[]>("/live");
}

export type {
  OpenDotaHero,
  OpenDotaHeroStat,
  OpenDotaMatchup,
  OpenDotaProMatch,
  OpenDotaTeam,
  OpenDotaMatchDetail,
  OpenDotaLeague,
  OpenDotaTeamMember,
};
