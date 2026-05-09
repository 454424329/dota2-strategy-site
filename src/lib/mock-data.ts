import { HeroData, AbilityData, ItemBuildData, HeroMetaData, HeroMatchupData } from "@/types/dota";
import { getHeroImageUrl, getItemImageUrl, getAbilityImageUrl } from "@/lib/utils";
import { MOCK_HEROES } from "@/lib/data/heroes-mock";
import { MOCK_ITEMS } from "@/lib/data/items-mock";

export { MOCK_HEROES, MOCK_ITEMS };

function makeImageUrl(baseName: string, type: "hero" | "item" | "ability"): string {
  switch (type) {
    case "hero":
      return getHeroImageUrl(baseName);
    case "item":
      return getItemImageUrl(baseName);
    case "ability":
      return getAbilityImageUrl(baseName);
  }
}

export function generateMockMeta(hero: HeroData): HeroMetaData {
  const seed = hero.id * 7 + hero.localizedNameZh.length * 13;
  const pseudoRandom = (min: number, max: number) => {
    const x = Math.sin(seed + min * max) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };
  return {
    pickRate: pseudoRandom(0.02, 0.35),
    banRate: pseudoRandom(0.01, 0.45),
    winRate: pseudoRandom(0.43, 0.57),
    totalMatches: Math.floor(pseudoRandom(1000, 500000)),
    avgKills: pseudoRandom(3, 12),
    avgDeaths: pseudoRandom(3, 9),
    avgAssists: pseudoRandom(8, 22),
    avgGPM: pseudoRandom(350, 650),
    avgXPM: pseudoRandom(400, 750),
    avgLastHits: pseudoRandom(80, 350),
    avgDuration: Math.floor(pseudoRandom(1800, 2700)),
    tierRank: Math.floor(pseudoRandom(1, 6)),
    rankBracket: "all",
  };
}

export function generateMockMatchups(heroId: number): HeroMatchupData[] {
  return MOCK_HEROES
    .filter((h) => h.id !== heroId)
    .slice(0, 10)
    .map((h) => {
      const seed = heroId * h.id;
      const x = Math.sin(seed) * 10000;
      const winRate = 0.35 + (x - Math.floor(x)) * 0.35;
      return {
        heroId: h.id,
        heroName: h.name,
        heroNameZh: h.localizedNameZh,
        heroIcon: makeImageUrl(h.imageIcon, "hero"),
        gamesPlayed: Math.floor(500 + (x - Math.floor(x)) * 5000),
        winRate,
        advantage: winRate - 0.5,
      };
    });
}

export function generateMockItemBuilds(heroId: number): ItemBuildData[] {
  return [
    { itemId: 108, itemName: "item_magic_wand", itemNameZh: "魔杖", itemIcon: makeImageUrl("magic_wand", "item"), cost: 450, gamePhase: "starting", popularity: 0.85, winRate: 0.52, avgTiming: 0 },
    { itemId: 180, itemName: "item_power_treads", itemNameZh: "动力鞋", itemIcon: makeImageUrl("power_treads", "item"), cost: 1400, gamePhase: "early", popularity: 0.65, winRate: 0.51, avgTiming: 6 },
    { itemId: 208, itemName: "item_battle_fury", itemNameZh: "狂战斧", itemIcon: makeImageUrl("battle_fury", "item"), cost: 4100, gamePhase: "mid", popularity: 0.55, winRate: 0.54, avgTiming: 14 },
    { itemId: 112, itemName: "item_manta", itemNameZh: "幻影斧", itemIcon: makeImageUrl("manta", "item"), cost: 4600, gamePhase: "mid", popularity: 0.48, winRate: 0.56, avgTiming: 22 },
    { itemId: 1, itemName: "item_blink", itemNameZh: "闪烁匕首", itemIcon: makeImageUrl("blink", "item"), cost: 2250, gamePhase: "mid", popularity: 0.30, winRate: 0.53, avgTiming: 18 },
    { itemId: 51, itemName: "item_black_king_bar", itemNameZh: "黑皇杖", itemIcon: makeImageUrl("black_king_bar", "item"), cost: 4050, gamePhase: "late", popularity: 0.70, winRate: 0.55, avgTiming: 25 },
  ];
}

