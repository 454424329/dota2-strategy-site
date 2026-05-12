import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { confirmSponsor } from "@/lib/data/sponsor";

export async function PUT(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user?.id || role !== "admin") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });
  }

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "缺少赞助ID" }, { status: 400 });
  }

  await confirmSponsor(id);
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user?.id || role !== "admin") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });
  }

  const { getPendingSponsors } = await import("@/lib/data/sponsor");
  const pending = await getPendingSponsors();
  return NextResponse.json({ pending });
}
