import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { confirmSponsor } from "@/lib/data/sponsor";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "缺少赞助ID" }, { status: 400 });
  }

  await confirmSponsor(id);
  return NextResponse.json({ success: true });
}