export function generateMockAbilities(hero: HeroData): AbilityData[] {
  const roleAbilityMap: Record<string, { name: string; zh: string }[]> = {
    Carry: [
      { name: "ability_1", zh: `${hero.localizedNameZh}斩击` },
      { name: "ability_2", zh: `${hero.localizedNameZh}突进` },
      { name: "ability_3", zh: `${hero.localizedNameZh}被动` },
      { name: "ability_ultimate", zh: `${hero.localizedNameZh}绝杀` },
    ],
    Nuker: [
      { name: "ability_1", zh: "奥术冲击" },
      { name: "ability_2", zh: "能量爆发" },
      { name: "ability_3", zh: "法术护盾" },
      { name: "ability_ultimate", zh: "毁灭风暴" },
    ],
    Support: [
      { name: "ability_1", zh: "治疗之光" },
      { name: "ability_2", zh: "减速诅咒" },
      { name: "ability_3", zh: "光环" },
      { name: "ability_ultimate", zh: "守护之灵" },
    ],
    Initiator: [
      { name: "ability_1", zh: "战争践踏" },
      { name: "ability_2", zh: "冲锋" },
      { name: "ability_3", zh: "战吼" },
      { name: "ability_ultimate", zh: "毁灭打击" },
    ],
  };
  const primaryRole = hero.roles[0];
  const abilities = roleAbilityMap[primaryRole] || roleAbilityMap["Carry"];
  return abilities.map((a, i) => ({
    id: hero.id * 10 + i,
    heroId: hero.id,
    name: a.name,
    localizedNameZh: a.zh,
    localizedNameEn: a.name.replace("ability_", "Ability "),
    descriptionZh: `${hero.localizedNameZh}的${i === 3 ? "终极技能" : "技能"}。`,
    slot: i + 1,
    isUltimate: i === 3,
    imageIcon: makeImageUrl(a.name, "ability"),
  }));
}

export const MOCK_GUIDES = [
  {
    id: "g1",
    heroId: 1,
    title: "7.37 敌法师上分指南 — 从入门到超凡",
    slug: "anti-mage-carry-7-37",
    summary: "详细解析当前版本敌法师的装备路线、技能加点和对线思路，帮助你在天梯中快速上分。",
    content: "# 敌法师指南\n\n## 英雄定位\n敌法师是一个近战敏捷核心，拥有极强的法力燃烧能力和优秀的机动性...",
    role: "Carry",
    difficulty: "intermediate",
    laningItems: [108, 2],
    coreItems: [180, 208, 112],
    situationalItems: [1, 51],
    skillBuild: null,
    talentChoices: null,
    viewCount: 12450,
    likeCount: 328,
    status: "published",
    versionTag: "7.37",
    author: { id: "u1", name: "DOTA攻略大师", image: null },
    hero: { id: 1, name: "npc_dota_hero_antimage", localizedNameZh: "敌法师", imageIcon: "antimage" },
    createdAt: "2024-08-15T08:00:00Z",
    updatedAt: "2024-08-20T12:00:00Z",
  },
  {
    id: "g2",
    heroId: 74,
    title: "祈求者卡尔全面攻略 — 连招、天赋与装备选择",
    slug: "invoker-guide-7-37",
    summary: "从冰雷卡到火卡，深度分析卡尔的多种打法流派，包含详细的连招教学。",
    content: "# 卡尔攻略\n\n## 英雄定位\n祈求者是DOTA2中最独特的英雄之一，拥有10个技能...",
    role: "Mid",
    difficulty: "advanced",
    laningItems: [108],
    coreItems: [1, 51],
    situationalItems: [147],
    skillBuild: null,
    talentChoices: null,
    viewCount: 8920,
    likeCount: 215,
    status: "published",
    versionTag: "7.37",
    author: { id: "u2", name: "卡尔绝活哥", image: null },
    hero: { id: 74, name: "npc_dota_hero_invoker", localizedNameZh: "祈求者", imageIcon: "invoker" },
    createdAt: "2024-08-10T14:00:00Z",
    updatedAt: "2024-08-18T09:00:00Z",
  },
  {
    id: "g3",
    heroId: 8,
    title: "主宰剑圣新手攻略 — 最简单的Carry入门",
    slug: "juggernaut-beginner-guide",
    summary: "适合新手的剑圣攻略，从基础操作到团战思路，快速上手这个强力核心。",
    content: "# 剑圣攻略\n\n## 英雄定位\n剑圣是一个非常适合新手的Carry英雄...",
    role: "Carry",
    difficulty: "beginner",
    laningItems: [108, 2],
    coreItems: [116, 112],
    situationalItems: [1, 51],
    skillBuild: null,
    talentChoices: null,
    viewCount: 15600,
    likeCount: 412,
    status: "published",
    versionTag: "7.37",
    author: { id: "u3", name: "新手导师", image: null },
    hero: { id: 8, name: "npc_dota_hero_juggernaut", localizedNameZh: "主宰", imageIcon: "juggernaut" },
    createdAt: "2024-08-05T10:00:00Z",
    updatedAt: "2024-08-22T16:00:00Z",
  },
];

