import Link from "next/link";
import type { HeroData } from "@/types/dota";
import { ATTRIBUTE_NAMES, type AttributeType } from "@/types/dota";
import { cn, getHeroImageUrl } from "@/lib/utils";
import { HeroWinRateBadge } from "@/components/hero/HeroWinRateBadge";
import { HeroRoleTags } from "@/components/hero/HeroRoleTags";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/shared/SafeImage";

const attributeBadgeVariant: Record<AttributeType, "str" | "agi" | "int" | "uni"> = {
  str: "str",
  agi: "agi",
  int: "int",
  uni: "uni",
};

interface HeroCardProps {
  hero: HeroData;
  className?: string;
}

export function HeroCard({ hero, className }: HeroCardProps) {
  const attr = hero.primaryAttribute;

  return (
    <Link
      href={`/heroes/${hero.name}`}
      className={cn(
        "group block rounded-lg border border-dota-border bg-dota-surface overflow-hidden card-hover",
        className,
      )}
    >
      {/* Hero image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-dota-bg">
        <SafeImage
          src={getHeroImageUrl(hero.imageIcon)}
          alt={hero.localizedNameZh}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
        {/* Attribute badge overlay */}
        <div className="absolute top-2 left-2">
          <Badge variant={attributeBadgeVariant[attr]}>
            {ATTRIBUTE_NAMES[attr]}
          </Badge>
        </div>
      </div>

      {/* Info section */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-dota-text truncate">
            {hero.localizedNameZh}
          </h3>
          {hero.meta && (
            <HeroWinRateBadge winRate={hero.meta.winRate} />
          )}
        </div>

        <HeroRoleTags roles={hero.roles} />
      </div>
    </Link>
  );
}
