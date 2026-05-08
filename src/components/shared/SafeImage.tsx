"use client";

import { useState } from "react";
import type { ImgHTMLAttributes } from "react";

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function SafeImage({ fallback, alt, className, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-dota-surface border border-dota-border text-dota-muted ${className ?? ""}`}
        title={alt}
      >
        <span className="text-xl opacity-40">?</span>
      </div>
    );
  }

  return (
    <img
      {...props}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
