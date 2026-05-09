import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { DiscussionCard } from "@/components/community/DiscussionCard";
import { getCategoryBySlug, getDiscussions } from "@/lib/data/community";
import { ArrowLeft, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return { title: "分类不存在" };
  return { title: cat.nameZh, description: cat.descriptionZh || cat.description };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1");

  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const { discussions, total, totalPages } = await getDiscussions({
    categorySlug: category,
    page,
  });

  return (
    <Container className="py-8">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-dota-muted hover:text-dota-text mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回社区
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dota-text">{cat.nameZh}</h1>
          {cat.descriptionZh && (
            <p className="text-sm text-dota-muted mt-1">{cat.descriptionZh}</p>
          )}
        </div>
        <Link
          href={`/community/new?category=${category}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-dota-accent text-white rounded-lg hover:bg-dota-accent/90 transition-colors text-sm font-medium"
        >
          <MessageCircle className="w-4 h-4" />
          发起讨论
        </Link>
      </div>

      {discussions.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="w-12 h-12 text-dota-muted mx-auto mb-4" />
          <p className="text-dota-muted">暂无讨论</p>
          <p className="text-sm text-dota-muted mt-1">成为第一个发起讨论的人吧</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {discussions.map((d: typeof discussions[number]) => (
              <DiscussionCard key={d.id} discussion={d} categorySlug={category} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {page > 1 && (
                <Link
                  href={`/community/${category}?page=${page - 1}`}
                  className="px-3 py-1.5 text-sm rounded bg-dota-surface text-dota-text hover:bg-dota-border transition-colors"
                >
                  上一页
                </Link>
              )}
              <span className="text-sm text-dota-muted">
                {page} / {totalPages} (共 {total} 个讨论)
              </span>
              {page < totalPages && (
                <Link
                  href={`/community/${category}?page=${page + 1}`}
                  className="px-3 py-1.5 text-sm rounded bg-dota-surface text-dota-text hover:bg-dota-border transition-colors"
                >
                  下一页
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </Container>
  );
}
