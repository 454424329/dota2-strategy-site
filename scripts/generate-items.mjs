// Generate item mock data from OpenDota API response
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Chinese name mappings for common items
const chineseNames = {
  blink: "闪烁匕首",
  blades_of_attack: "攻击之爪",
  black_king_bar: "黑皇杖",
  magic_wand: "魔杖",
  phase_boots: "相位鞋",
  power_treads: "动力鞋",
  battle_fury: "狂战斧",
  manta: "幻影斧",
  rapier: "圣剑",
  ward_observer: "侦查守卫",
  smoke_of_deceit: "诡计之雾",
  aegis: "不朽之守护",
  magic_stick: "魔棒",
  boots: "速度之靴",
  boots_of_elves: "精灵靴",
  belt_of_strength: "力量腰带",
  blade_of_alacrity: "欢欣之刃",
  ogre_axe: "食人魔之斧",
  staff_of_wizardry: "魔力法杖",
  robe: "法师长袍",
  ring_of_protection: "守护指环",
  gauntlets: "力量手套",
  slippers: "敏捷便鞋",
  mantle: "智力斗篷",
  branches: "铁树枝干",
  ring_of_regen: "治疗指环",
  sage_mask: "贤者面罩",
  boots_of_speed: "速度之靴",
  gloves: "加速手套",
  claymore: "阔剑",
  helm_of_iron_will: "铁意头盔",
  broadsword: "大剑",
  quarterstaff: "短棍",
  javelin: "标枪",
  chainmail: "锁子甲",
  platemail: "板甲",
  hyperstone: "振奋宝石",
  ring_of_health: "治疗指环",
  void_stone: "虚无宝石",
  gem: "真视宝石",
  boots_of_travel: "远行鞋",
  arcane_boots: "奥术鞋",
  tranquil_boots: "静谧之靴",
  guardian_greaves: "卫士胫甲",
  soul_ring: "灵魂之戒",
  hand_of_midas: "迈达斯之手",
  bottle: "魔瓶",
  drum_of_endurance: "韧鼓",
  mekanism: "梅肯斯姆",
  vladmir: "弗拉迪米尔的祭品",
  pipe: "洞察烟斗",
  crimson_guard: "赤红甲",
  heart: "恐鳌之心",
  assault: "强袭胸甲",
  shivas_guard: "希瓦的守护",
  bloodstone: "血精石",
  sphere: "林肯法球",
  lotus_orb: "清莲宝珠",
  hood_of_defiance: "挑战头巾",
  vanguard: "先锋盾",
  blade_mail: "刃甲",
  force_staff: "原力法杖",
  hurricane_pike: "飓风长戟",
  aghanims_shard: "阿哈利姆魔晶",
  ultimate_scepter: "阿哈利姆神杖",
  silver_edge: "白银之锋",
  monkey_king_bar: "金箍棒",
  radiance: "辉耀",
  butterfly: "蝴蝶",
  satanic: "撒旦之邪力",
  skadi: "斯嘉蒂之眼",
  desolator: "黯灭",
  basher: "碎颅锤",
  abyssal_blade: "深渊之刃",
  ethereal_blade: "虚灵之刃",
  dagon: "达贡之神力",
  orchid: "紫怨",
  bloodthorn: "血棘",
  null_talisman: "空灵挂件",
  wraith_band: "幽灵系带",
  bracer: "护腕",
  soul_booster: "灵魂之球",
  ring_of_basilius: "圣殿指环",
  urn_of_shadows: "影之灵龛",
  spirit_vessel: "魂之灵龛",
  heavens_halberd: "天堂之戟",
  solar_crest: "炎阳纹章",
  medallion_of_courage: "勇气勋章",
  dust: "显影之尘",
  sentry_wards: "岗哨守卫",
  enchanted_mango: "魔法芒果",
  healing_salve: "治疗药膏",
  tango: "树之祭祀",
  town_portal_scroll: "回城卷轴",
  clarity: "净化药水",
  fluffy_hat: "毛帽",
  falcon_blade: "猎鹰战刃",
  morbid_mask: "吸血面具",
  mask_of_madness: "疯狂面具",
  reaver: "掠夺者之斧",
  eaglesong: "鹰歌弓",
  mystic_staff: "神秘法杖",
  demon_edge: "恶魔刀锋",
  sacred_relic: "圣者遗物",
  shadow_amulet: "暗影护符",
  shadow_blade: "影刃",
  ghost: "幽魂权杖",
  boots_of_bearing: "统御头盔",
  wind_waker: "风之杖",
  octarine_core: "玲珑心",
  mage_slayer: "巫师之刃",
  echo_sabre: "回音战刃",
  harpoon: "鱼叉",
  meteor_hammer: "陨星锤",
  nullifier: "否决坠饰",
  refresher: "刷新球",
  disperser: "分散机",
  blood_grenade: "血榴弹",
  diadem: "王冠",
  phylactery: "灵匣",
  khanda: "天命",
  eternal_shroud: "永世法衣",
  gleipnir: "缚灵索",
  overwhelming_blink: "蛮牛闪现",
  swift_blink: "迅捷闪现",
  arcane_blink: "奥术闪现",
  revenants_brooch: "亡魂胸针",
  helm_of_the_dominator: "支配头盔",
  helm_of_the_overlord: "统御头盔",
  holy_locket: "圣洁吊坠",
  kaya: "慧光",
  yasha: "夜叉",
  sange: "散华",
  kaya_and_sange: "慧夜对剑",
  yasha_and_kaya: "散慧对剑",
  sange_and_yasha: "散夜对剑",
  mjollnir: "雷神之锤",
  mithril_hammer: "秘银锤",
  crystalys: "水晶剑",
  daedalus: "代达罗斯之殇",
  divine_rapier: "圣剑",
  moon_shard: "银月之晶",
  iron_branch: "铁树枝干",
  poor_mans_shield: "穷鬼盾",
  ring_of_aquila: "天鹰之戒",
  quelling_blade: "压制之斧",
  orb_of_venom: "淬毒之珠",
  ring_of_tarrasque: "恐鳌之戒",
  crown: "王冠",
  circlet: "贵族圆环",
  infused_raindrop: "凝魂之露",
  cheese: "奶酪",
  aghanims_blessing: "阿哈利姆福佑",
  rod_of_atos: "阿托斯之棍",
  seer_stone: "先见之石",
  arcane_ring: "奥术指环",
  trusty_shovel: "可靠铁铲",
  paladin_sword: "圣骑士剑",
  dragon_scale: "龙鳞",
  vengeances_shadow: "复仇之影",
  tarrasque: "恐鳌之心",
  spider_legs: "蜘蛛腿",
  vambrace: "臂甲",
  titan_sliver: "泰坦碎片",
  mind_breaker: "碎心刃",
  stormcrafter: "风暴工匠",
  force_boots: "原力鞋",
  fallen_sky: "陨落天空",
  elven_tunic: "精灵外衣",
  penta_edged_sword: "五锋剑",
  stygian_desolator: "冥灵黯灭",
  prism: "棱镜",
  mechanical_arm: "机械臂",
  enchanted_quiver: "附魔箭袋",
  specialists_array: "专家阵列",
  dagger_of_ristul: "利斯塔匕首",
  fairy_treasure: "仙灵宝藏",
  orb_of_destruction: "毁灭之球",
  bullwhip: "牛鞭",
  flicker: "闪烁",
  phoenix_ash: "凤凰灰烬",
  possessed_mask: "着魔面具",
  trickster_cloak: "诡计披风",
  ninja_gear: "忍者装备",
  illusionsts_cape: "幻术师披风",
  blighted_spirit: "枯萎之灵",
  magic_jewel: "魔法宝石",
  timeless_relic: "永恒遗物",
  psychic_headband: "灵心头带",
  soul_stealing_mask: "噬魂面具",
  flaming_scythe: "火焰镰刀",
  ancient_persuasion: "远古说服",
  glowcap: "萤光菇",
  forebearer: "先祖",
  red_orb: "红球",
  shrink_ray: "缩小射线",
  desolator_2: "黯灭2",
  satchel: "背包",
  philosophers_stone: "贤者之石",
  eye_of_the_vizier: "维齐尔之眼",
  orb_of_corrosion: "腐蚀之珠",
  grandmasters_glaive: "宗师长刃",
  warhammer: "战锤",
  stinger: "毒刺",
  demonedge: "恶魔之刃",
  book_of_shadows: "暗影之书",
  book_of_the_dead: "亡灵之书",
  armor_greaves: "装甲胫甲",
  bottomless_chalice: "无尽圣杯",
  wand_of_the_brine: "盐水之杖",
  whisper_of_the_dread: "恐惧低语",
  bone_golem: "骨傀儡",
  super_blink: "超级闪烁",
  seer_stone_2: "先见之石2",
  swift_boots: "迅捷之靴",
};

