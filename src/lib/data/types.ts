import type {
  HeroData,
  HeroMetaData,
  HeroMatchupData,
  ItemBuildData,
  ItemData,
  GuideData,
  NewsArticle,
} from "@/types/dota";

export type DataSource = "api" | "mock" | "db";

export interface DataLayerConfig {
  heroesSource: DataSource;
  itemsSource: DataSource;
  metaSource: DataSource;
  matchupsSource: DataSource;
  guidesSource: DataSource;
  newsSource: DataSource;
}

export const DEFAULT_CONFIG: DataLayerConfig = {
  heroesSource: "api",
  itemsSource: "api",
  metaSource: "api",
  matchupsSource: "api",
  guidesSource: "mock",
  newsSource: "mock",
};

export interface HeroDataResult {
  heroes: HeroData[];
  meta?: HeroMetaData[];
  source: DataSource;
}

export interface HeroDetailResult {
  hero: HeroData;
  meta: HeroMetaData;
  matchups: HeroMatchupData[];
  itemBuilds: ItemBuildData[];
}
