// Seed forum categories on deployment
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://dota2:dota2_community_2026@localhost:5432/dota2";

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log("Seeding forum categories...");
  const defaults = [
    { slug: "general", name: "General", nameZh: "综合讨论", description: "General Dota 2 discussion", descriptionZh: "DOTA2综合话题讨论区", sortOrder: 0, color: "text-dota-gold" },
    { slug: "heroes", name: "Heroes", nameZh: "英雄讨论", description: "Hero-specific strategies and builds", descriptionZh: "英雄出装、打法、技巧讨论", sortOrder: 1, color: "text-dota-green" },
    { slug: "esports", name: "Esports", nameZh: "赛事讨论", description: "Professional Dota 2 esports discussion", descriptionZh: "职业赛事、战队、选手讨论", sortOrder: 2, color: "text-dota-accent" },
    { slug: "strategy", name: "Strategy", nameZh: "战术分析", description: "In-depth strategy and meta analysis", descriptionZh: "游戏机制、版本理解、战术研究", sortOrder: 3, color: "text-dota-red" },
    { slug: "help", name: "Help", nameZh: "新手求助", description: "Questions and answers for new players", descriptionZh: "新人提问、游戏问题求助", sortOrder: 4, color: "text-dota-muted" },
    { slug: "offtopic", name: "Off Topic", nameZh: "闲聊灌水", description: "Casual chat and off-topic discussions", descriptionZh: "轻松闲聊，非DOTA2话题", sortOrder: 5, color: "text-dota-muted" },
  ];

  for (const cat of defaults) {
    await prisma.forumCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    console.log(`  ✓ ${cat.nameZh}`);
  }

  console.log("Done.");
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
