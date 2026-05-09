import { formatTimeAgo } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PostItemProps {
  post: {
    id: string;
    content: string;
    createdAt: Date;
    author: { id: string; name: string | null; image: string | null };
  };
  isFirst: boolean;
}

export function PostItem({ post, isFirst }: PostItemProps) {
  const name = post.author.name || "匿名";
  const initials = name.slice(0, 2);

  return (
    <div className={`py-4 ${!isFirst ? "border-t border-dota-border" : ""}`}>
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback className="text-xs bg-dota-surface text-dota-muted">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-dota-text">{name}</span>
            {isFirst && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-dota-accent/20 text-dota-accent">
                楼主
              </span>
            )}
            <span className="text-xs text-dota-muted">
              {formatTimeAgo(post.createdAt.toISOString())}
            </span>
          </div>
          <p className="text-sm text-dota-text whitespace-pre-wrap break-words leading-relaxed">
            {post.content}
          </p>
        </div>
      </div>
    </div>
  );
}
