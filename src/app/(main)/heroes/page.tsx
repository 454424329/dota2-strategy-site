import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { HeroGrid } from "@/components/hero/HeroGrid";
import { SearchFilters } from "@/components/hero/SearchFilters";
import { getAllHeroesWithMeta } from "@/lib/data";
import type { AttributeType } from "@/types/dota";

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

