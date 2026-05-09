// Generate guide mock data for all heroes
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const heroes = JSON.parse(readFileSync(join(__dirname, "heroes_api.json"), "utf-8"));

// Chinese name map from the heroes generation script
const chineseNames = {
  npc_dota_hero_antimage: "敌法师", npc_dota_hero_axe: "斧王", npc_dota_hero_bane: "祸乱之源",
  npc_dota_hero_bloodseeker: "血魔", npc_dota_hero_crystal_maiden: "水晶室女",
  npc_dota_hero_drow_ranger: "卓尔游侠", npc_dota_hero_earthshaker: "撼地者",
  npc_dota_hero_juggernaut: "主宰", npc_dota_hero_mirana: "米拉娜",
  npc_dota_hero_morphling: "变体精灵", npc_dota_hero_nevermore: "影魔",
  npc_dota_hero_phantom_lancer: "幻影长矛手", npc_dota_hero_puck: "帕克",
  npc_dota_hero_pudge: "帕吉", npc_dota_hero_razor: "剃刀", npc_dota_hero_sand_king: "沙王",
  npc_dota_hero_storm_spirit: "风暴之灵", npc_dota_hero_sven: "斯温", npc_dota_hero_tiny: "小小",
  npc_dota_hero_vengefulspirit: "复仇之魂", npc_dota_hero_windrunner: "风行者",
  npc_dota_hero_zuus: "宙斯", npc_dota_hero_kunkka: "昆卡", npc_dota_hero_lina: "莉娜",
  npc_dota_hero_lion: "莱恩", npc_dota_hero_shadow_shaman: "暗影萨满",
  npc_dota_hero_slardar: "斯拉达", npc_dota_hero_tidehunter: "潮汐猎人",
  npc_dota_hero_witch_doctor: "巫医", npc_dota_hero_lich: "巫妖", npc_dota_hero_riki: "力丸",
  npc_dota_hero_enigma: "谜团", npc_dota_hero_tinker: "修补匠", npc_dota_hero_sniper: "狙击手",
  npc_dota_hero_necrolyte: "瘟疫法师", npc_dota_hero_warlock: "术士",
  npc_dota_hero_beastmaster: "兽王", npc_dota_hero_queenofpain: "痛苦女王",
  npc_dota_hero_venomancer: "剧毒术士", npc_dota_hero_faceless_void: "虚空假面",
  npc_dota_hero_skeleton_king: "冥魂大帝", npc_dota_hero_death_prophet: "死亡先知",
  npc_dota_hero_phantom_assassin: "幻影刺客", npc_dota_hero_pugna: "帕格纳",
  npc_dota_hero_templar_assassin: "圣堂刺客", npc_dota_hero_viper: "蝮蛇",
  npc_dota_hero_luna: "露娜", npc_dota_hero_dragon_knight: "龙骑士",
  npc_dota_hero_dazzle: "戴泽", npc_dota_hero_rattletrap: "发条技师",
  npc_dota_hero_leshrac: "拉席克", npc_dota_hero_furion: "先知",
  npc_dota_hero_life_stealer: "噬魂鬼", npc_dota_hero_dark_seer: "黑暗贤者",
  npc_dota_hero_clinkz: "克林克兹", npc_dota_hero_omniknight: "全能骑士",
  npc_dota_hero_enchantress: "魅惑魔女", npc_dota_hero_huskar: "哈斯卡",
  npc_dota_hero_night_stalker: "暗夜魔王", npc_dota_hero_broodmother: "育母蜘蛛",
  npc_dota_hero_bounty_hunter: "赏金猎人", npc_dota_hero_weaver: "编织者",
  npc_dota_hero_jakiro: "杰奇洛", npc_dota_hero_batrider: "蝙蝠骑士",
  npc_dota_hero_chen: "陈", npc_dota_hero_spectre: "幽鬼",
  npc_dota_hero_ancient_apparition: "远古冰魄", npc_dota_hero_doom_bringer: "末日使者",
  npc_dota_hero_ursa: "熊战士", npc_dota_hero_spirit_breaker: "裂魂人",
  npc_dota_hero_gyrocopter: "矮人直升机", npc_dota_hero_alchemist: "炼金术士",
  npc_dota_hero_invoker: "祈求者", npc_dota_hero_silencer: "沉默术士",
  npc_dota_hero_obsidian_destroyer: "殁境神蚀者", npc_dota_hero_lycan: "狼人",
  npc_dota_hero_brewmaster: "酒仙", npc_dota_hero_shadow_demon: "暗影恶魔",
  npc_dota_hero_lone_druid: "德鲁伊", npc_dota_hero_chaos_knight: "混沌骑士",
  npc_dota_hero_meepo: "米波", npc_dota_hero_treant: "树精卫士",
  npc_dota_hero_ogre_magi: "食人魔魔法师", npc_dota_hero_undying: "不朽尸王",
  npc_dota_hero_rubick: "拉比克", npc_dota_hero_disruptor: "干扰者",
  npc_dota_hero_nyx_assassin: "司夜刺客", npc_dota_hero_naga_siren: "娜迦海妖",
  npc_dota_hero_keeper_of_the_light: "光之守卫", npc_dota_hero_wisp: "艾欧",
  npc_dota_hero_visage: "维萨吉", npc_dota_hero_slark: "斯拉克",
  npc_dota_hero_medusa: "美杜莎", npc_dota_hero_troll_warlord: "巨魔战将",
  npc_dota_hero_centaur: "半人马战行者", npc_dota_hero_magnataur: "马格纳斯",
  npc_dota_hero_shredder: "伐木机", npc_dota_hero_bristleback: "钢背兽",
  npc_dota_hero_tusk: "巨牙海民", npc_dota_hero_skywrath_mage: "天怒法师",
  npc_dota_hero_abaddon: "亚巴顿", npc_dota_hero_elder_titan: "上古巨神",
  npc_dota_hero_legion_commander: "军团指挥官", npc_dota_hero_techies: "工程师",
  npc_dota_hero_ember_spirit: "灰烬之灵", npc_dota_hero_earth_spirit: "大地之灵",
  npc_dota_hero_abyssal_underlord: "孽主", npc_dota_hero_terrorblade: "恐怖利刃",
  npc_dota_hero_phoenix: "凤凰", npc_dota_hero_oracle: "神谕者",
  npc_dota_hero_winter_wyvern: "寒冬飞龙", npc_dota_hero_arc_warden: "天穹守望者",
  npc_dota_hero_monkey_king: "齐天大圣", npc_dota_hero_dark_willow: "邪影芳灵",
  npc_dota_hero_pangolier: "石鳞剑士", npc_dota_hero_grimstroke: "天涯墨客",
  npc_dota_hero_hoodwink: "森海飞霞", npc_dota_hero_void_spirit: "虚无之灵",
  npc_dota_hero_snapfire: "电炎绝手", npc_dota_hero_mars: "玛尔斯",
  npc_dota_hero_ringmaster: "百戏大王", npc_dota_hero_dawnbreaker: "破晓辰星",
  npc_dota_hero_marci: "玛西", npc_dota_hero_primal_beast: "兽",
  npc_dota_hero_muerta: "琼英碧灵", npc_dota_hero_kez: "凯", npc_dota_hero_largo: "拉果",
};

