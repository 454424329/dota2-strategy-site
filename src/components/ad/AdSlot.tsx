export type AdPlacement = "sidebar" | "inline" | "banner";

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
}

const heightMap: Record<AdPlacement, string> = {
  banner: "h-16",
  sidebar: "h-64",
  inline: "h-24",
};

const labelMap: Record<AdPlacement, string> = {
  banner: "顶部横幅广告位",
  sidebar: "侧边栏广告位",
  inline: "内容广告位",
};

export function AdSlot({ placement, className = "" }: AdSlotProps) {
  const height = heightMap[placement];
  const label = labelMap[placement];

  return (
    <div
      className={`w-full ${height} border border-dashed border-dota-border rounded-lg flex items-center justify-center bg-dota-surface/50 ${className}`}
      data-ad-slot={placement}
    >
      <span className="text-xs text-dota-muted">{label}</span>
    </div>
  );
}
