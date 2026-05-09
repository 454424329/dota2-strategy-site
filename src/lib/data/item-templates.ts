// Role-based item build templates with verified item IDs from items-mock.ts
// Each template defines 2 build paths per role

interface TemplateItem {
  itemId: number;
  gamePhase: "starting" | "early" | "mid" | "late";
  importance: "core" | "situational";
}

interface BuildTemplate {
  id: string;
  nameZh: string;
  description: string;
  playstyle: string;
  phases: {
    starting: number[];
    early: number[];
    mid: number[];
    late: number[];
  };
}

// ── Carry (核心) ──

const carryPhysical: BuildTemplate = {
  id: "carry-physical",
  nameZh: "物理核心流",
  description: "传统Carry发育路线，注重刷钱效率和后期输出能力",
  playstyle: "物理核心",
  phases: {
    starting: [11, 44, 44, 16],                          // quelling, tango, tango, branch
    early: [63, 36, 18],                                  // power_treads, magic_wand, band_of_elves
    mid: [145, 116, 147],                                 // battle_fury, bkb, manta
    late: [139, 156, 208],                                // butterfly, satanic, abyssal_blade
  },
};

const carryFighter: BuildTemplate = {
  id: "carry-fighter",
  nameZh: "参战节奏流",
  description: "前期就能参团打架，通过击杀建立经济优势",
  playstyle: "节奏核心",
  phases: {
    starting: [44, 44, 16, 237],                          // tango, tango, branch, faerie_fire
    early: [50, 75, 36],                                  // phase_boots, wraith_band, magic_wand
    mid: [168, 116, 149],                                 // desolator, bkb, crystalys
    late: [160, 112, 141],                                // skadi, assault, daedalus
  },
};

// ── Support (辅助) ──

const supportUtility: BuildTemplate = {
  id: "support-utility",
  nameZh: "团队辅助流",
  description: "标准辅助出装，重点保护核心和提供团队增益",
  playstyle: "团队辅助",
  phases: {
    starting: [44, 218, 1123, 38],                        // tango, wards, blood_grenade, clarity
    early: [180, 36, 34],                                  // arcane_boots, magic_wand, magic_stick
    mid: [254, 102, 229],                                  // glimmer_cape, force_staff, solar_crest
    late: [231, 609, 108],                                 // guardian_greaves, shard, scepter
  },
};

const supportRoam: BuildTemplate = {
  id: "support-roam",
  nameZh: "游走Gank流",
  description: "积极游走带节奏，利用控制和爆发帮助线上建立优势",
  playstyle: "游走辅助",
  phases: {
    starting: [44, 244, 1123, 38],                        // tango, wind_lace, blood_grenade, clarity
    early: [214, 36, 92],                                  // tranquil_boots, magic_wand, urn
    mid: [267, 229, 102],                                  // spirit_vessel, solar_crest, force_staff
    late: [226, 108, 609],                                 // lotus_orb, scepter, shard
  },
};

// ── Initiator (先手) ──

const initiatorBlink: BuildTemplate = {
  id: "initiator-blink",
  nameZh: "跳刀先手流",
  description: "抢跳刀快速开团，打乱敌方阵型后吸收伤害",
  playstyle: "跳刀先手",
  phases: {
    starting: [44, 44, 13, 16],                           // tango, tango, gauntlets, branch
    early: [50, 36, 125],                                  // phase_boots, magic_wand, vanguard
    mid: [1, 116, 127],                                    // blink, bkb, blade_mail
    late: [112, 114, 600],                                 // assault, heart, overwhelming_blink
  },
};

const initiatorAura: BuildTemplate = {
  id: "initiator-aura",
  nameZh: "团队光环流",
  description: "以光环装备为核心，配合团队推进和团战",
  playstyle: "光环先手",
  phases: {
    starting: [44, 44, 12, 16],                           // tango, tango, ring_of_protection, branch
    early: [50, 125, 36],                                  // phase_boots, vanguard, magic_wand
    mid: [242, 90, 1],                                     // crimson_guard, pipe, blink
    late: [119, 112, 231],                                 // shivas, assault, greaves
  },
};

// ── Nuker (爆发) ──

const nukerMagic: BuildTemplate = {
  id: "nuker-magic",
  nameZh: "法术爆发流",
  description: "堆叠法术强度，一套技能秒杀敌方脆皮",
  playstyle: "法术爆发",
  phases: {
    starting: [44, 44, 15, 16],                           // tango, tango, mantle, branch
    early: [180, 77, 41],                                  // arcane_boots, null_talisman, bottle
    mid: [259, 108, 104],                                  // kaya, scepter, dagon
    late: [235, 110, 250],                                 // octarine_core, refresher, bloodthorn
  },
};