const items = JSON.parse(readFileSync(join(__dirname, "items_api.json"), "utf-8"));

const lines = [];
lines.push('import type { ItemData } from "@/types/dota";');
lines.push("");
lines.push("export const MOCK_ITEMS: ItemData[] = [");

function esc(s) {
  if (!s) return "";
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ")
    .replace(/\t/g, " ");
}

let count = 0;
for (const [key, val] of Object.entries(items)) {
  if (typeof val !== "object" || !val || !("id" in val)) continue;
  const item = val;
  if (!item.id || !item.dname) continue;

  // Skip recipes and "Upgraded" items that are just aliases
  const name = item.dname;
  if (name.startsWith("Recipe:") || name.startsWith("Upgraded:")) continue;

  const imgRaw = item.img || "";
  const imgMatch = imgRaw.match(/\/items\/(.+)\.png/);
  const imgName = imgMatch ? imgMatch[1] : key;

  const zh = esc(chineseNames[key] || chineseNames[imgName] || name);

  let cost = 0;
  if (typeof item.cost === "number" && !Number.isNaN(item.cost) && item.cost > 0 && item.cost < 100000) {
    cost = item.cost;
  } else if (typeof item.cost === "string") {
    cost = parseInt(item.cost) || 0;
  }

  lines.push(`  {`);
  lines.push(`    id: ${item.id},`);
  lines.push(`    name: "item_${key}",`);
  lines.push(`    localizedNameZh: "${zh}",`);
  lines.push(`    localizedNameEn: "${esc(name)}",`);
  lines.push(`    cost: ${cost},`);
  lines.push(`    isRecipe: false,`);
  lines.push(`    isSecretShop: false,`);
  lines.push(`    components: [],`);
  lines.push(`    imageIcon: "${esc(imgName)}",`);
  lines.push(`    descriptionZh: "${esc((item.lore || "").substring(0, 80))}",`);
  lines.push(`    tier: null,`);
  lines.push(`    isActive: true,`);
  lines.push(`  },`);
  count++;
}

lines.push("];");
lines.push("");

const outputPath = join(__dirname, "..", "src", "lib", "data", "items-mock.ts");
writeFileSync(outputPath, lines.join("\n"), "utf-8");
console.log(`Written ${count} items to ${outputPath}`);
