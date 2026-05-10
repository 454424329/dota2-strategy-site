export interface HeroData {
  id: number;
  name: string;
  localizedNameZh: string;
  localizedNameEn: string;
  primaryAttribute: "str" | "agi" | "int" | "uni";
  attackType: "Melee" | "Ranged";
  roles: string[];
  imageIcon: string;
  imagePortrait: string;
  versionIntroduced: number | null;
  isActive: boolean;
  // Optional meta data
  meta?: HeroMetaData;
  matchups?: HeroMatchupData[];
  itemBuilds?: ItemBuildData[];
  buildPaths?: ItemBuildPath[];
}

export interface HeroMetaData {
  pickRate: number;
  banRate: number;
  winRate: number;
  totalMatches: number;
  avgKills?: number;
  avgDeaths?: number;
  avgAssists?: number;
  avgGPM?: number;
  avgXPM?: number;
  avgLastHits?: number;
  avgDuration?: number;
  tierRank?: number;
  rankBracket: string;
}

export interface HeroMatchupData {
  heroId: number;
  heroName: string;
  heroNameZh: string;
  heroIcon: string;
  gamesPlayed: number;
  winRate: number;
  advantage: number;
}

export interface ItemBuildData {
  itemId: number;
  itemName: string;
  itemNameZh: string;
  itemIcon: string;
  cost: number;
  gamePhase: "starting" | "early" | "mid" | "late";
  popularity: number;
  winRate: number;
  avgTiming?: number;
}

export interface ItemBuildPath {
  id: string;
  nameZh: string;
  description: string;
  playstyle: string;
  phaseGroups: ItemBuildPhaseGroup[];
}

export interface ItemBuildPhaseGroup {
  gamePhase: "starting" | "early" | "mid" | "late";
  label: string;
  items: ItemBuildData[];
}

export interface ItemData {
  id: number;
  name: string;
  localizedNameZh: string;
  localizedNameEn: string;
  cost: number;
  isRecipe: boolean;
  isSecretShop: boolean;
  components: number[];
  imageIcon: string;
  descriptionZh: string;
  tier: number | null;
  isActive: boolean;
}

export interface AbilityData {
  id: number;
  heroId: number;
  name: string;
  localizedNameZh: string;
  localizedNameEn: string;
  descriptionZh: string;
  slot: number;
  isUltimate: boolean;
  imageIcon: string;
}

export interface GuideData {
  id: string;
  heroId: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  role: string | null;
  difficulty: string | null;
  laningItems: number[];
  coreItems: number[];
  situationalItems: number[];
  skillBuild: SkillBuildEntry[] | null;
  talentChoices: TalentChoices | null;
  viewCount: number;
  likeCount: number;
  status: string;
  versionTag: string | null;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  hero: {
    id: number;
    name: string;
    localizedNameZh: string;
    imageIcon: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SkillBuildEntry {
  level: number;
  abilityId: number;
}

export interface TalentChoices {
  level10: "left" | "right";
  level15: "left" | "right";
  level20: "left" | "right";
  level25: "left" | "right";
}

export interface NewsArticle {
  id: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  content: string;
  imageUrl: string | null;
  category: string;
  tags: string[];
  publishedAt: string;
  slug: string;
  isFeatured: boolean;
  viewCount: number;
}

export type AttributeType = "str" | "agi" | "int" | "uni";

export const ATTRIBUTE_NAMES: Record<AttributeType, string> = {
  str: "力量",
  agi: "敏捷",
  int: "智力",
  uni: "全才",
};

export const ATTRIBUTE_COLORS: Record<AttributeType, string> = {
  str: "text-str",
  agi: "text-agi",
  int: "text-int",
  uni: "text-uni",
};

export const ATTRIBUTE_BG: Record<AttributeType, string> = {
  str: "bg-str",
  agi: "bg-agi",
  int: "bg-int",
  uni: "bg-uni",
};

export const ROLE_NAMES: Record<string, string> = {
  Carry: "核心",
  Support: "辅助",
  Nuker: "爆发",
  Disabler: "控制",
  Jungler: "打野",
  Durable: "肉盾",
  Escape: "逃生",
  Pusher: "推进",
  Initiator: "先手",
};

export const DIFFICULTY_NAMES: Record<string, string> = {
  beginner: "新手",
  intermediate: "进阶",
  advanced: "高手",
};

// ── Esports types ──

export interface ProMatchData {
  matchId: number;
  startTime: number;
  duration: number;
  radiantTeam: { teamId: number; name: string; tag: string; logoUrl?: string };
  direTeam: { teamId: number; name: string; tag: string; logoUrl?: string };
  radiantScore: number;
  direScore: number;
  radiantWin: boolean;
  league: { leagueId: number; name: string; tier: string; tierLabel: string };
  draftData?: TeamDraftData[];
  players?: PlayerPerformance[];
  goldAdv?: number[];
  xpAdv?: number[];
}

export interface TeamDraftData {
  isRadiant: boolean;
  bans: DraftPick[];
  picks: DraftPick[];
}

export interface DraftPick {
  heroId: number;
  heroName: string;
  heroNameZh: string;
  heroIcon: string;
  order: number;
  isBan: boolean;
}

export interface TeamData {
  teamId: number;
  name: string;
  tag: string;
  logoUrl: string;
  rating: number;
  wins: number;
  losses: number;
  winRate: number;
  eptPoints: number;
  eptRank?: number;
}

export interface LeagueData {
  leagueId: number;
  name: string;
  tier: string;
  tierLabel: string;
}

export interface PlayerPerformance {
  accountId: number;
  name: string;
  heroId: number;
  heroName: string;
  heroNameZh: string;
  heroIcon: string;
  level: number;
  kills: number;
  deaths: number;
  assists: number;
  netWorth: number;
  lastHits: number;
  denies: number;
  gpm: number;
  xpm: number;
  items: number[];
  backpackItems: number[];
  neutralItem: number | null;
  isRadiant: boolean;
}

export const LEAGUE_TIERS: Record<string, string> = {
  premier: "顶级",
  professional: "职业",
  semi_professional: "半职业",
  amateur: "业余",
  minor: "次级",
  major: "甲级",
};

// ── Sponsor types ──

export interface SponsorData {
  id: string;
  userName: string;
  amount: number;
  message: string | null;
  confirmed: boolean;
  createdAt: string;
}

export interface SponsorFormData {
  userName: string;
  amount: number;
  message: string;
}

export const SPONSOR_TIERS = [
  { amount: 6, label: "小赞", emoji: "👍" },
  { amount: 18, label: "支持", emoji: "❤️" },
  { amount: 30, label: "鼓励", emoji: "🔥" },
  { amount: 66, label: "大赞", emoji: "🌟" },
] as const;

export const RANK_BRACKETS = [
  { value: "all", label: "全分段" },
  { value: "herald", label: "先锋" },
  { value: "guardian", label: "卫士" },
  { value: "crusader", label: "十字军" },
  { value: "archon", label: "执政官" },
  { value: "legend", label: "万古流芳" },
  { value: "ancient", label: "超凡入圣" },
  { value: "divine", label: "圣剑" },
  { value: "immortal", label: "冠绝一世" },
];
