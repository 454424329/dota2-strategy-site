// Generate esports mock data: teams, matches, leagues
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Chinese name map from heroes generation
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

const heroes = JSON.parse(readFileSync(join(__dirname, "heroes_api.json"), "utf-8"));

function getHeroZh(heroId) {
  const h = heroes.find((x) => x.id === heroId);
  if (!h) return { name: "unknown", zh: "未知英雄" };
  const name = h.name.replace("npc_dota_hero_", "");
  const zh = chineseNames[h.name] || h.localized_name;
  return { name, zh };
}

// ── Teams ──

const realTeams = [
  { name: "Team Spirit", tag: "TSpirit", rating: 1450, logoId: 7266794 },
  { name: "Xtreme Gaming", tag: "XG", rating: 1420, logoId: 8601953 },
  { name: "Team Liquid", tag: "Liquid", rating: 1400, logoId: 2163 },
  { name: "Gaimin Gladiators", tag: "GG", rating: 1385, logoId: 8558998 },
  { name: "BetBoom Team", tag: "BB", rating: 1370, logoId: 8514649 },
  { name: "Team Falcons", tag: "Falcons", rating: 1360, logoId: 8713751 },
  { name: "Tundra Esports", tag: "Tundra", rating: 1345, logoId: 8296035 },
  { name: "Aurora Gaming", tag: "Aurora", rating: 1330, logoId: 8538156 },
  { name: "PARIVISION", tag: "PARI", rating: 1315, logoId: 8634356 },
  { name: "Nigma Galaxy", tag: "NGX", rating: 1300, logoId: 6209804 },
  { name: "OG", tag: "OG", rating: 1285, logoId: 2581813 },
  { name: "Natus Vincere", tag: "NaVi", rating: 1270, logoId: 36 },
  { name: "Virtus.pro", tag: "VP", rating: 1260, logoId: 1883503 },
  { name: "Azure Ray", tag: "AR", rating: 1250, logoId: 8601953 },
  { name: "LGD Gaming", tag: "LGD", rating: 1240, logoId: 15 },
  { name: "Invictus Gaming", tag: "iG", rating: 1225, logoId: 5 },
  { name: "Yellow Submarine", tag: "YS", rating: 1210, logoId: 8721300 },
  { name: "PSG Quest", tag: "Quest", rating: 1195, logoId: 8477121 },
  { name: "Entity", tag: "Entity", rating: 1180, logoId: 6221156 },
  { name: "MOUZ", tag: "MOUZ", rating: 1165, logoId: 8672176 },
  { name: "Team Secret", tag: "Secret", rating: 1150, logoId: 6209804 },
  { name: "Alliance", tag: "Alliance", rating: 1135, logoId: 111474 },
  { name: "BOOM Esports", tag: "BOOM", rating: 1120, logoId: 6163296 },
  { name: "Talon Esports", tag: "Talon", rating: 1105, logoId: 7115111 },
  { name: "Shopify Rebellion", tag: "SR", rating: 1090, logoId: 6819394 },
  { name: "nouns", tag: "nouns", rating: 1080, logoId: 8191247 },
  { name: "Evil Geniuses", tag: "EG", rating: 1070, logoId: 39 },
  { name: "beastcoast", tag: "bc", rating: 1060, logoId: 6209163 },
  { name: "HEROIC", tag: "HEROIC", rating: 1050, logoId: 8675170 },
  { name: "BB Team", tag: "BBT", rating: 1040, logoId: 8514649 },
  { name: "One Move", tag: "OM", rating: 1025, logoId: 8395127 },
  { name: "Hydra", tag: "Hydra", rating: 1010, logoId: 8223445 },
  { name: "Nemiga Gaming", tag: "Nemiga", rating: 995, logoId: 6921472 },
  { name: "paiN Gaming", tag: "paiN", rating: 980, logoId: 333 },
  { name: "Infinity", tag: "INF", rating: 965, logoId: 8477121 },
  { name: "Thunder Awaken", tag: "TA", rating: 950, logoId: 6209163 },
  { name: "Execration", tag: "XctN", rating: 935, logoId: 498943 },
  { name: "Geek Fam", tag: "GF", rating: 920, logoId: 6209804 },
  { name: "Fnatic", tag: "Fnatic", rating: 905, logoId: 350190 },
  { name: "BLEED Esports", tag: "BLEED", rating: 890, logoId: 8386316 },
  { name: "SMG Team", tag: "SMG", rating: 875, logoId: 8420596 },
  { name: "Polaris Esports", tag: "Polaris", rating: 860, logoId: 8454638 },
  { name: "Neon Esports", tag: "Neon", rating: 845, logoId: 8194636 },
  { name: "Army Geniuses", tag: "AG", rating: 830, logoId: 8194636 },
  { name: "Lilgun", tag: "Lilgun", rating: 815, logoId: 8477121 },
  { name: "Yangon Galacticos", tag: "YG", rating: 800, logoId: 8420596 },
  { name: "MAG.Nirvana", tag: "MAG", rating: 785, logoId: 15 },
  { name: "Dandelions", tag: "DAN", rating: 770, logoId: 8601953 },
  { name: "Klim Sani4", tag: "KS", rating: 755, logoId: 8223445 },
  { name: "Winter Bear", tag: "WB", rating: 740, logoId: 8634356 },
];

