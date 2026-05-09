import { Card, CardContent } from "@/components/ui/card";
import { Swords, Users, Calendar, Trophy } from "lucide-react";

interface StatsSummaryProps {
  totalMatches: number;
  activeTeams: number;
  upcomingMatches: number;
  activeLeagues: number;
}

export function StatsSummary({ totalMatches, activeTeams, upcomingMatches, activeLeagues }: StatsSummaryProps) {
  const stats = [
    { label: "近期比赛", value: totalMatches, icon: Swords, suffix: "场" },
    { label: "活跃战队", value: activeTeams, icon: Users, suffix: "支" },
    { label: "即将进行", value: upcomingMatches, icon: Calendar, suffix: "场" },
    { label: "进行中联赛", value: activeLeagues, icon: Trophy, suffix: "个" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="py-4 flex flex-col items-center text-center">
            <s.icon className="w-5 h-5 text-dota-accent mb-2" />
            <p className="text-2xl font-bold text-dota-text">
              {s.value}
              <span className="text-sm font-normal text-dota-muted ml-1">
                {s.suffix}
              </span>
            </p>
            <p className="text-xs text-dota-muted mt-1">{s.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
