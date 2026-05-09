import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllItems } from "@/lib/data";
import { SafeImage } from "@/components/shared/SafeImage";
import { getItemImageUrl } from "@/lib/utils";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { ITEM_RECIPES, getUpgrades } from "@/lib/data/item-recipes";
import { ITEM_DESCRIPTIONS } from "@/lib/data/item-descriptions";
import type { ItemData } from "@/types/dota";

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params;
  const allItems = await getAllItems("api");
  const item = allItems.find((i) => i.id === parseInt(id));
  if (!item) notFound();

  // Get the functional description (real Chinese functionality), fall back to flavor text
  const funcDesc = ITEM_DESCRIPTIONS[item.id] || item.descriptionZh;

  // Get recipe components
  const componentIds = ITEM_RECIPES[item.id] || item.components || [];
  const components = componentIds
    .map((cid) => allItems.find((i) => i.id === cid))
    .filter(Boolean) as ItemData[];

  // Get what this item builds into
  const upgradeIds = getUpgrades(item.id);
  const upgrades = upgradeIds
    .map((uid) => allItems.find((i) => i.id === uid))
    .filter(Boolean) as ItemData[];

  return (
    <Container className="py-8">
      <Link
        href="/items"
        className="inline-flex items-center gap-1 text-sm text-dota-muted hover:text-dota-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回物品列表
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="shrink-0">
          <SafeImage
            src={getItemImageUrl(item.imageIcon)}
            alt={item.localizedNameZh}
            className="w-24 h-16 md:w-32 md:h-20 rounded-lg object-cover border border-dota-border"
          />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-dota-text">
            {item.localizedNameZh}
          </h1>
          <p className="text-sm text-dota-muted mt-1">{item.localizedNameEn}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="default" className="text-sm">
              价格: {item.cost} 金币
            </Badge>
            {item.isSecretShop && <Badge variant="outline">神秘商店</Badge>}
            {componentIds.length > 0 && !item.isRecipe && (
              <Badge variant="outline">需要合成</Badge>
            )}
            {item.isRecipe && <Badge variant="outline">合成卷轴</Badge>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-dota-text">物品效果</h3>
          </CardHeader>
          <CardContent>
            {funcDesc ? (
              <p className="text-sm text-dota-text leading-relaxed">{funcDesc}</p>
            ) : (
              <p className="text-sm text-dota-muted italic">暂无功能描述</p>
            )}
          </CardContent>
        </Card>

        {/* Recipe components */}
        {components.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-dota-text">
                合成配方
                <span className="text-xs text-dota-muted font-normal ml-2">
                  总价: {item.cost} 金币
                </span>
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                {components.map((comp, idx) => (
                  <span key={`${comp.id}-${idx}`} className="flex items-center gap-1">
                    {idx > 0 && (
                      <ChevronRight className="w-3 h-3 text-dota-muted" />
                    )}
                    <Link
                      href={`/items/${comp.id}`}
                      className="flex items-center gap-1.5 p-1.5 rounded hover:bg-dota-surface/50 transition-colors group"
                    >
                      <SafeImage
                        src={getItemImageUrl(comp.imageIcon)}
                        alt={comp.localizedNameZh}
                        className="w-8 h-5 rounded object-cover border border-dota-border"
                      />
                      <div>
                        <p className="text-xs font-medium text-dota-text group-hover:text-dota-accent transition-colors leading-tight">
                          {comp.localizedNameZh}
                        </p>
                        <p className="text-[10px] text-dota-gold">{comp.cost > 0 ? `${comp.cost}` : ""}</p>
                      </div>
                    </Link>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upgrades (what this builds into) */}
        {upgrades.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-dota-text">可合成为</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {upgrades.map((upg) => (
                  <Link
                    key={upg.id}
                    href={`/items/${upg.id}`}
                    className="flex items-center gap-2 p-2 rounded hover:bg-dota-surface/50 transition-colors group"
                  >
                    <SafeImage
                      src={getItemImageUrl(upg.imageIcon)}
                      alt={upg.localizedNameZh}
                      className="w-10 h-6 rounded object-cover border border-dota-border"
                    />
                    <div>
                      <p className="text-sm font-medium text-dota-text group-hover:text-dota-accent transition-colors">
                        {upg.localizedNameZh}
                      </p>
                      <p className="text-xs text-dota-gold">{upg.cost}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Used as component in (only for basic items) */}
        {upgrades.length === 0 && componentIds.length === 0 && !item.isRecipe && (
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-dota-text">直接购买</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-dota-muted">
                此物品可直接购买，无需合成配方。{item.isSecretShop && "需要从神秘商店购买。"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recipe tree visualization - show full recipe chain */}
      {components.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <h3 className="font-semibold text-dota-text">合成树</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start gap-4">
              {/* Each component's sub-components */}
              {components.map((comp) => (
                <RecipeNode
                  key={comp.id}
                  item={comp}
                  allItems={allItems}
                  depth={0}
                />
              ))}
              {/* Result */}
              <div className="flex items-center gap-2 ml-8">
                <span className="text-dota-accent text-lg">→</span>
                <div className="flex items-center gap-2 p-2 bg-dota-accent/10 rounded border border-dota-accent/30">
                  <SafeImage
                    src={getItemImageUrl(item.imageIcon)}
                    alt={item.localizedNameZh}
                    className="w-10 h-6 rounded object-cover border border-dota-border"
                  />
                  <span className="text-sm font-bold text-dota-accent">{item.localizedNameZh}</span>
                  <span className="text-xs text-dota-gold">{item.cost}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

// Recursive recipe tree node
function RecipeNode({
  item,
  allItems,
  depth,
}: {
  item: ItemData;
  allItems: ItemData[];
  depth: number;
}) {
  const subIds = ITEM_RECIPES[item.id] || item.components || [];
  const subItems = subIds
    .map((cid) => allItems.find((i) => i.id === cid))
    .filter(Boolean) as ItemData[];
  const isLeaf = subItems.length === 0;

  return (
    <div style={{ marginLeft: depth * 24 }}>
      <div className="flex items-start gap-3">
        <Link
          href={`/items/${item.id}`}
          className={`flex items-center gap-1.5 p-1.5 rounded hover:bg-dota-surface/50 transition-colors group shrink-0 ${
            isLeaf ? "opacity-60" : ""
          }`}
        >
          <SafeImage
            src={getItemImageUrl(item.imageIcon)}
            alt={item.localizedNameZh}
            className="w-8 h-5 rounded object-cover border border-dota-border"
          />
          <div>
            <p className="text-xs font-medium text-dota-text group-hover:text-dota-accent transition-colors leading-tight">
              {item.localizedNameZh}
            </p>
            <p className="text-[10px] text-dota-gold">
              {item.cost > 0 ? `${item.cost}` : ""}
            </p>
          </div>
        </Link>
        {!isLeaf && (
          <div className="flex flex-col gap-1 pt-1">
            {subItems.map((sub) => (
              <RecipeNode
                key={sub.id}
                item={sub}
                allItems={allItems}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