export const MOCK_NEWS = [
  {
    id: "n1",
    sourceName: "GosuGamers",
    sourceUrl: "https://www.gosugamers.net/dota2",
    title: "TI14 中国区预选赛结果出炉 — LGD 再度出征",
    content: "经过一周的激烈角逐，LGD Gaming 在 TI14 中国区预选赛中脱颖而出，成功获得主赛事名额。这是 LGD 连续第7次参加国际邀请赛。",
    imageUrl: null,
    category: "esports",
    tags: ["TI14", "LGD", "预选赛"],
    publishedAt: "2024-08-25T06:00:00Z",
    slug: "ti14-china-qualifier-lgd",
    isFeatured: true,
    viewCount: 5600,
  },
  {
    id: "n2",
    sourceName: "DOTA2 官方",
    sourceUrl: "https://www.dota2.com/news",
    title: "游戏性更新 7.37 发布 — 大量英雄平衡性调整",
    content: "Valve 发布了 DOTA2 7.37 版本更新，对超过 50 个英雄进行了平衡性调整。主要改动包括对万能属性英雄的全面调整、多个物品的重做以及地图机制的微调。",
    imageUrl: null,
    category: "patch",
    tags: ["7.37", "更新", "平衡性"],
    publishedAt: "2024-08-20T18:00:00Z",
    slug: "patch-7-37-released",
    isFeatured: true,
    viewCount: 12800,
  },
  {
    id: "n3",
    sourceName: "HUPU Esports",
    sourceUrl: "https://www.hupu.com/esports",
    title: "Maybe 宣布退役，中国DOTA传奇落幕",
    content: "LGD 电子竞技俱乐部宣布中路选手 Maybe（路垚）正式退役。Maybe 职业生涯斩获两次 TI 亚军，是中国DOTA的旗帜性人物。",
    imageUrl: null,
    category: "news",
    tags: ["Maybe", "LGD", "退役"],
    publishedAt: "2024-08-22T10:30:00Z",
    slug: "maybe-retirement",
    isFeatured: false,
    viewCount: 8900,
  },
  {
    id: "n4",
    sourceName: "Reddit r/DotA2",
    sourceUrl: "https://www.reddit.com/r/DotA2/",
    title: "敌法师在7.37版本胜率飙升？数据分析看门道",
    content: "Reddit社区热议：7.37版本后敌法师胜率从47%涨至52%，主要原因是新天赋和法力燃烧的加强让他在天梯中更加吃香。",
    imageUrl: null,
    category: "news",
    tags: ["敌法师", "7.37", "数据分析"],
    publishedAt: "2024-08-24T14:00:00Z",
    slug: "antimage-winrate-surge",
    isFeatured: false,
    viewCount: 4200,
  },
];
