import type { HeroData } from "@/types/dota";
import { HeroCard } from "@/components/hero/HeroCard";

interface HeroGridProps {
  heroes: HeroData[];
}

export function HeroGrid({ heroes }: HeroGridProps) {
  if (!heroes || heroes.length === 0) {
    return (
      <p className="text-center text-dota-muted py-12 text-sm">
        没有找到英雄数据
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {heroes.map((hero) => (
        <HeroCard key={hero.id} hero={hero} />
      ))}
    </div>
  );
}
