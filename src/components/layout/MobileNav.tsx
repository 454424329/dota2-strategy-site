"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/heroes", label: "英雄" },
  { href: "/items", label: "物品" },
  { href: "/guides", label: "攻略" },
  { href: "/news", label: "新闻" },
  { href: "/esports", label: "赛事" },
  { href: "/community", label: "社区" },
  { href: "/sponsor", label: "赞助" },
  { href: "/meta", label: "Meta" },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Prevent body scroll when nav is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 bg-dota-surface border-l border-dota-border shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-dota-border">
          <span className="text-lg font-bold text-dota-gold">DOTA2攻略</span>
          <button
            onClick={onClose}
            className="p-2 text-dota-muted hover:text-dota-text rounded-md hover:bg-dota-border transition-colors"
            aria-label="关闭菜单"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "text-dota-gold bg-dota-bg"
                    : "text-dota-muted hover:text-dota-text hover:bg-dota-bg"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-4">
          <form action="/search" onSubmit={onClose}>
            <div className="relative">
              <input
                name="q"
                placeholder="搜索英雄、物品..."
                className="w-full rounded-lg border border-dota-border bg-dota-bg px-3 py-2 pl-9 text-sm text-dota-text placeholder:text-dota-muted focus:border-dota-accent focus:outline-none focus:ring-1 focus:ring-dota-accent transition-colors"
              />
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dota-muted pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
