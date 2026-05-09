import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAllItems } from "@/lib/data";
import { SafeImage } from "@/components/shared/SafeImage";
import { getItemImageUrl } from "@/lib/utils";
import type { ItemData } from "@/types/dota";

export const metadata: Metadata = {
  title: "物品列表",
  description: "DOTA2全部物品信息，包含价格、属性和合成路线。",
};

const categoryGroups = [
  { key: "all", label: "全部" },
  { key: "consumable", label: "消耗品" },
  { key: "basic", label: "基础装备" },
  { key: "mid", label: "中级装备" },
  { key: "advanced", label: "进阶装备" },
  { key: "major", label: "高级装备" },
  { key: "luxury", label: "神装" },
  { key: "recipe", label: "合成卷轴" },
] as const;

type CategoryKey = (typeof categoryGroups)[number]["key"];

function getCategory(item: ItemData): CategoryKey {
  if (item.isRecipe) return "recipe";
  if (item.cost <= 0) return "consumable";
  if (item.cost <= 100) return "consumable";
  if (item.cost <= 500) return "basic";
  if (item.cost <= 1500) return "mid";
  if (item.cost <= 3000) return "advanced";
  if (item.cost <= 5000) return "major";
  return "luxury";
}

export default async function ItemsPage() {
  const items = await getAllItems("api");

  const categorized = new Map<CategoryKey, ItemData[]>();
  for (const item of items) {
    const cat = getCategory(item);
    if (!categorized.has(cat)) categorized.set(cat, []);
    categorized.get(cat)!.push(item);
  }

  for (const [cat, list] of categorized) {
    list.sort((a, b) => a.cost - b.cost || a.localizedNameZh.localeCompare(b.localizedNameZh));
  }

  return (
    <Container className="py-8">
      <PageHeader
        title="物品列表"
        description="浏览DOTA2全部物品，按类别查看价格和属性"
      />

      {/* Category nav */}
      <div className="flex flex-wrap gap-2 mb-8 sticky top-16 z-10 bg-dota-dark/95 py-3 -mx-2 px-2">
        {categoryGroups.map((cat) => {
          const count = cat.key === "all"
            ? items.length
            : (categorized.get(cat.key)?.length ?? 0);
          return (
            <a key={cat.key} href={`#cat-${cat.key}`}>
              <Badge
                variant={cat.key === "all" ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                {cat.label}
                <span className="ml-1 text-xs opacity-60">{count}</span>
              </Badge>
            </a>
          );
        })}
      </div>

      {/* All items grid (default view) */}
      <section id="cat-all" className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((item) => (
            <ItemTile key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Category sections */}
      {categoryGroups.filter(c => c.key !== "all").map((cat) => {
        const list = categorized.get(cat.key);
        if (!list || list.length === 0) return null;
        return (
          <section key={cat.key} id={`cat-${cat.key}`} className="mb-10">
            <h2 className="text-lg font-semibold text-dota-text mb-4 flex items-center gap-2">
              {cat.label}
              <span className="text-xs text-dota-muted font-normal">
                {list.length} 件
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {list.map((item) => (
                <ItemTile key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </Container>
  );
}

function ItemTile({ item }: { item: ItemData }) {
  return (
    <Link href={`/items/${item.id}`}>
      <Card className="h-full card-hover">
        <CardContent className="p-3 text-center">
          <SafeImage
            src={getItemImageUrl(item.imageIcon)}
            alt={item.localizedNameZh}
            className="w-12 h-8 mx-auto rounded object-cover mb-2"
          />
          <p className="text-xs font-medium text-dota-text truncate leading-tight">
            {item.localizedNameZh}
          </p>
          <p className="text-xs text-dota-gold mt-1">
            {item.isRecipe ? "卷轴" : item.cost > 0 ? `${item.cost}` : ""}
          </p>
          {item.isSecretShop && (
            <Badge variant="outline" className="text-[10px] mt-1 px-1 py-0">
              神秘
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
