"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ReplyFormProps {
  discussionId: string;
  authorName: string;
}

export function ReplyForm({ discussionId, authorName }: ReplyFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/community/discussions/${discussionId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "回复失败");
      }

      setContent("");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "回复失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="w-6 h-6">
          <AvatarFallback className="text-[10px] bg-dota-surface text-dota-muted">
            {authorName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-dota-text">{authorName}</span>
      </div>
      {error && (
        <p className="text-xs text-dota-red">{error}</p>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="分享你的看法..."
        rows={3}
        maxLength={5000}
        className="w-full rounded-md border border-dota-border bg-dota-surface px-3 py-2 text-sm text-dota-text placeholder:text-dota-muted focus:outline-none focus:ring-2 focus:ring-dota-accent/50 resize-y"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-dota-muted">{content.length}/5000</span>
        <Button type="submit" disabled={!content.trim() || loading} size="sm">
          {loading ? "回复中..." : "发表回复"}
        </Button>
      </div>
    </form>
  );
}