// ── Leagues ──

const leagues = [
  { leagueId: 15478, name: "ESL One Birmingham 2026", tier: "premier" },
  { leagueId: 15200, name: "DreamLeague Season 26", tier: "premier" },
  { leagueId: 15300, name: "PGL Wallachia Season 4", tier: "professional" },
  { leagueId: 15100, name: "BetBoom Dacha 2026", tier: "professional" },
  { leagueId: 15500, name: "Elite League 2026", tier: "professional" },
  { leagueId: 15600, name: "FISSURE Universe 2026", tier: "semi_professional" },
  { leagueId: 15350, name: "DPC 2026 CN Regional", tier: "professional" },
  { leagueId: 15250, name: "DPC 2026 WEU Regional", tier: "professional" },
  { leagueId: 15150, name: "DPC 2026 EEU Regional", tier: "professional" },
  { leagueId: 15400, name: "DPC 2026 SEA Regional", tier: "semi_professional" },
  { leagueId: 15650, name: "EPL World Series 2026", tier: "semi_professional" },
  { leagueId: 15700, name: "CCT Series 2026", tier: "semi_professional" },
  { leagueId: 15800, name: "Leon Masters 2026", tier: "minor" },
  { leagueId: 15900, name: "Tier 3 Cup 2026", tier: "amateur" },
];

const tierLabels = {
  premier: "顶级",
  professional: "职业",
  semi_professional: "半职业",
  minor: "次级",
  amateur: "业余",
};

// ── Generate Matches ──

// Common hero pool for picks/bans - weighted toward meta heroes
const metaHeroIds = [46, 73, 102, 91, 47, 28, 60, 106, 81, 107, 43, 103, 58, 112, 67, 68, 63, 82, 25, 85];
const otherHeroIds = heroes.map((h) => h.id).filter((id) => !metaHeroIds.includes(id));

function pickRandomHero(rng) {
  // 70% meta, 30% other
  if (rng() < 0.7) return metaHeroIds[Math.floor(rng() * metaHeroIds.length)];
  return otherHeroIds[Math.floor(rng() * otherHeroIds.length)];
}

