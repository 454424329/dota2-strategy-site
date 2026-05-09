import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { EsportsNav } from "./EsportsNav";

export const metadata: Metadata = {
  title: { template: "%s - 赛事中心", default: "赛事中心" },
  description: "DOTA2职业比赛数据、赛程安排和队伍排名",
};

export default function EsportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EsportsNav />
      {children}
    </>
  );
}
