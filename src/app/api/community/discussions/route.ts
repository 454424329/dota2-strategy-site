import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDiscussions, createDiscussion } from "@/lib/data/community";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const categorySlug = req.nextUrl.searchParams.get("category") || undefined;
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const result = await getDiscussions({ categorySlug, page });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, categorySlug } = body;

  if (!title?.trim() || !content?.trim() || !categorySlug) {
    return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
  }
  if (title.length > 100) {
    return NextResponse.json({ error: "标题不能超过100字" }, { status: 400 });
  }

  // Find category
  const category = await prisma.forumCategory.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) {
    return NextResponse.json({ error: "分类不存在" }, { status: 404 });
  }

  // Generate unique slug
  const baseSlug = title
    .replace(/[^\w一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "discussion";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const discussion = await createDiscussion({
    title: title.trim(),
    content: content.trim(),
    slug,
    categoryId: category.id,
    authorId: session.user.id,
  });

  return NextResponse.json(discussion, { status: 201 });
}
