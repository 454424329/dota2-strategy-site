import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getLatestNews } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

const categoryLabels: Record<string, string> = {
  esports: "赛事",
  patch: "版本更新",
  news: "新闻",
};

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const { items: allNews } = await getLatestNews("api");
  const news = allNews.find((n) => n.slug === slug);
  if (!news) notFound();

  return (
    <Container className="py-8">
      <Link
        href="/news"
        className="inline-flex items-center gap-1 text-sm text-dota-muted hover:text-dota-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回新闻列表
      </Link>

      <article className="max-w-3xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline">
              {categoryLabels[news.category] || news.category}
            </Badge>
            <span className="text-xs text-dota-muted">{news.sourceName}</span>
            {news.isFeatured && (
              <Badge variant="str" className="text-xs">头条</Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-dota-text mb-3">
            {news.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-dota-muted">
            <span>{formatDate(news.publishedAt)}</span>
            <span>·</span>
            <span>{news.viewCount.toLocaleString()} 阅读</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-6">
          {news.tags.map((tag) => (
            <Badge key={tag} variant="default" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        <Separator className="mb-8" />

        <div className="text-dota-text text-sm leading-relaxed whitespace-pre-line">
          {news.content}
        </div>

        <Separator className="my-8" />

        <Card>
          <CardContent className="py-4 flex items-center justify-between">
            <span className="text-sm text-dota-muted">
              来源: {news.sourceName}
            </span>
            <a
              href={news.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-dota-accent hover:underline"
            >
              查看原文 <ExternalLink className="w-3 h-3" />
            </a>
          </CardContent>
        </Card>
      </article>
    </Container>
  );
}
