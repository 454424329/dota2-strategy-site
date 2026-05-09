import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { MatchCard } from "@/components/esports/MatchCard";
import { getProMatches } from "@/lib/data";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "赛程安排",
  description: "DOTA2职业比赛赛程日历",
};

export default async function SchedulePage() {
  const matches = await getProMatches();
  const now = Math.floor(Date.now() / 1000);

  const upcoming = matches
    .filter((m) => m.startTime > now)
    .sort((a, b) => a.startTime - b.startTime);

  const recent = matches
    .filter((m) => m.startTime <= now)
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 30);

  // Group upcoming by date
  const groupedUpcoming = new Map<string, typeof upcoming>();
  for (const m of upcoming) {
    const dateKey = new Date(m.startTime * 1000).toLocaleDateString("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "short",
    });
    if (!groupedUpcoming.has(dateKey)) groupedUpcoming.set(dateKey, []);
    groupedUpcoming.get(dateKey)!.push(m);
  }

  return (
    <Container className="py-8">
      <PageHeader title="赛程安排" description="职业比赛赛程日历" />

      {/* Upcoming */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-dota-text mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-dota-accent" />
          即将进行的比赛
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-dota-muted text-sm py-8 text-center">暂无即将进行的比赛</p>
        ) : (
          <div className="space-y-6">
            {Array.from(groupedUpcoming.entries()).map(([dateKey, dayMatches]) => (
              <div key={dateKey}>
                <h3 className="text-sm font-medium text-dota-muted mb-3">{dateKey}</h3>
                <div className="space-y-2">
                  {dayMatches.map((m) => (
                    <MatchCard key={m.matchId} match={m} showDetails compact />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent */}
      <section>
        <h2 className="text-lg font-semibold text-dota-text mb-4">最近结束的比赛</h2>
        {recent.length === 0 ? (
          <p className="text-dota-muted text-sm py-8 text-center">暂无比赛记录</p>
        ) : (
          <div className="space-y-2">
            {recent.map((m) => (
              <MatchCard key={m.matchId} match={m} showDetails compact />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
