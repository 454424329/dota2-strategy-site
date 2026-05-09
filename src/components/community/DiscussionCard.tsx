import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/utils";

interface DiscussionCardProps {
  discussion: {
    id: string;
    title: string;
    slug: string;
    isPinned: boolean;
    isLocked: boolean;
    viewCount: number;
    createdAt: Date;
    author: { id: string; name: string | null; image: string | null };
    category: { slug: string; nameZh: string; color: string };
    _count: { posts: number };
  };
  categorySlug: string;
}

export function DiscussionCard({ discussion, categorySlug }: DiscussionCardProps) {
  return (
    <Link href={`/community/${categorySlug}/${discussion.slug}`}>
      <Card className="card-hover border-dota-border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {discussion.isPinned && (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0">置顶</Badge>
                )}
                {discussion.isLocked && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">已锁定</Badge>
                )}
              </div>
              <h3 className="text-sm font-medium text-dota-text truncate">
                {discussion.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-dota-muted">
                <span>{discussion.author.name || "匿名"}</span>
                <span>{formatTimeAgo(discussion.createdAt.toISOString())}</span>
              </div>
            </div>
            <div className="shrink-0 text-right text-xs text-dota-muted space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-dota-text font-medium">{discussion._count.posts}</span>
                <span>回复</span>
              </div>
              <div>{discussion.viewCount} 浏览</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