function generateDraft(rng) {
  const bans = [];
  const picks = [];
  const usedHeroes = new Set();
  let order = 0;

  // Ban phase 1: 2 bans each (alternating Radiant/Dire)
  for (let i = 0; i < 2; i++) {
    bans.push({ heroId: pickUniqueHero(rng, usedHeroes), team: 0, order: order++, isBan: true });
    bans.push({ heroId: pickUniqueHero(rng, usedHeroes), team: 1, order: order++, isBan: true });
  }
  // Pick phase 1: 1 pick each
  for (let i = 0; i < 1; i++) {
    picks.push({ heroId: pickUniqueHero(rng, usedHeroes), team: 0, order: order++, isPick: true });
    picks.push({ heroId: pickUniqueHero(rng, usedHeroes), team: 1, order: order++, isPick: true });
  }
  // Ban phase 2: 3 bans each
  for (let i = 0; i < 3; i++) {
    bans.push({ heroId: pickUniqueHero(rng, usedHeroes), team: 0, order: order++, isBan: true });
    bans.push({ heroId: pickUniqueHero(rng, usedHeroes), team: 1, order: order++, isBan: true });
  }
  // Pick phase 2: 3 picks each
  for (let i = 0; i < 3; i++) {
    picks.push({ heroId: pickUniqueHero(rng, usedHeroes), team: 0, order: order++, isPick: true });
    picks.push({ heroId: pickUniqueHero(rng, usedHeroes), team: 1, order: order++, isPick: true });
  }
  // Ban phase 3: 1 ban each
  for (let i = 0; i < 1; i++) {
    bans.push({ heroId: pickUniqueHero(rng, usedHeroes), team: 0, order: order++, isBan: true });
    bans.push({ heroId: pickUniqueHero(rng, usedHeroes), team: 1, order: order++, isBan: true });
  }
  // Pick phase 3: 1 pick each
  for (let i = 0; i < 1; i++) {
    picks.push({ heroId: pickUniqueHero(rng, usedHeroes), team: 0, order: order++, isPick: true });
    picks.push({ heroId: pickUniqueHero(rng, usedHeroes), team: 1, order: order++, isPick: true });
  }

  return { bans, picks };
}

function pickUniqueHero(rng, used) {
  for (let i = 0; i < 50; i++) {
    const id = pickRandomHero(rng);
    if (!used.has(id)) { used.add(id); return id; }
  }
  // fallback: pick any unused hero
  for (const h of heroes) { if (!used.has(h.id)) { used.add(h.id); return h.id; } }
  return 1;
}

