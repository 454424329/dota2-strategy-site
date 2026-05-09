import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { getCategories } from "@/lib/data/community";
import { MessageCircle, Users, Lightbulb, Trophy, HelpCircle, Coffee } from "lucide-react";

export const metadata: Metadata = {
  title: "社区讨论",
  description: "DOTA2玩家社区 — 讨论英雄、战术、赛事，分享游戏心得",
};

const categoryIcons: Record<string, React.ReactNode> = {
  general: <MessageCircle className="w-5 h-5" />,
  heroes: <Users className="w-5 h-5" />,
  esports: <Trophy className="w-5 h-5" />,
  strategy: <Lightbulb className="w-5 h-5" />,
  help: <HelpCircle className="w-5 h-5" />,
  offtopic: <Coffee className="w-5 h-5" />,
};

export default async function CommunityPage() {
  const categories = await getCategories();

  return (
    <Container className="py-8">
      <PageHeader
        title="社区讨论"
        description="DOTA2玩家交流社区 — 讨论英雄、战术、赛事，分享游戏心得"
      />

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {categories.map((cat: typeof categories[number]) => (
          <Link key={cat.id} href={`/community/${cat.slug}`}>
            <Card className="card-hover h-full border-dota-border">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-dota-surface flex items-center justify-center ${cat.color}`}>
                    {categoryIcons[cat.slug] || <MessageCircle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-dota-text">
                      {cat.nameZh}
                    </h3>
                    <p className="text-sm text-dota-muted mt-1 line-clamp-2">
                      {cat.descriptionZh || cat.description}
                    </p>
                    <p className="text-xs text-dota-muted mt-2">
                      {cat._count.discussions} 个讨论
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="text-center">
        <Link
          href="/community/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-dota-accent text-white rounded-lg hover:bg-dota-accent/90 transition-colors font-medium"
        >
          <MessageCircle className="w-4 h-4" />
          发起新讨论
        </Link>
      </div>
    </Container>
  );
}
