"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";

const tabs = [
  { href: "/esports", label: "赛事总览", exact: true },
  { href: "/esports/matches", label: "比赛数据" },
  { href: "/esports/teams", label: "战队排名" },
  { href: "/esports/schedule", label: "赛程安排" },
];

export function EsportsNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-dota-border bg-dota-surface/50">
      <Container>
        <nav className="flex gap-0 -mb-px overflow-x-auto">
          {tabs.map((tab) => {
            const active = tab.exact
              ? pathname === tab.href
              : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? "border-dota-accent text-dota-accent"
                    : "border-transparent text-dota-muted hover:text-dota-text hover:border-dota-border"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}
