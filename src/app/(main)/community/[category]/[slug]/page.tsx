import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostItem } from "@/components/community/PostItem";
import { ReplyForm } from "./ReplyForm";
import { auth } from "@/lib/auth";
import { getDiscussionBySlug, getPosts, incrementDiscussionView, getCategoryBySlug } from "@/lib/data/community";
import { formatTimeAgo } from "@/lib/utils";
import { ArrowLeft, Lock } from "lucide-react";

interface DiscussionPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: DiscussionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const discussion = await getDiscussionBySlug(slug);
  if (!discussion) return { title: "讨论不存在" };
  return { title: discussion.title, description: discussion.content.slice(0, 160) };
}

export default async function DiscussionPage({ params }: DiscussionPageProps) {
  const { category, slug } = await params;
  const discussion = await getDiscussionBySlug(slug);
  if (!discussion) notFound();

  // Increment view count (non-blocking)
  incrementDiscussionView(discussion.id).catch(() => {});

  const session = await auth();
  const { posts } = await getPosts(discussion.id);

  return (
    <Container className="py-8">
      <Link
        href={`/community/${category}`}
        className="inline-flex items-center gap-1 text-sm text-dota-muted hover:text-dota-text mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回{discussion.category.nameZh}
      </Link>

      {/* Discussion header */}
      <Card className="mb-6 border-dota-border">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={discussion.category.color}>
                  {discussion.category.nameZh}
                </Badge>
                {discussion.isPinned && <Badge variant="default">置顶</Badge>}
                {discussion.isLocked && <Badge variant="outline">已锁定</Badge>}
              </div>
              <h1 className="text-xl font-bold text-dota-text">{discussion.title}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-dota-muted">
                <span>{discussion.author.name || "匿名"}</span>
                <span>{formatTimeAgo(discussion.createdAt.toISOString())}</span>
                <span>{discussion.viewCount} 浏览</span>
                <span>{discussion.replyCount} 回复</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-dota-text whitespace-pre-wrap leading-relaxed">
            {discussion.content}
          </p>
        </CardContent>
      </Card>

      {/* Posts / Replies */}
      <Card className="border-dota-border">
        <CardHeader>
          <h3 className="font-semibold text-dota-text">
            回复 ({posts.length})
          </h3>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-sm text-dota-muted text-center py-8">暂无回复，来发表第一条吧</p>
          ) : (
            <div>
              {posts.map((post: typeof posts[number], i: number) => (
                <PostItem key={post.id} post={post} isFirst={i === 0} />
              ))}
            </div>
          )}

          {/* Reply form */}
          {discussion.isLocked ? (
            <div className="mt-6 p-4 rounded bg-dota-surface flex items-center gap-2 text-sm text-dota-muted">
              <Lock className="w-4 h-4" />
              此讨论已锁定，无法回复
            </div>
          ) : session?.user?.id ? (
            <div className="mt-6 pt-4 border-t border-dota-border">
              <ReplyForm
                discussionId={discussion.id}
                authorName={session.user.name || "匿名"}
              />
            </div>
          ) : (
            <div className="mt-6 p-4 rounded bg-dota-surface text-center">
              <p className="text-sm text-dota-muted">
                <Link href="/community/login" className="text-dota-accent hover:underline">
                  登录
                </Link>
                {" "}后即可回复
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
