import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { TeamRow } from "@/components/esports/TeamRow";
import { getTeams } from "@/lib/data";

export const metadata: Metadata = {
  title: "战队排名",
  description: "2025-2026赛季DOTA2职业战队EPT积分排行榜",
};

export default async function TeamsPage() {
  const teams = await getTeams();
  const sorted = [...teams]
    .sort((a, b) => b.eptPoints - a.eptPoints)
    .slice(0, 30)
    .map((t, i) => ({ ...t, eptRank: i + 1 }));

  return (
    <Container className="py-8">
      <PageHeader title="战队排名" description="2025-2026赛季EPT积分排行榜 TOP 30" />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-dota-border text-left text-xs text-dota-muted uppercase tracking-wider">
              <th className="py-3 px-2 text-center w-12">#</th>
              <th className="py-3 px-2">战队</th>
              <th className="py-3 px-2 text-center w-24">EPT积分</th>
              <th className="py-3 px-2 text-center w-28">Rating</th>
              <th className="py-3 px-2 text-center w-16">胜场</th>
              <th className="py-3 px-2 text-center w-16">负场</th>
              <th className="py-3 px-2 text-center w-20">胜率</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team) => (
              <TeamRow key={team.teamId} team={team} rank={team.eptRank!} />
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
