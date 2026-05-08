import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-dota-border bg-dota-bg px-3 py-2 text-sm text-dota-text placeholder:text-dota-muted focus:border-dota-accent focus:outline-none focus:ring-1 focus:ring-dota-accent transition-colors",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
