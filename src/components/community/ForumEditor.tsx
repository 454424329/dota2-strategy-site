"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ForumEditorProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  submitLabel?: string;
  maxLength?: number;
}

export function ForumEditor({
  onSubmit,
  placeholder = "输入内容...",
  submitLabel = "发表",
  maxLength = 5000,
}: ForumEditorProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={4}
        maxLength={maxLength}
        className="w-full rounded-md border border-dota-border bg-dota-surface px-3 py-2 text-sm text-dota-text placeholder:text-dota-muted focus:outline-none focus:ring-2 focus:ring-dota-accent/50 resize-y"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-dota-muted">
          {content.length}/{maxLength}
        </span>
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
          size="sm"
        >
          {loading ? "发送中..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}
