import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  icon?: ReactNode;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  icon,
  message = "加载数据时出错，请稍后重试。",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 text-dota-red">{icon}</div>
      )}
      <p className="text-sm text-dota-muted mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          重试
        </Button>
      )}
    </div>
  );
}
