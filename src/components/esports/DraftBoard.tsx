import { SafeImage } from "@/components/shared/SafeImage";
import type { TeamDraftData } from "@/types/dota";
import { getHeroImageUrl } from "@/lib/utils";

interface DraftBoardProps {
  draftData: TeamDraftData[];
}

export function DraftBoard({ draftData }: DraftBoardProps) {
  const radiant = draftData.find((d) => d.isRadiant);
  const dire = draftData.find((d) => !d.isRadiant);
  if (!radiant || !dire) return null;

  return (
    <div className="space-y-4">
      {/* Radiant */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-xs text-dota-green font-medium">
          <span>天辉</span>
        </div>
        {/* Radiant bans */}
        <div className="flex items-center gap-1 flex-wrap">
          {radiant.bans.sort((a, b) => a.order - b.order).map((b) => (
            <div
              key={`rban-${b.heroId}`}
              className="relative w-10 h-10 rounded overflow-hidden opacity-50 grayscale"
              title={`禁用: ${b.heroNameZh} (第${b.order + 1}手)`}
            >
              <SafeImage
                src={getHeroImageUrl(b.heroIcon)}
                alt={b.heroNameZh}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-dota-red font-bold text-lg">&#10005;</span>
              </div>
            </div>
          ))}
        </div>
        {/* Radiant picks */}
        <div className="flex items-center gap-1 flex-wrap">
          {radiant.picks.sort((a, b) => a.order - b.order).map((p) => (
            <div
              key={`rpick-${p.heroId}`}
              className="relative w-12 h-12 rounded overflow-hidden border-2 border-dota-green"
              title={`选择: ${p.heroNameZh} (第${p.order + 1}手)`}
            >
              <SafeImage
                src={getHeroImageUrl(p.heroIcon)}
                alt={p.heroNameZh}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 bg-black/70 text-dota-green text-[10px] px-1 rounded-tl">
                {p.order + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-dota-border" />

      {/* Dire */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-xs text-dota-red font-medium">
          <span>夜魇</span>
        </div>
        {/* Dire picks */}
        <div className="flex items-center gap-1 flex-wrap">
          {dire.picks.sort((a, b) => a.order - b.order).map((p) => (
            <div
              key={`dpick-${p.heroId}`}
              className="relative w-12 h-12 rounded overflow-hidden border-2 border-dota-red"
              title={`选择: ${p.heroNameZh} (第${p.order + 1}手)`}
            >
              <SafeImage
                src={getHeroImageUrl(p.heroIcon)}
                alt={p.heroNameZh}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 bg-black/70 text-dota-red text-[10px] px-1 rounded-tl">
                {p.order + 1}
              </span>
            </div>
          ))}
        </div>
        {/* Dire bans */}
        <div className="flex items-center gap-1 flex-wrap">
          {dire.bans.sort((a, b) => a.order - b.order).map((b) => (
            <div
              key={`dban-${b.heroId}`}
              className="relative w-10 h-10 rounded overflow-hidden opacity-50 grayscale"
              title={`禁用: ${b.heroNameZh} (第${b.order + 1}手)`}
            >
              <SafeImage
                src={getHeroImageUrl(b.heroIcon)}
                alt={b.heroNameZh}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-dota-red font-bold text-lg">&#10005;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
