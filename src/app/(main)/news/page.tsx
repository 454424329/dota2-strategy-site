import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_NEWS } from "@/lib/mock-data";
import { formatTimeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "新闻资讯",
  description: "DOTA2最新新闻、版本更新和赛事资讯。",
};

const categoryLabels: Record<string, string> = {
  esports: "赛事",
  patch: "版本更新",
  news: "新闻",
};

export default function NewsPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="新闻资讯"
        description="DOTA2最新动态、版本更新和赛事报道"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_NEWS.map((news) => (
          <Link key={news.id} href={`/news/${news.slug}`}>
            <Card className="h-full card-hover">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">
                    {categoryLabels[news.category] || news.category}
                  </Badge>
                  <span className="text-xs text-dota-muted">
                    {news.sourceName}
                  </span>
                  {news.isFeatured && (
                    <Badge variant="str" className="text-xs">
                      头条
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-dota-text leading-snug">
                  {news.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-dota-muted line-clamp-2 mb-3">
                  {news.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {news.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="default" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-dota-muted">
                    {formatTimeAgo(news.publishedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
