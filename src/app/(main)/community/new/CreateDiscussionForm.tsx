"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { ForumCategory } from "@/generated/prisma/client";

interface Props {
  categories: ForumCategory[];
}

export function CreateDiscussionForm({ categories }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categorySlug) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/community/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), categorySlug }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "发表失败");
      }

      const discussion = await res.json();
      router.push(`/community/${discussion.category.slug}/${discussion.slug}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "发表失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded bg-dota-red/10 border border-dota-red/30 text-sm text-dota-red">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-dota-text mb-1">分类</label>
        <select
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          className="w-full rounded-md border border-dota-border bg-dota-surface px-3 py-2 text-sm text-dota-text focus:outline-none focus:ring-2 focus:ring-dota-accent/50"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.nameZh}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-dota-text mb-1">标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入讨论标题..."
          maxLength={100}
          className="w-full rounded-md border border-dota-border bg-dota-surface px-3 py-2 text-sm text-dota-text placeholder:text-dota-muted focus:outline-none focus:ring-2 focus:ring-dota-accent/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dota-text mb-1">内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="详细描述你的想法..."
          rows={8}
          maxLength={5000}
          className="w-full rounded-md border border-dota-border bg-dota-surface px-3 py-2 text-sm text-dota-text placeholder:text-dota-muted focus:outline-none focus:ring-2 focus:ring-dota-accent/50 resize-y"
        />
        <p className="text-xs text-dota-muted mt-1">{content.length}/5000</p>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!title.trim() || !content.trim() || loading}>
          {loading ? "发布中..." : "发布讨论"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
}