// Role-based guide templates
const roleTemplates = {
  Carry: {
    role: "Carry",
    summary: "{hero}是当前版本的强力核心，拥有出色的后期carry能力。本攻略详细解析装备路线、技能加点和团战定位。",
    content: "# {hero} Carry攻略\n\n## 英雄定位\n{hero}是一个{attr}核心英雄，擅长在后期接管比赛。当前7.41版本中表现强势。\n\n## 装备路线\n### 出门装\n补刀斧、治疗药膏、树枝\n\n### 前期\n相位鞋/动力鞋、魔杖\n\n### 中期核心\n根据局势选择输出装或生存装\n\n### 后期神装\n黑皇杖、输出大件、撒旦之邪力\n\n## 技能加点\n主升核心输出技能，有大点大。\n\n## 对线思路\n注意补刀节奏，利用技能消耗对手。\n\n## 团战定位\n等待关键控制交出后再入场，优先击杀敌方后排。",
    difficulty: "intermediate",
  },
  Support: {
    role: "Support",
    summary: "{hero}是版本热门辅助，拥有出色的控制和保护能力。本攻略详解视野控制、游走时机和团战站位。",
    content: "# {hero} 辅助攻略\n\n## 英雄定位\n{hero}是一个{attr}辅助英雄，擅长控制和保护队友。\n\n## 装备路线\n### 出门装\n侦查守卫、树之祭祀、芒果\n\n### 前期\n奥术鞋、魔杖\n\n### 中期核心\n微光披风、原力法杖\n\n### 后期\n阿哈利姆神杖、清莲宝珠\n\n## 技能加点\n优先升级控制技能，有大点大。\n\n## 游走时机\n利用视野优势，配合中单游走。\n\n## 团战站位\n站在后排保护核心，及时交出关键技能。",
    difficulty: "beginner",
  },
  Initiator: {
    role: "Initiator",
    summary: "{hero}是版本顶级先手英雄，拥有强大的开团能力。本攻略解析跳刀时机、连招技巧和团队配合。",
    content: "# {hero} 先手攻略\n\n## 英雄定位\n{hero}是一个{attr}先手英雄，擅长开团和打乱敌方阵型。\n\n## 装备路线\n### 出门装\n圆盾、树之祭祀、树枝\n\n### 前期\n相位鞋、魔杖\n\n### 中期核心\n闪烁匕首、黑皇杖\n\n### 后期\n强袭胸甲、希瓦的守护\n\n## 技能加点\n主升控制/位移技能。\n\n## 开团时机\n等待敌方站位集中，果断跳大。\n\n## 团队配合\n与队友沟通先手目标。",
    difficulty: "intermediate",
  },
  Nuker: {
    role: "Nuker",
    summary: "{hero}拥有高额法术爆发输出，是版本中最令人畏惧的爆发英雄。本攻略涵盖技能连招和走位技巧。",
    content: "# {hero} 爆发攻略\n\n## 英雄定位\n{hero}是一个{attr}爆发英雄，拥有极高的法术伤害输出。\n\n## 装备路线\n### 出门装\n空灵挂件、树枝\n\n### 前期\n奥术鞋、魔瓶\n\n### 中期核心\n慧光、达贡之神力\n\n### 后期\n玲珑心、刷新球\n\n## 技能连招\n熟练掌握核心连招，最大化输出。\n\n## 走位技巧\n保持安全距离，等待技能CD。",
    difficulty: "intermediate",
  },
  Escape: {
    role: "Carry",
    summary: "{hero}以出色的机动性著称，在战场上穿梭自如。本攻略详解如何在保证生存的同时最大化输出。",
    content: "# {hero} 灵活核心攻略\n\n## 英雄定位\n{hero}是一个灵活的{attr}英雄，拥有出色的逃生和追击能力。\n\n## 装备路线\n### 前期\n相位鞋、魔杖\n\n### 中期核心\n黑皇杖、输出装\n\n### 后期\n蝴蝶、撒旦之邪力\n\n## 操作技巧\n合理使用位移技能，保持灵活走位。",
    difficulty: "advanced",
  },
  Durable: {
    role: "Initiator",
    summary: "{hero}是版本最肉的坦克之一，能吸收大量伤害并为队友创造输出空间。",
    content: "# {hero} 肉盾攻略\n\n## 英雄定位\n{hero}是一个{attr}耐久英雄，能承受成吨伤害。\n\n## 装备路线\n### 前期\n先锋盾、相位鞋\n\n### 中期核心\n赤红甲、洞察烟斗\n\n### 后期\n恐鳌之心、强袭胸甲\n\n## 团战思路\n站在前排吸收伤害，保护后排输出。",
    difficulty: "beginner",
  },
  Disabler: {
    role: "Support",
    summary: "{hero}的控制技能让敌人寸步难行，是团战中的关键角色。本攻略详解控制链和技能释放时机。",
    content: "# {hero} 控制攻略\n\n## 英雄定位\n{hero}是一个{attr}控制英雄，能为团队提供关键控制。\n\n## 装备路线\n### 前期\n奥术鞋、魔杖\n\n### 中期核心\n闪烁匕首、原力法杖\n\n### 后期\n阿哈利姆神杖\n\n## 控制链\n注意控制技能的衔接顺序。",
    difficulty: "beginner",
  },
  Pusher: {
    role: "Carry",
    summary: "{hero}拥有极强的推进能力，能在短时间内摧毁敌方防御塔。本攻略解析推进节奏和资源分配。",
    content: "# {hero} 推进攻略\n\n## 英雄定位\n{hero}是一个{attr}推进英雄，擅长快速摧毁建筑。\n\n## 装备路线\n### 前期\n动力鞋\n\n### 中期核心\n推进装\n\n## 推进节奏\n把握时机推进，压制敌方发育空间。",
    difficulty: "intermediate",
  },
  Jungler: {
    role: "Carry",
    summary: "{hero}拥有出色的打野能力，可以快速发育并在中期接管比赛。",
    content: "# {hero} 打野攻略\n\n## 英雄定位\n{hero}适合快速打野发育。\n\n## 打野路线\n合理规划打野路线，最大化刷钱效率。",
    difficulty: "intermediate",
  },
};