// Seeded pseudo-random for reproducible output
function createRng(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const commonItemIds = [1, 51, 108, 116, 180, 208, 112, 147, 46, 53, 102, 600, 2, 3, 4, 36, 37, 41, 42, 48, 50, 52, 61, 65, 73, 77, 81, 96, 98, 100, 104, 106, 110, 114, 119, 127, 131, 135, 139, 143, 145, 147, 149, 152, 154, 157, 160, 163, 166, 169];

const playerNames = [
  "Yatoro", "Larl", "Collapse", "Miposhka", "Mira",
  "Ame", "Xm", "Xxs", "XinQ", "Dy",
  "miCKe", "Nisha", "33", "Boxi", "Insania",
  "dyrachyo", "Quinn", "Ace", "tOfu", "Seleri",
  "Pure", "gpk", "Miero", "Save-", "TORONTOTOKYO",
  "skiter", "Malr1ne", "ATF", "Cr1t-", "Sneyking",
  "Nightfall", "9Class", "RAMZES666", "Antares", "kiyotaka",
  "lou", "Emo", "planet", "fy", "皮球",
  "Monet", "NothingToSay", "Chalice", "xNova", "kaka",
  "flyfly", "Emo", "JT-", "Oli", "Kamma",
];

function generatePlayers(heroIdsRadiant, heroIdsDire, rng) {
  const players = [];
  const usedNames = new Set();
  for (let i = 0; i < 5; i++) {
    const h = getHeroZh(heroIdsRadiant[i]);
    const name = pickName(rng, usedNames);
    usedNames.add(name);
    players.push(makePlayerStats(i + 1, heroIdsRadiant[i], h, name, true, rng));
  }
  for (let i = 0; i < 5; i++) {
    const h = getHeroZh(heroIdsDire[i]);
    const name = pickName(rng, usedNames);
    usedNames.add(name);
    players.push(makePlayerStats(i + 6, heroIdsDire[i], h, name, false, rng));
  }
  return players;
}

function pickName(rng, used) {
  const available = playerNames.filter((n) => !used.has(n));
  if (available.length > 0) return available[Math.floor(rng() * available.length)];
  return `Player${Math.floor(rng() * 99) + 1}`;
}

function makePlayerStats(slot, heroId, hero, name, isRadiant, rng) {
  const kills = Math.floor(rng() * 15) + 1;
  const deaths = Math.floor(rng() * 10) + 1;
  const assists = Math.floor(rng() * 20) + 3;
  const items = [];
  for (let i = 0; i < 6; i++) { items.push(commonItemIds[Math.floor(rng() * commonItemIds.length)]); }
  const backpack = [];
  for (let i = 0; i < 3; i++) { backpack.push(commonItemIds[Math.floor(rng() * commonItemIds.length)]); }
  return {
    accountId: 100000000 + slot * 10000 + Math.floor(rng() * 9999),
    name,
    heroId,
    heroName: hero.name,
    heroNameZh: hero.zh,
    heroIcon: hero.name,
    level: Math.floor(rng() * 6) + 20,
    kills,
    deaths,
    assists,
    netWorth: Math.floor(rng() * 30000) + 8000,
    lastHits: Math.floor(rng() * 400) + 50,
    denies: Math.floor(rng() * 30) + 2,
    gpm: Math.floor(rng() * 400) + 300,
    xpm: Math.floor(rng() * 400) + 350,
    items,
    backpackItems: backpack,
    neutralItem: commonItemIds[Math.floor(rng() * 20)],
    isRadiant,
  };
}

// ── Build output arrays ──

const teamsArr = realTeams.map((t, i) => ({
  teamId: 1000 + i,
  name: t.name,
  tag: t.tag,
  logoUrl: "",
  rating: t.rating + Math.floor(Math.sin(i * 13) * 30),
  wins: Math.floor(200 + Math.sin(i * 7) * 100),
  losses: Math.floor(100 + Math.cos(i * 11) * 80),
  winRate: 0,
}));
teamsArr.forEach((t) => { t.winRate = t.wins / (t.wins + t.losses); });

const now = Math.floor(Date.now() / 1000);

// Generate 100 matches spread over past 30 days
const matchesArr = [];
const detailedMatches = {};
const dayMs = 86400;

for (let i = 0; i < 100; i++) {
  const rng = createRng(i * 7919 + 1);
  const t1Idx = Math.floor(rng() * teamsArr.length);
  let t2Idx = Math.floor(rng() * teamsArr.length);
  if (t2Idx === t1Idx) t2Idx = (t1Idx + 1) % teamsArr.length;
  const t1 = teamsArr[t1Idx];
  const t2 = teamsArr[t2Idx];
  const radiantWon = rng() > 0.45;

  const startTime = now - Math.floor(rng() * 30 * dayMs);
  const duration = Math.floor(1800 + rng() * 1800);

  const league = leagues[Math.floor(rng() * leagues.length)];

  const match = {
    matchId: 7000000000 + i,
    startTime,
    duration,
    radiantTeam: { teamId: t1.teamId, name: t1.name, tag: t1.tag, logoUrl: t1.logoUrl },
    direTeam: { teamId: t2.teamId, name: t2.name, tag: t2.tag, logoUrl: t2.logoUrl },
    radiantScore: radiantWon ? Math.floor(25 + rng() * 20) : Math.floor(8 + rng() * 18),
    direScore: !radiantWon ? Math.floor(25 + rng() * 20) : Math.floor(8 + rng() * 18),
    radiantWin: radiantWon,
    league: { leagueId: league.leagueId, name: league.name, tier: league.tier, tierLabel: tierLabels[league.tier] || league.tier },
    players: [],
    goldAdv: [],
    xpAdv: [],
  };
  matchesArr.push(match);

  // Make ~30 detailed matches with draft data + players
  if (i < 30) {
    const draftRng = createRng(i * 13337 + 42);
    const { bans, picks } = generateDraft(draftRng);

    const radiantDraft = {
      isRadiant: true,
      bans: bans.filter((b) => b.team === 0).map((b) => {
        const h = getHeroZh(b.heroId);
        return { heroId: b.heroId, heroName: h.name, heroNameZh: h.zh, heroIcon: h.name, order: b.order, isBan: true };
      }),
      picks: picks.filter((p) => p.team === 0).map((p) => {
        const h = getHeroZh(p.heroId);
        return { heroId: p.heroId, heroName: h.name, heroNameZh: h.zh, heroIcon: h.name, order: p.order, isBan: false };
      }),
    };
    const direDraft = {
      isRadiant: false,
      bans: bans.filter((b) => b.team === 1).map((b) => {
        const h = getHeroZh(b.heroId);
        return { heroId: b.heroId, heroName: h.name, heroNameZh: h.zh, heroIcon: h.name, order: b.order, isBan: true };
      }),
      picks: picks.filter((p) => p.team === 1).map((p) => {
        const h = getHeroZh(p.heroId);
        return { heroId: p.heroId, heroName: h.name, heroNameZh: h.zh, heroIcon: h.name, order: p.order, isBan: false };
      }),
    };

    const radiantPickIds = radiantDraft.picks.map((p) => p.heroId);
    const direPickIds = direDraft.picks.map((p) => p.heroId);
    const playerRng = createRng(i * 27183 + 99);
    const players = generatePlayers(radiantPickIds, direPickIds, playerRng);

    detailedMatches[String(match.matchId)] = {
      ...match,
      draftData: [radiantDraft, direDraft],
      players,
    };
  }
}

// ── Write output ──

const leaguesArr = leagues.map((l) => ({
  leagueId: l.leagueId,
  name: l.name,
  tier: l.tier,
  tierLabel: tierLabels[l.tier] || l.tier,
}));

function esc(s) {
  if (!s) return "";
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, " ");
}

