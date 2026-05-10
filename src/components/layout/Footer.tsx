import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="w-full border-t border-dota-border bg-dota-surface mt-auto">
      <Container>
        <div className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-dota-text mb-3">导航</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/heroes"
                    className="text-sm text-dota-muted hover:text-dota-text transition-colors"
                  >
                    英雄
                  </Link>
                </li>
                <li>
                  <Link
                    href="/items"
                    className="text-sm text-dota-muted hover:text-dota-text transition-colors"
                  >
                    物品
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-sm text-dota-muted hover:text-dota-text transition-colors"
                  >
                    攻略
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news"
                    className="text-sm text-dota-muted hover:text-dota-text transition-colors"
                  >
                    新闻
                  </Link>
                </li>
                <li>
                  <Link
                    href="/esports"
                    className="text-sm text-dota-muted hover:text-dota-text transition-colors"
                  >
                    赛事
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="text-sm text-dota-muted hover:text-dota-text transition-colors"
                  >
                    社区
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sponsor"
                    className="text-sm text-dota-muted hover:text-dota-text transition-colors"
                  >
                    赞助我们
                  </Link>
                </li>
                <li>
                  <Link
                    href="/meta"
                    className="text-sm text-dota-muted hover:text-dota-text transition-colors"
                  >
                    Meta
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Data sources */}
            <div>
              <h3 className="text-sm font-semibold text-dota-text mb-3">数据来源</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.opendota.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-dota-muted hover:text-dota-accent transition-colors"
                  >
                    OpenDota
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-dota-muted hover:text-dota-accent transition-colors"
                  >
                    Steam
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: About */}
            <div>
              <h3 className="text-sm font-semibold text-dota-text mb-3">关于我们</h3>
              <p className="text-sm text-dota-muted leading-relaxed">
                DOTA2攻略站致力于为中文玩家提供最全面的英雄攻略、Meta数据和电竞赛事资讯。
                我们的数据来自公开API和社区贡献，持续更新中。
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-dota-muted">
              DOTA2攻略站 — 实时Meta数据 + 深度攻略 + 新闻资讯
            </p>
            <p className="text-xs text-dota-border">
              DOTA2 is a registered trademark of Valve Corporation.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