const attrNames = { str: "力量", agi: "敏捷", int: "智力", uni: "全才" };

const authorPool = [
  { id: "u1", name: "DOTA攻略大师" },
  { id: "u2", name: "天梯导师" },
  { id: "u3", name: "绝活哥老王" },
  { id: "u4", name: "版本分析师" },
  { id: "u5", name: "职业教练" },
];

const lines = [];
lines.push('import type { GuideData } from "@/types/dota";');
lines.push("");
lines.push("export const MOCK_GUIDES: GuideData[] = [");

let guideCount = 0;
for (const h of heroes) {
  const zh = chineseNames[h.name] || h.localized_name;
  const primaryRole = h.roles[0];
  const template = roleTemplates[primaryRole] || roleTemplates["Carry"];
  const attrZh = attrNames[h.primary_attr] || "敏捷";
  const imgName = h.name.replace("npc_dota_hero_", "");
  const author = authorPool[h.id % authorPool.length];

  const difficulty = primaryRole === "Carry" ? "intermediate"
    : primaryRole === "Escape" ? "advanced"
    : primaryRole === "Support" ? "beginner"
    : primaryRole === "Initiator" ? "intermediate"
    : "intermediate";

  const baseDate = new Date("2026-03-20");
  baseDate.setDate(baseDate.getDate() + (h.id % 30));
  const created = baseDate.toISOString();
  baseDate.setDate(baseDate.getDate() + (h.id % 7));
  const updated = baseDate.toISOString();

  const slug = `${h.name.replace("npc_dota_hero_", "")}-guide-7-41`;

  const summary = template.summary.replace(/{hero}/g, zh).replace(/{attr}/g, attrZh);
  const content = template.content.replace(/{hero}/g, zh).replace(/{attr}/g, attrZh);

  const viewCount = Math.floor(2000 + Math.sin(h.id * 7) * 8000 + h.id * 73);
  const likeCount = Math.floor(viewCount * (0.02 + Math.sin(h.id * 13) * 0.03));

  // Verified item IDs from items-mock.ts
  const roleItems = {
    Carry:        { laning: [11, 44, 44, 16],       core: [63, 36, 145],         situational: [139, 156, 208] },
    Support:      { laning: [44, 218, 1123, 38],    core: [180, 36, 254],        situational: [231, 609, 108] },
    Initiator:    { laning: [44, 44, 13, 16],       core: [50, 36, 1],           situational: [112, 114, 119] },
    Nuker:        { laning: [44, 44, 15, 16],       core: [180, 77, 41],         situational: [235, 110, 259] },
    Durable:      { laning: [11, 44, 44, 16],       core: [50, 125, 90],         situational: [114, 119, 112] },
    Disabler:     { laning: [44, 44, 16, 38],       core: [180, 36, 1],          situational: [108, 110, 609] },
    Escape:       { laning: [44, 44, 16, 38],       core: [50, 36, 252],         situational: [139, 160, 249] },
    Pusher:       { laning: [44, 44, 16, 38],       core: [180, 178, 36],        situational: [235, 110, 600] },
    Jungler:      { laning: [11, 44, 44, 16],       core: [63, 36, 145],         situational: [139, 156, 208] },
  };
  const items = roleItems[primaryRole] || roleItems["Carry"];
  const laningItems = items.laning;
  const coreItems = items.core;
  const situationalItems = items.situational;

  lines.push(`  {`);
  lines.push(`    id: "g${guideCount + 4}",`);
  lines.push(`    heroId: ${h.id},`);
  lines.push(`    title: "7.41 ${zh}攻略 — ${attrZh}${template.role}的进阶之路",`);
  lines.push(`    slug: "${slug}",`);
  lines.push(`    summary: "${summary}",`);
  lines.push(`    content: "${content.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",`);
  lines.push(`    role: "${template.role}",`);
  lines.push(`    difficulty: "${difficulty}",`);
  lines.push(`    laningItems: ${JSON.stringify(laningItems)},`);
  lines.push(`    coreItems: ${JSON.stringify(coreItems)},`);
  lines.push(`    situationalItems: ${JSON.stringify(situationalItems)},`);
  lines.push(`    skillBuild: null,`);
  lines.push(`    talentChoices: null,`);
  lines.push(`    viewCount: ${Math.abs(viewCount)},`);
  lines.push(`    likeCount: ${Math.abs(likeCount)},`);
  lines.push(`    status: "published",`);
  lines.push(`    versionTag: "7.41",`);
  lines.push(`    author: { id: "${author.id}", name: "${author.name}", image: null },`);
  lines.push(`    hero: { id: ${h.id}, name: "${h.name}", localizedNameZh: "${zh}", imageIcon: "${imgName}" },`);
  lines.push(`    createdAt: "${created}",`);
  lines.push(`    updatedAt: "${updated}",`);
  lines.push(`  },`);
  guideCount++;
}

lines.push("];");
lines.push("");

const outputPath = join(__dirname, "..", "src", "lib", "data", "guides-mock.ts");
writeFileSync(outputPath, lines.join("\n"), "utf-8");
console.log(`Written ${guideCount} guides to ${outputPath}`);
