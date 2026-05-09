import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { getAllItems } from "@/lib/data";
import { SafeImage } from "@/components/shared/SafeImage";
import { getItemImageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "物品列表",
  description: "DOTA2全部物品信息，包含价格、属性和合成路线。",
};

export default async function ItemsPage() {
  const items = await getAllItems("api");

  return (
    <Container className="py-8">
      <PageHeader
        title="物品列表"
        description="浏览DOTA2全部物品，了解价格和属性"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.map((item) => (
          <Link key={item.id} href={`/items/${item.id}`}>
            <Card className="h-full card-hover">
              <CardContent className="p-3 text-center">
                <SafeImage
                  src={getItemImageUrl(item.imageIcon)}
                  alt={item.localizedNameZh}
                  className="w-12 h-8 mx-auto rounded object-cover mb-2"
                />
                <p className="text-xs font-medium text-dota-text truncate">
                  {item.localizedNameZh}
                </p>
                <p className="text-xs text-dota-gold mt-1">{item.cost}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
