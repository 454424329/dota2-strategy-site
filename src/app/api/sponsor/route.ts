import { NextRequest, NextResponse } from "next/server";
import { getConfirmedSponsors, getSponsorStats, createSponsor } from "@/lib/data/sponsor";

export async function GET() {
  const [sponsors, stats] = await Promise.all([
    getConfirmedSponsors(),
    getSponsorStats(),
  ]);
  return NextResponse.json({ sponsors, stats });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userName, amount, message } = body;

  if (!userName?.trim() || userName.length > 30) {
    return NextResponse.json({ error: "请输入昵称（最多30字）" }, { status: 400 });
  }
  if (!amount || amount < 1 || amount > 9999) {
    return NextResponse.json({ error: "金额无效" }, { status: 400 });
  }
  if (message && message.length > 200) {
    return NextResponse.json({ error: "留言不能超过200字" }, { status: 400 });
  }

  const sponsor = await createSponsor({
    userName: userName.trim(),
    amount,
    message: message?.trim() || undefined,
  });

  return NextResponse.json(sponsor, { status: 201 });
}
