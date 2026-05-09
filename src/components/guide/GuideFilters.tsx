"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface GuideFiltersProps {
  query: string;
  currentRole: string;
  currentDifficulty: string;
  heroId?: number | null;
}

const roles: { value: string; label: string }[] = [
  { value: "", label: "全部" },
  { value: "Carry", label: "核心" },
  { value: "Support", label: "辅助" },
  { value: "Initiator", label: "先手" },
  { value: "Nuker", label: "爆发" },
];

const difficulties: { value: string; label: string }[] = [
  { value: "", label: "全部" },
  { value: "beginner", label: "新手" },
  { value: "intermediate", label: "进阶" },
  { value: "advanced", label: "高手" },
];

export function GuideFilters({ query, currentRole, currentDifficulty, heroId }: GuideFiltersProps) {
  function buildUrl(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    const qs = p.toString();
    return `/guides${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-4 mb-8">
      {/* Search */}
      <form action="/guides" className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dota-muted" />
        <Input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="搜索英雄名称..."
          className="pl-10"
        />
      </form>

      {/* Role filters */}
      <div className="flex flex-wrap gap-2">
        {roles.map((r) => {
          const href = buildUrl({
            q: query || undefined,
            role: r.value || undefined,
            difficulty: currentDifficulty || undefined,
            hero: heroId ? String(heroId) : undefined,
          });
          return (
            <a key={r.value} href={href}>
              <Badge
                variant="default"
                className={`cursor-pointer transition-opacity ${
                  currentRole === r.value ? "opacity-100 ring-1 ring-dota-accent" : "opacity-60 hover:opacity-100"
                }`}
              >
                {r.label}
              </Badge>
            </a>
          );
        })}
      </div>

      {/* Difficulty filters */}
      <div className="flex flex-wrap gap-2">
        {difficulties.map((d) => {
          const href = buildUrl({
            q: query || undefined,
            role: currentRole || undefined,
            difficulty: d.value || undefined,
            hero: heroId ? String(heroId) : undefined,
          });
          return (
            <a key={d.value} href={href}>
              <Badge
                variant="outline"
                className={`cursor-pointer transition-opacity ${
                  currentDifficulty === d.value ? "opacity-100 ring-1 ring-dota-accent" : "opacity-60 hover:opacity-100"
                }`}
              >
                {d.label}
              </Badge>
            </a>
          );
        })}
      </div>
    </div>
  );
}
