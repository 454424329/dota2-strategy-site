import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "str" | "agi" | "int" | "uni" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-dota-border text-dota-muted",
  str: "bg-dota-red/20 text-dota-red",
  agi: "bg-dota-green/20 text-dota-green",
  int: "bg-dota-blue/20 text-dota-blue",
  uni: "bg-dota-gold/20 text-dota-gold",
  outline: "border border-dota-border text-dota-muted bg-transparent",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
