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

interface OpenDotaProMatch {
  match_id: number;
  start_time: number;
  duration: number;
  radiant_team: { team_id: number; name: string; tag: string };
  dire_team: { team_id: number; name: string; tag: string };
  radiant_score: number;
  dire_score: number;
  league: { leagueid: number; name: string; tier: string };
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

export type {
  OpenDotaHero,
  OpenDotaHeroStat,
  OpenDotaMatchup,
  OpenDotaProMatch,
  OpenDotaTeam,
};
