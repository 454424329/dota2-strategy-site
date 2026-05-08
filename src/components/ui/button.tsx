"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "default" | "outline" | "ghost" | "dota";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-dota-text text-dota-bg hover:bg-dota-text/90 shadow-sm",
  outline:
    "border border-dota-border bg-transparent text-dota-text hover:bg-dota-surface",
  ghost:
    "bg-transparent text-dota-muted hover:text-dota-text hover:bg-dota-surface",
  dota: "border border-dota-gold bg-dota-surface text-dota-gold hover:bg-dota-gold/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "px-4 py-2 text-sm",
  sm: "px-3 py-1.5 text-xs",
  lg: "px-6 py-3 text-base",
};

const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dota-accent focus:ring-offset-2 focus:ring-offset-dota-bg disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
