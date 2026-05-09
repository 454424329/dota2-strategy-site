import { HeroData, AbilityData, ItemBuildData, HeroMetaData, HeroMatchupData, type ItemBuildPath, type ItemBuildPhaseGroup } from "@/types/dota";
import { getHeroImageUrl, getItemImageUrl, getAbilityImageUrl } from "@/lib/utils";
import { MOCK_HEROES } from "@/lib/data/heroes-mock";
import { MOCK_ITEMS } from "@/lib/data/items-mock";
import { MOCK_GUIDES } from "@/lib/data/guides-mock";
import { getBuildsForRoles } from "@/lib/data/item-templates";

export { MOCK_HEROES, MOCK_ITEMS, MOCK_GUIDES };

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

const phaseLabels: Record<string, string> = {
  starting: "出门装",
  early: "前期",
  mid: "中期核心",
  late: "后期",
};

function pseudoRand(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000;
  return min + (x - Math.floor(x)) * (max - min);
}

export function generateMockItemBuilds(heroId: number, roles: string[]): ItemBuildPath[] {
  const templates = getBuildsForRoles(roles);

  return templates.map((template, tIdx) => {
    const phaseOrder = ["starting", "early", "mid", "late"] as const;

    const phaseGroups: ItemBuildPhaseGroup[] = phaseOrder
      .filter((phase) => template.phases[phase]?.length > 0)
      .map((phase) => {
        const items: ItemBuildData[] = template.phases[phase]
          .map((itemId) => {
            const mockItem = MOCK_ITEMS.find((mi) => mi.id === itemId);
            if (!mockItem) return null;

            const pop = pseudoRand(heroId * 1000 + itemId + tIdx * 7, 0.28, 0.82);
            const wr = pseudoRand(heroId * 1000 + itemId + tIdx * 13 + 5, 0.44, 0.58);

            let avgTiming: number | undefined;
            if (phase === "starting") avgTiming = 0;
            else if (phase === "early") avgTiming = Math.round(pseudoRand(heroId + itemId, 3, 10));
            else if (phase === "mid") avgTiming = Math.round(pseudoRand(heroId + itemId + tIdx, 12, 28));
            else avgTiming = Math.round(pseudoRand(heroId + itemId + tIdx * 3, 28, 45));

            return {
              itemId: mockItem.id,
              itemName: mockItem.name,
              itemNameZh: mockItem.localizedNameZh,
              itemIcon: mockItem.imageIcon,
              cost: mockItem.cost,
              gamePhase: phase,
              popularity: Math.round(pop * 100) / 100,
              winRate: Math.round(wr * 100) / 100,
              avgTiming,
            };
          })
          .filter(Boolean) as ItemBuildData[];

        return {
          gamePhase: phase,
          label: phaseLabels[phase],
          items,
        };
      });

    return {
      id: template.id,
      nameZh: template.nameZh,
      description: template.description,
      playstyle: template.playstyle,
      phaseGroups,
    };
  });
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

export const MOCK_NEWS = [
  {
    id: "n1",
    sourceName: "DOTA2 官方",
    sourceUrl: "https://www.dota2.com/patches/7.41",
    title: "7.41 版本重磅更新 — 命石系统移除，先天技能重做",
    content: "Valve 发布 DOTA2 7.41 版本更新，彻底移除了命石（Facets）系统，部分热门命石能力被重新分配到阿哈利姆魔晶/神杖升级中。先天技能不再随技能等级成长，改为提供固定加成或按英雄等级独立成长。同时引入了 Chasm Stone、Shawl 等多个新物品，并对吸血机制、Roshan 位置、兵线推进等进行了大幅调整。",
    imageUrl: null,
    category: "patch",
    tags: ["7.41", "命石移除", "平衡性"],
    publishedAt: "2026-03-25T12:00:00Z",
    slug: "patch-7-41-facets-removed",
    isFeatured: true,
    viewCount: 28500,
  },
  {
    id: "n2",
    sourceName: "ESL Dota 2",
    sourceUrl: "https://www.esl-one.com/birmingham/",
    title: "ESL One 伯明翰 2026 落幕 — 百万奖金池引爆新版本大战",
    content: "ESL One 伯明翰 2026 于3月22日至29日在英国举办，16支顶级战队争夺百万美元奖金。比赛期间 7.41 版本突然发布，极大考验了各队的临场适应能力。中国战队 Xtreme Gaming 在新版本中受到较大冲击，而 Team Yandex 被解说 Maelstorm 评为版本最大受益者。",
    imageUrl: null,
    category: "esports",
    tags: ["ESL One", "伯明翰", "Xtreme Gaming"],
    publishedAt: "2026-03-30T08:00:00Z",
    slug: "esl-one-birmingham-2026-recap",
    isFeatured: true,
    viewCount: 18200,
  },
  {
    id: "n3",
    sourceName: "Escorenews",
    sourceUrl: "https://escorenews.com/",
    title: "7.41c 平衡性补丁发布 — 痛苦女王、炼金术士削弱，卓尔游侠加强",
    content: "Valve 发布 7.41c 小型平衡补丁，对近期表现强势的英雄进行针对性调整。痛苦女王、炼金术士、石鳞剑士、潮汐猎人、蝙蝠骑士、兽王遭到削弱；巫医、风行者、卓尔游侠获得加强。物品方面，统御头盔、分散机、鱼叉、恐鳌之心、希瓦的守护、灵魂之戒被削弱。飞行单位不再能看到 Roshan 坑内视野。",
    imageUrl: null,
    category: "patch",
    tags: ["7.41c", "平衡性", "补丁"],
    publishedAt: "2026-05-03T16:00:00Z",
    slug: "patch-7-41c-balance",
    isFeatured: true,
    viewCount: 15600,
  },
  {
    id: "n4",
    sourceName: "PCGamesN",
    sourceUrl: "https://www.pcgamesn.com/dota-2/",
    title: "Miposhka 炮轰 Valve：「比赛期间更新版本不正常」",
    content: "两届 TI 冠军、Team Spirit 队长 Miposhka 在 ESL One 伯明翰期间公开批评 Valve 的更新策略。7.41 版本在小组赛期间发布，7.41a 更是在淘汰赛期间落地，引发多位职业选手不满。ESL 产品经理 Avo+ 回应称 Deadlock 并非 Dota 2 的威胁，而是吸引新玩家进入 Dota 生态的「入口」。",
    imageUrl: null,
    category: "news",
    tags: ["Miposhka", "Team Spirit", "Valve"],
    publishedAt: "2026-04-02T10:00:00Z",
    slug: "miposhka-criticizes-valve",
    isFeatured: false,
    viewCount: 12300,
  },
  {
    id: "n5",
    sourceName: "Hawk Live",
    sourceUrl: "https://hawk.live/",
    title: "Ame 赛后采访：兽王是新版本最亮眼的英雄",
    content: "Xtreme Gaming 选手 Ame 在 ESL One 伯明翰后接受采访，表示 7.41 版本中兽王凭借新的先天技能重做成为版本最强 Carry 之一。Ame 认为移除非核心命石简化了游戏玩法，但部分英雄的独特性因此受损。他同时赞扬了队友在版本突变中的快速适应能力。",
    imageUrl: null,
    category: "news",
    tags: ["Ame", "Xtreme Gaming", "7.41"],
    publishedAt: "2026-04-05T14:00:00Z",
    slug: "ame-interview-beastmaster-7-41",
    isFeatured: false,
    viewCount: 9500,
  },
  {
    id: "n6",
    sourceName: "DOTA2 官方",
    sourceUrl: "https://www.dota2.com/patches/7.40",
    title: "新英雄 Largo（拉果）正式加入队长模式",
    content: "随着 7.40c 版本更新，两栖吟游诗人 Largo 正式进入队长模式（Captain's Mode），成为 2026 年首个可用的新英雄。Largo 拥有独特的乐章机制，终极技能「两栖狂想曲」可为团队提供大范围增益。7.40c 还小幅加强了其智力成长、蛙鸣打击伤害和终极技能范围。",
    imageUrl: null,
    category: "patch",
    tags: ["Largo", "新英雄", "队长模式"],
    publishedAt: "2026-01-28T10:00:00Z",
    slug: "largo-captains-mode-7-40c",
    isFeatured: false,
    viewCount: 21000,
  },
  {
    id: "n7",
    sourceName: "HUPU Esports",
    sourceUrl: "https://www.hupu.com/esports",
    title: "7.41 版本中国区天梯环境报告：力量英雄崛起",
    content: "7.41 版本上线一个月后，中国区天梯环境发生显著变化。移除命石后，力量英雄整体胜率上升 2.3%，其中半人马战行者、玛尔斯、破晓辰星等成为最大赢家。敏捷核心中幻影刺客和敌法师保持高出场率。辅助位方面，巫医和祸乱之源持续霸占天梯榜首。",
    imageUrl: null,
    category: "news",
    tags: ["天梯", "中国区", "Meta"],
    publishedAt: "2026-04-25T08:00:00Z",
    slug: "china-ladder-7-41-meta-report",
    isFeatured: false,
    viewCount: 7800,
  },
  {
    id: "n8",
    sourceName: "rdy.gg",
    sourceUrl: "https://rdy.gg/en/dota2/news/",
    title: "新物品解析：7.41 新增装备深度评测",
    content: "7.41 版本引入了多件新装备：Chasm Stone（法系破甲）、Shawl（施法护盾）、Splintmail（持续治疗甲）、Essence Distiller（法力续航神器）等。初期数据分析显示 Chasm Stone 在中单英雄中出场率最高，Shawl 成为辅助位新宠。多位职业选手认为这些新物品将在后续比赛环境中发挥关键作用。",
    imageUrl: null,
    category: "news",
    tags: ["新物品", "装备", "7.41"],
    publishedAt: "2026-04-15T12:00:00Z",
    slug: "7-41-new-items-analysis",
    isFeatured: false,
    viewCount: 11200,
  },
];