const nukerHybrid: BuildTemplate = {
  id: "nuker-hybrid",
  nameZh: "法术参战流",
  description: "兼顾法术输出和普攻能力，适应多种团战场景",
  playstyle: "法术节奏",
  phases: {
    starting: [44, 44, 16, 237],                          // tango, tango, branch, faerie_fire
    early: [63, 41, 596],                                  // power_treads, bottle, falcon_blade
    mid: [98, 116, 149],                                   // orchid, bkb, crystalys
    late: [250, 263, 160],                                 // bloodthorn, hurricane_pike, skadi
  },
};

// ── Durable (肉盾) ──

const durableTank: BuildTemplate = {
  id: "durable-tank",
  nameZh: "肉盾光环流",
  description: "极致肉度，为团队吸收全部火力",
  playstyle: "肉盾坦克",
  phases: {
    starting: [11, 44, 44, 16],                           // quelling, tango, tango, branch
    early: [50, 125, 131],                                 // phase_boots, vanguard, hood
    mid: [242, 90, 127],                                   // crimson_guard, pipe, blade_mail
    late: [114, 119, 112],                                 // heart, shivas, assault
  },
};

const durableBrawler: BuildTemplate = {
  id: "durable-brawler",
  nameZh: "冲锋陷阵流",
  description: "半肉半输出，正面冲入敌阵换命",
  playstyle: "冲锋坦克",
  phases: {
    starting: [44, 44, 13, 16],                           // tango, tango, gauntlets, branch
    early: [50, 127, 36],                                  // phase_boots, blade_mail, magic_wand
    mid: [1, 137, 151],                                    // blink, radiance, armlet
    late: [114, 112, 208],                                 // heart, assault, abyssal_blade
  },
};

// ── Disabler (控制) ──

const disablerControl: BuildTemplate = {
  id: "disabler-control",
  nameZh: "抓人控制流",
  description: "先手控制链衔接，为队友创造击杀机会",
  playstyle: "控制先手",
  phases: {
    starting: [44, 44, 16, 38],                           // tango, tango, branch, clarity
    early: [180, 36, 178],                                 // arcane_boots, magic_wand, soul_ring
    mid: [1, 206, 102],                                    // blink, atos, force_staff
    late: [108, 110, 609],                                 // scepter, refresher, shard
  },
};

const disablerSave: BuildTemplate = {
  id: "disabler-save",
  nameZh: "保护型控制流",
  description: "以保护队友为己任，关键时刻救人和反手",
  playstyle: "保护控制",
  phases: {
    starting: [44, 218, 38, 38],                          // tango, wards, clarity, clarity
    early: [214, 36, 92],                                  // tranquil_boots, magic_wand, urn
    mid: [102, 254, 229],                                  // force_staff, glimmer_cape, solar_crest
    late: [226, 108, 231],                                 // lotus_orb, scepter, greaves
  },
};

// ── Escape (逃生) ──

const escapeMobile: BuildTemplate = {
  id: "escape-mobile",
  nameZh: "灵活核心流",
  description: "利用机动性在战场边缘持续输出",
  playstyle: "灵活核心",
  phases: {
    starting: [44, 44, 16, 38],                           // tango, tango, branch, clarity
    early: [50, 36, 252],                                  // phase_boots, magic_wand, echo_sabre
    mid: [174, 116, 147],                                  // diffusal_blade, bkb, manta
    late: [139, 160, 249],                                 // butterfly, skadi, silver_edge
  },
};

// ── Pusher (推进) ──

const pusherSplit: BuildTemplate = {
  id: "pusher-split",
  nameZh: "分带推进流",
  description: "靠带线推塔压制敌方，创造空间和资源优势",
  playstyle: "带线推进",
  phases: {
    starting: [44, 44, 16, 38],                           // tango, tango, branch, clarity
    early: [180, 178, 36],                                 // arcane_boots, soul_ring, magic_wand
    mid: [223, 108, 81],                                   // meteor_hammer, scepter, vladmir
    late: [235, 110, 600],                                 // octarine_core, refresher, overwhelming_blink
  },
};

// ── Role → Template mapping ──

const ROLE_TEMPLATES: Record<string, BuildTemplate[]> = {
  Carry: [carryPhysical, carryFighter],
  Support: [supportUtility, supportRoam],
  Initiator: [initiatorBlink, initiatorAura],
  Nuker: [nukerMagic, nukerHybrid],
  Durable: [durableTank, durableBrawler],
  Disabler: [disablerControl, disablerSave],
  Escape: [escapeMobile, carryFighter],
  Pusher: [pusherSplit, carryPhysical],
  Jungler: [carryPhysical, carryFighter],
};

export function getBuildsForRoles(roles: string[]): BuildTemplate[] {
  for (const role of roles) {
    const templates = ROLE_TEMPLATES[role];
    if (templates) return templates;
  }
  // Fallback
  return [carryPhysical, carryFighter];
}

export type { BuildTemplate };
