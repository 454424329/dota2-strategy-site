import { getConfirmedSponsors, getSponsorStats } from "@/lib/data/sponsor";
import { SponsorClient } from "./SponsorClient";

export const dynamic = "force-dynamic";

export default async function SponsorPage() {
  const [sponsors, stats] = await Promise.all([
    getConfirmedSponsors(),
    getSponsorStats(),
  ]);

  const alipayQr = process.env.SPONSOR_ALIPAY_QR || null;
  const wechatQr = process.env.SPONSOR_WECHAT_QR || null;

  return (
    <SponsorClient
      sponsors={sponsors}
      stats={stats}
      alipayQr={alipayQr}
      wechatQr={wechatQr}
    />
  );
}
