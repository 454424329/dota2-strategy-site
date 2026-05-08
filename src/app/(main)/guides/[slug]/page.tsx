import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MOCK_GUIDES } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ThumbsUp, Eye, Clock } from "lucide-react";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = MOCK_GUIDES.find((g) => g.slug === slug);
  if (!guide) notFound();

  return (
    <Container className="py-8">
      <Link
        href="/guides"
        className="inline-flex items-center gap-1 text-sm text-dota-muted hover:text-dota-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回攻略列表
      </Link>

      <article className="max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${guide.hero.imageIcon}.png`}
              alt={guide.hero.localizedNameZh}
              className="w-16 h-16 rounded-lg object-cover border border-dota-border"
            />
            <div>
              <h1 className="text-2xl font-bold text-dota-text">
                {guide.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-dota-accent">
                  {guide.hero.localizedNameZh}
                </span>
                <span className="text-xs text-dota-muted">·</span>
                <span className="text-xs text-dota-muted">
                  {guide.author.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline">
              {guide.difficulty === "beginner"
                ? "新手"
                : guide.difficulty === "intermediate"
                ? "进阶"
                : "高手"}
            </Badge>
            <Badge variant="outline">{guide.role}</Badge>
            <Badge variant="outline">版本 {guide.versionTag}</Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-dota-muted">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {guide.viewCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {guide.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(guide.createdAt)}
            </span>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="text-dota-text text-sm leading-relaxed whitespace-pre-line">
            {guide.content}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Author Card */}
        <Card>
          <CardContent className="py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-dota-border flex items-center justify-center">
              <span className="text-dota-text font-bold text-sm">
                {guide.author.name[0]}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-dota-text">
                {guide.author.name}
              </p>
              <p className="text-xs text-dota-muted">攻略作者</p>
            </div>
            <Button variant="outline" size="sm">
              <ThumbsUp className="w-4 h-4 mr-1" />
              点赞 ({guide.likeCount})
            </Button>
          </CardContent>
        </Card>
      </article>
    </Container>
  );
}
