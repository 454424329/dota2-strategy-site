import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { HeroGrid } from "@/components/hero/HeroGrid";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllHeroesWithMeta } from "@/lib/data";
import { Search } from "lucide-react";
import type { AttributeType } from "@/types/dota";
import { ATTRIBUTE_NAMES } from "@/types/dota";

export const metadata: Metadata = {
  title: "英雄列表",
  description:
    "DOTA2全部英雄列表，包含胜率、出场率、Ban率等实时Meta数据。按属性、定位筛选。",
};

interface HeroesPageProps {
  searchParams: Promise<{ q?: string; attr?: string; role?: string; sort?: string }>;
}

export default async function HeroesPage({ searchParams }: HeroesPageProps) {
  const sp = await searchParams;
  const heroes = await getAllHeroesWithMeta("api");

  const query = sp.q?.toLowerCase() ?? "";
  const attrFilter = sp.attr as AttributeType | undefined;
  const roleFilter = sp.role;
  const sort = sp.sort ?? "winRate";

  let filtered = heroes;

  if (query) {
    filtered = filtered.filter(
      (h) =>
        h.localizedNameZh.toLowerCase().includes(query) ||
        h.localizedNameEn.toLowerCase().includes(query) ||
        h.name.toLowerCase().includes(query)
    );
  }

  if (attrFilter) {
    filtered = filtered.filter((h) => h.primaryAttribute === attrFilter);
  }

  if (roleFilter) {
    filtered = filtered.filter((h) =>
      h.roles.map((r) => r.toLowerCase()).includes(roleFilter.toLowerCase())
    );
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case "pickRate":
        return (b.meta?.pickRate ?? 0) - (a.meta?.pickRate ?? 0);
      case "banRate":
        return (b.meta?.banRate ?? 0) - (a.meta?.banRate ?? 0);
      case "name":
        return a.localizedNameZh.localeCompare(b.localizedNameZh, "zh");
      case "winRate":
      default:
        return (b.meta?.winRate ?? 0) - (a.meta?.winRate ?? 0);
    }
  });

  const currentSort = sort;
  const currentAttr = attrFilter ?? "";
  const currentRole = roleFilter ?? "";

  const sortOptions = [
    { value: "winRate", label: "胜率" },
    { value: "pickRate", label: "出场率" },
    { value: "banRate", label: "禁用率" },
    { value: "name", label: "名称" },
  ];

  return (
    <Container className="py-8">
      <PageHeader
        title="英雄列表"
        description="浏览所有DOTA2英雄，查看当前版本的Meta数据"
      />

      {/* Filters */}
      <SearchFilters
        query={query}
        currentAttr={currentAttr}
        currentRole={currentRole}
        currentSort={currentSort}
        sortOptions={sortOptions}
      />

      {filtered.length > 0 ? (
        <>
          <p className="text-xs text-dota-muted mb-4">
            共 {filtered.length} 个英雄
            {query ? ` — 搜索 "${sp.q}"` : ""}
          </p>
          <HeroGrid heroes={filtered} />
        </>
      ) : (
        <p className="text-center text-dota-muted py-12">
          没有找到匹配的英雄
        </p>
      )}
    </Container>
  );
}

function SearchFilters({
  query,
  currentAttr,
  currentRole,
  currentSort,
  sortOptions,
}: {
  query: string;
  currentAttr: string;
  currentRole: string;
  currentSort: string;
  sortOptions: { value: string; label: string }[];
}) {
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
          {/* Preserve other filters */}
          {query && <input type="hidden" name="q" value={query} />}
          {currentAttr && <input type="hidden" name="attr" value={currentAttr} />}
          <span className="text-xs text-dota-muted shrink-0">排序:</span>
          <select
            name="sort"
            defaultValue={currentSort}
            className="bg-dota-surface border border-dota-border rounded-md px-3 py-2 text-sm text-dota-text focus:border-dota-accent focus:outline-none"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => e.target.form?.requestSubmit()}
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
