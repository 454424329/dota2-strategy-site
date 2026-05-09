import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

// ── Categories ──

export const getCategories = cache(async () => {
  return prisma.forumCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { discussions: true } },
    },
  });
});

export async function getCategoryBySlug(slug: string) {
  return prisma.forumCategory.findUnique({ where: { slug } });
}

// ── Discussions ──

const DISCUSSION_INCLUDE = {
  author: { select: { id: true, name: true, image: true } },
  category: { select: { id: true, slug: true, nameZh: true, color: true } },
  _count: { select: { posts: true } },
} satisfies Prisma.DiscussionInclude;

export async function getDiscussions({
  categorySlug,
  page = 1,
  limit = 20,
}: {
  categorySlug?: string;
  page?: number;
  limit?: number;
}) {
  const where: Prisma.DiscussionWhereInput = {};
  if (categorySlug) {
    const category = await prisma.forumCategory.findUnique({ where: { slug: categorySlug } });
    if (!category) return { discussions: [], total: 0, totalPages: 0 };
    where.categoryId = category.id;
  }

  const [discussions, total] = await Promise.all([
    prisma.discussion.findMany({
      where,
      include: DISCUSSION_INCLUDE,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.discussion.count({ where }),
  ]);

  return {
    discussions,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getDiscussionBySlug(slug: string) {
  return prisma.discussion.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, slug: true, nameZh: true, color: true } },
    },
  });
}

export async function createDiscussion(data: {
  title: string;
  content: string;
  slug: string;
  categoryId: string;
  authorId: string;
}) {
  return prisma.discussion.create({
    data,
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, slug: true, nameZh: true, color: true } },
    },
  });
}

export async function incrementDiscussionView(id: string) {
  return prisma.discussion.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
}

// ── Posts ──

export async function getPosts(discussionId: string, page = 1, limit = 20) {
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { discussionId },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where: { discussionId } }),
  ]);

  return { posts, total, totalPages: Math.ceil(total / limit) };
}

export async function createPost(data: {
  content: string;
  discussionId: string;
  authorId: string;
}) {
  // Create post and increment reply count
  const [post] = await Promise.all([
    prisma.post.create({
      data,
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.discussion.update({
      where: { id: data.discussionId },
      data: { replyCount: { increment: 1 } },
    }),
  ]);
  return post;
}

// ── Seed default categories ──

export async function seedCategories() {
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
  }
}
