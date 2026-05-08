"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MobileNav } from "@/components/layout/MobileNav";
import { Container } from "@/components/layout/Container";

const navLinks = [
  { href: "/heroes", label: "英雄" },
  { href: "/items", label: "物品" },
  { href: "/guides", label: "攻略" },
  { href: "/news", label: "新闻" },
  { href: "/esports", label: "赛事" },
  { href: "/meta", label: "Meta" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-dota-border bg-dota-bg/80 backdrop-blur-md">
        <Container>
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg font-bold text-dota-gold hover:text-dota-gold/80 transition-colors shrink-0"
            >
              DOTA2攻略
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      isActive
                        ? "text-dota-gold bg-dota-surface"
                        : "text-dota-muted hover:text-dota-text hover:bg-dota-surface"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Search + Mobile toggle */}
            <div className="flex items-center gap-2">
              <form action="/search" className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dota-muted pointer-events-none" />
                  <Input
                    name="q"
                    placeholder="搜索英雄、物品..."
                    className="pl-8 h-8 w-48 lg:w-64 text-xs"
                  />
                </div>
              </form>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 text-dota-muted hover:text-dota-text rounded-md hover:bg-dota-surface transition-colors"
                aria-label="打开菜单"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
