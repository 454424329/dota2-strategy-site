import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPosts, createPost } from "@/lib/data/community";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const result = await getPosts(id, page);
  return NextResponse.json(result);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { content } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "请输入内容" }, { status: 400 });
  }
  if (content.length > 5000) {
    return NextResponse.json({ error: "内容不能超过5000字" }, { status: 400 });
  }

  const post = await createPost({
    content: content.trim(),
    discussionId: id,
    authorId: session.user.id,
  });

  return NextResponse.json(post, { status: 201 });
}
