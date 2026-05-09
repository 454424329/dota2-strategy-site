"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface SearchFiltersProps {
  query: string;
  currentAttr: string;
  currentRole: string;
  currentSort: string;
  sortOptions: { value: string; label: string }[];
}

export function SearchFilters({
  query,
  currentAttr,
  currentRole,
  currentSort,
  sortOptions,
}: SearchFiltersProps) {
  const attrs: { value: string; label: string; variant: "str" | "agi" | "int" | "uni" | "outline" }[] = [
    { value: "", label: "全部", variant: "outline" },
    { value: "str", label: "力量", variant: "str" },
    { value: "agi", label: "敏捷", variant: "agi" },
    { value: "int", label: "智力", variant: "int" },
    { value: "uni", label: "全才", variant: "uni" },
  ];

  const roles = [
    { value: "", label: "全部" },
    { value: "carry", label: "核心" },
    { value: "support", label: "辅助" },
    { value: "nuker", label: "爆发" },
    { value: "disabler", label: "控制" },
    { value: "initiator", label: "先手" },
  ];

  function buildUrl(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    const qs = p.toString();
    return `/heroes${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-4 mb-8">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form action="/heroes" className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dota-muted" />
          <Input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="搜索英雄名称..."
            className="pl-10"
          />
        </form>
        <form action="/heroes" className="flex items-center gap-2">
          {query && <input type="hidden" name="q" value={query} />}
          {currentAttr && <input type="hidden" name="attr" value={currentAttr} />}
          <span className="text-xs text-dota-muted shrink-0">排序:</span>
          <select
            name="sort"
            defaultValue={currentSort}
            className="bg-dota-surface border border-dota-border rounded-md px-3 py-2 text-sm text-dota-text focus:border-dota-accent focus:outline-none"
            onChange={(e) => e.target.form?.requestSubmit()}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <noscript>
            <button type="submit" className="hidden" />
          </noscript>
        </form>
      </div>

      {/* Attribute filters */}
      <div className="flex flex-wrap gap-2">
        {attrs.map((a) => {
          const href = buildUrl({ q: query || undefined, attr: a.value || undefined, sort: currentSort !== "winRate" ? currentSort : undefined });
          return (
            <a key={a.value} href={href}>
              <Badge
                variant={a.variant}
                className={`cursor-pointer transition-opacity ${
                  currentAttr === a.value ? "opacity-100 ring-1 ring-dota-accent" : "opacity-60 hover:opacity-100"
                }`}
              >
                {a.label}
              </Badge>
            </a>
          );
        })}
      </div>

      {/* Role filters */}
      <div className="flex flex-wrap gap-2">
        {roles.map((r) => {
          const href = buildUrl({
            q: query || undefined,
            attr: currentAttr || undefined,
            role: r.value || undefined,
            sort: currentSort !== "winRate" ? currentSort : undefined,
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
    </div>
  );
}
