import { cache } from "react";
import type { HeroData, HeroMetaData, HeroMatchupData, ItemBuildPath } from "@/types/dota";
import type { DataSource } from "./types";
import {
  fetchHeroes,
  fetchHeroStats,
  fetchHeroMatchups,
  type OpenDotaHeroStat,
  type OpenDotaMatchup,
} from "./opendota";
import { MOCK_HEROES } from "./heroes-mock";
import {
  generateMockMeta,
  generateMockMatchups,
  generateMockItemBuilds,
} from "@/lib/mock-data";
import { getHeroImageUrl } from "@/lib/utils";

function mapHeroStat(stat: OpenDotaHeroStat): HeroMetaData {
  return {
    pickRate: (stat.pick_rate ?? 0) / 100,
    banRate: (stat.ban_rate ?? 0) / 100,
    winRate: (stat.win_rate ?? 0) / 100,
    totalMatches: stat.total_matches ?? 0,
    avgKills: stat.avg_kills ?? undefined,
    avgDeaths: stat.avg_deaths ?? undefined,
    avgAssists: stat.avg_assists ?? undefined,
    avgGPM: stat.avg_gold_per_min ?? undefined,
    avgXPM: stat.avg_xp_per_min ?? undefined,
    avgLastHits: stat.avg_last_hits ?? undefined,
    avgDuration: stat.avg_duration ?? undefined,
    tierRank: undefined,
    rankBracket: "all",
  };
}

function mapMatchup(m: OpenDotaMatchup, allHeroes: HeroData[]): HeroMatchupData | null {
  const opponent = allHeroes.find((h) => h.id === m.hero_id);
  if (!opponent) return null;

  const winRate = m.games_played > 0 ? m.wins / m.games_played : 0;
  return {
    heroId: opponent.id,
    heroName: opponent.name,
    heroNameZh: opponent.localizedNameZh,
    heroIcon: getHeroImageUrl(opponent.imageIcon),
    gamesPlayed: m.games_played,
    winRate,
    advantage: winRate - 0.5,
  };
}

export async function getAllHeroes(
  metaSource: DataSource = "api",
): Promise<{ heroes: HeroData[]; metaMap: Map<number, HeroMetaData> }> {
  const heroes = MOCK_HEROES;
  const metaMap = new Map<number, HeroMetaData>();

  if (metaSource === "api") {
    const stats = await fetchHeroStats();
    if (stats) {
      const statMap = new Map(stats.map((s) => [s.hero_id, s]));
      for (const hero of heroes) {
        const stat = statMap.get(hero.id);
        if (stat) {
          metaMap.set(hero.id, mapHeroStat(stat));
        }
      }
    }
  }

  // Fallback to mock for any missing heroes
  if (metaMap.size === 0) {
    for (const hero of heroes) {
      metaMap.set(hero.id, generateMockMeta(hero));
    }
  }

  return { heroes, metaMap };
}

export const getAllHeroesWithMeta = cache(async (metaSource: DataSource = "api") => {
  const { heroes, metaMap } = await getAllHeroes(metaSource);
  return heroes.map((hero) => ({
    ...hero,
    meta: metaMap.get(hero.id) ?? generateMockMeta(hero),
  }));
});

export async function getHeroByName(
  heroName: string,
  metaSource: DataSource = "api",
  matchupsSource: DataSource = "api",
): Promise<{
  hero: HeroData;
  meta: HeroMetaData;
  matchups: HeroMatchupData[];
  buildPaths: ItemBuildPath[];
} | null> {
  const hero = MOCK_HEROES.find(
    (h) => h.name === heroName || h.name === `npc_dota_hero_${heroName}`,
  );
  if (!hero) return null;

  let meta: HeroMetaData;
  if (metaSource === "api") {
    const stats = await fetchHeroStats();
    const stat = stats?.find((s) => s.hero_id === hero.id);
    meta = stat ? mapHeroStat(stat) : generateMockMeta(hero);
  } else {
    meta = generateMockMeta(hero);
  }

  let matchups: HeroMatchupData[];
  if (matchupsSource === "api") {
    const data = await fetchHeroMatchups(hero.id);
    if (data) {
      matchups = data
        .map((m) => mapMatchup(m, MOCK_HEROES))
        .filter(Boolean) as HeroMatchupData[];
    } else {
      matchups = generateMockMatchups(hero.id);
    }
  } else {
    matchups = generateMockMatchups(hero.id);
  }

  const buildPaths = generateMockItemBuilds(hero.id, hero.roles);

  return { hero, meta, matchups, buildPaths };
}