const lines = [];
lines.push('import type { ProMatchData, TeamData, LeagueData, TeamDraftData, DraftPick, PlayerPerformance } from "@/types/dota";');
lines.push("");

// Teams
lines.push("export const MOCK_TEAMS: TeamData[] = [");
for (const t of teamsArr) {
  lines.push(`  {`);
  lines.push(`    teamId: ${t.teamId},`);
  lines.push(`    name: "${esc(t.name)}",`);
  lines.push(`    tag: "${esc(t.tag)}",`);
  lines.push(`    logoUrl: "",`);
  lines.push(`    rating: ${t.rating},`);
  lines.push(`    wins: ${t.wins},`);
  lines.push(`    losses: ${t.losses},`);
  lines.push(`    winRate: ${t.winRate.toFixed(4)},`);
  lines.push(`  },`);
}
lines.push("];");
lines.push("");

// Matches
lines.push("export const MOCK_PRO_MATCHES: ProMatchData[] = [");
for (const m of matchesArr) {
  lines.push(`  {`);
  lines.push(`    matchId: ${m.matchId},`);
  lines.push(`    startTime: ${m.startTime},`);
  lines.push(`    duration: ${m.duration},`);
  lines.push(`    radiantTeam: { teamId: ${m.radiantTeam.teamId}, name: "${esc(m.radiantTeam.name)}", tag: "${esc(m.radiantTeam.tag)}", logoUrl: "${m.radiantTeam.logoUrl}" },`);
  lines.push(`    direTeam: { teamId: ${m.direTeam.teamId}, name: "${esc(m.direTeam.name)}", tag: "${esc(m.direTeam.tag)}", logoUrl: "${m.direTeam.logoUrl}" },`);
  lines.push(`    radiantScore: ${m.radiantScore},`);
  lines.push(`    direScore: ${m.direScore},`);
  lines.push(`    radiantWin: ${m.radiantWin},`);
  lines.push(`    league: { leagueId: ${m.league.leagueId}, name: "${esc(m.league.name)}", tier: "${m.league.tier}", tierLabel: "${m.league.tierLabel}" },`);
  lines.push(`    players: [],`);
  lines.push(`  },`);
}
lines.push("];");
lines.push("");

// Leagues
lines.push("export const MOCK_LEAGUES: LeagueData[] = [");
for (const l of leaguesArr) {
  lines.push(`  { leagueId: ${l.leagueId}, name: "${esc(l.name)}", tier: "${l.tier}", tierLabel: "${l.tierLabel}" },`);
}
lines.push("];");
lines.push("");

