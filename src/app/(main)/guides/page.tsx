import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_GUIDES } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "攻略列表",
  description: "DOTA2英雄攻略合集，包含装备路线、技能加点和实战技巧。",
};

const publishedGuides = MOCK_GUIDES.filter((g) => g.status === "published");

export default function GuidesPage() {
  return (
    <Container className="py-8">
      <PageHeader title="攻略列表" description="浏览英雄攻略，提升你的DOTA2水平" />

      {publishedGuides.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-dota-border mx-auto mb-4" />
          <p className="text-dota-muted">暂无攻略，敬请期待</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publishedGuides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.slug}`}>
              <Card className="h-full card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${guide.hero.imageIcon}.png`}
                      alt={guide.hero.localizedNameZh}
                      className="w-12 h-12 rounded object-cover shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-dota-text text-sm line-clamp-2">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-dota-accent mt-0.5">
                        {guide.hero.localizedNameZh}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-dota-muted line-clamp-2 mb-3">
                    {guide.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {guide.difficulty === "beginner"
                          ? "新手"
                          : guide.difficulty === "intermediate"
                          ? "进阶"
                          : "高手"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {guide.role}
                      </Badge>
                    </div>
                    <span className="text-xs text-dota-muted">
                      {formatDate(guide.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
