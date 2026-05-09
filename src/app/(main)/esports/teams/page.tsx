import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { TeamRow } from "@/components/esports/TeamRow";
import { getTeams } from "@/lib/data";

export const metadata: Metadata = {
  title: "战队排名",
  description: "全球DOTA2职业战队实力排行榜",
};

export default async function TeamsPage() {
  const teams = await getTeams();
  const sorted = [...teams].sort((a, b) => b.rating - a.rating);

  return (
    <Container className="py-8">
      <PageHeader title="战队排名" description="全球职业战队实力排行" />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-dota-border text-left text-xs text-dota-muted uppercase tracking-wider">
              <th className="py-3 px-2 text-center w-12">#</th>
              <th className="py-3 px-2">战队</th>
              <th className="py-3 px-2 text-center w-36">Rating</th>
              <th className="py-3 px-2 text-center w-16">胜场</th>
              <th className="py-3 px-2 text-center w-16">负场</th>
              <th className="py-3 px-2 text-center w-20">胜率</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team, i) => (
              <TeamRow key={team.teamId} team={team} rank={i + 1} />
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