// Match details (with draft + players) as a Record
lines.push("export const MOCK_MATCH_DETAILS: Record<number, ProMatchData> = {");
for (const [key, m] of Object.entries(detailedMatches)) {
  lines.push(`  ${key}: {`);
  lines.push(`    matchId: ${m.matchId},`);
  lines.push(`    startTime: ${m.startTime},`);
  lines.push(`    duration: ${m.duration},`);
  lines.push(`    radiantTeam: { teamId: ${m.radiantTeam.teamId}, name: "${esc(m.radiantTeam.name)}", tag: "${esc(m.radiantTeam.tag)}", logoUrl: "${m.radiantTeam.logoUrl}" },`);
  lines.push(`    direTeam: { teamId: ${m.direTeam.teamId}, name: "${esc(m.direTeam.name)}", tag: "${esc(m.direTeam.tag)}", logoUrl: "${m.direTeam.logoUrl}" },`);
  lines.push(`    radiantScore: ${m.radiantScore},`);
  lines.push(`    direScore: ${m.direScore},`);
  lines.push(`    radiantWin: ${m.radiantWin},`);
  lines.push(`    league: { leagueId: ${m.league.leagueId}, name: "${esc(m.league.name)}", tier: "${m.league.tier}", tierLabel: "${m.league.tierLabel}" },`);

  // draftData
  lines.push(`    draftData: [`);
  for (const dd of m.draftData) {
    lines.push(`      {`);
    lines.push(`        isRadiant: ${dd.isRadiant},`);
    lines.push(`        bans: [`);
    for (const b of dd.bans) {
      lines.push(`          { heroId: ${b.heroId}, heroName: "${b.heroName}", heroNameZh: "${b.heroNameZh}", heroIcon: "${b.heroIcon}", order: ${b.order}, isBan: true },`);
    }
    lines.push(`        ],`);
    lines.push(`        picks: [`);
    for (const p of dd.picks) {
      lines.push(`          { heroId: ${p.heroId}, heroName: "${p.heroName}", heroNameZh: "${p.heroNameZh}", heroIcon: "${p.heroIcon}", order: ${p.order}, isBan: false },`);
    }
    lines.push(`        ],`);
    lines.push(`      },`);
  }
  lines.push(`    ],`);

  // players
  lines.push(`    players: [`);
  for (const p of m.players) {
    lines.push(`      {`);
    lines.push(`        accountId: ${p.accountId},`);
    lines.push(`        name: "${esc(p.name)}",`);
    lines.push(`        heroId: ${p.heroId},`);
    lines.push(`        heroName: "${p.heroName}",`);
    lines.push(`        heroNameZh: "${p.heroNameZh}",`);
    lines.push(`        heroIcon: "${p.heroIcon}",`);
    lines.push(`        level: ${p.level},`);
    lines.push(`        kills: ${p.kills},`);
    lines.push(`        deaths: ${p.deaths},`);
    lines.push(`        assists: ${p.assists},`);
    lines.push(`        netWorth: ${p.netWorth},`);
    lines.push(`        lastHits: ${p.lastHits},`);
    lines.push(`        denies: ${p.denies},`);
    lines.push(`        gpm: ${p.gpm},`);
    lines.push(`        xpm: ${p.xpm},`);
    lines.push(`        items: ${JSON.stringify(p.items)},`);
    lines.push(`        backpackItems: ${JSON.stringify(p.backpackItems)},`);
    lines.push(`        neutralItem: ${p.neutralItem},`);
    lines.push(`        isRadiant: ${p.isRadiant},`);
    lines.push(`      },`);
  }
  lines.push(`    ],`);

  lines.push(`  },`);
}
lines.push("};");
lines.push("");

const outputPath = join(__dirname, "..", "src", "lib", "data", "esports-mock.ts");
writeFileSync(outputPath, lines.join("\n"), "utf-8");
console.log(`Written ${teamsArr.length} teams, ${matchesArr.length} matches (${Object.keys(detailedMatches).length} detailed), ${leaguesArr.length} leagues to ${outputPath}`);
