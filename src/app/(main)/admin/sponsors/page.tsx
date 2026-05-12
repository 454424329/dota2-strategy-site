import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { auth } from "@/lib/auth";
import { getPendingSponsors } from "@/lib/data/sponsor";
import { AdminSponsorClient } from "./AdminSponsorClient";

export default async function AdminSponsorsPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "admin") {
    redirect("/community/login?callbackUrl=/admin/sponsors");
  }

  const pending = await getPendingSponsors();

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-dota-text mb-2">赞助管理</h1>
      <p className="text-dota-muted mb-6">
        待确认 ({pending.length}) |{" "}
        <a href="/sponsor" className="text-dota-gold hover:underline">
          查看赞助墙
        </a>
      </p>
      <AdminSponsorClient pending={pending} />
    </Container>
  );
}
