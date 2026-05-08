import { cn } from "@/lib/utils";
import { formatPercent, getWinRateColor } from "@/lib/utils";

interface HeroWinRateBadgeProps {
  winRate: number;
  className?: string;
}

export function HeroWinRateBadge({ winRate, className }: HeroWinRateBadgeProps) {
  const colorClass = getWinRateColor(winRate);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
        colorClass,
        className,
      )}
    >
      {formatPercent(winRate)}
    </span>
  );
}
