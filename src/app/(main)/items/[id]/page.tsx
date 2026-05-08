import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getItemById } from "@/lib/data";
import { getItemImageUrl } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params;
  const item = await getItemById(parseInt(id), "api");
  if (!item) notFound();

  return (
    <Container className="py-8">
      <Link
        href="/items"
        className="inline-flex items-center gap-1 text-sm text-dota-muted hover:text-dota-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回物品列表
      </Link>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="shrink-0">
          <img
            src={getItemImageUrl(item.imageIcon)}
            alt={item.localizedNameZh}
            className="w-24 h-16 md:w-32 md:h-20 rounded-lg object-cover border border-dota-border"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-dota-text">
            {item.localizedNameZh}
          </h1>
          <p className="text-sm text-dota-muted mt-1">{item.localizedNameEn}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="default" className="text-sm">
              价格: {item.cost} 金币
            </Badge>
            {item.isRecipe && <Badge variant="outline">合成卷轴</Badge>}
            {item.isSecretShop && <Badge variant="outline">神秘商店</Badge>}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-dota-text">物品描述</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-dota-muted">{item.descriptionZh}</p>
        </CardContent>
      </Card>
    </Container>
  );
}
