import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 text-dota-border">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-dota-text mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-dota-muted max-w-sm">{description}</p>
      )}
    </div>
  );
}
