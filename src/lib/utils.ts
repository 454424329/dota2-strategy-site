export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return formatDate(d);
}

export function getWinRateColor(winRate: number): string {
  if (winRate >= 0.52) return "win-rate-high";
  if (winRate >= 0.48) return "win-rate-mid";
  return "win-rate-low";
}

const STEAM_CDN_IMAGES = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react";
const STEAM_CDN_VIDEOS = "https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react";

export function getHeroImageUrl(heroName: string, type: "icon" | "portrait" = "icon"): string {
  if (heroName.startsWith("http")) return heroName;
  // Strip _vert suffix if present (from mock data imagePortrait values)
  const baseName = heroName.replace(/_vert$/, "");
  if (type === "portrait") {
    return `${STEAM_CDN_VIDEOS}/heroes/renders/${baseName}.png`;
  }
  return `${STEAM_CDN_IMAGES}/heroes/${baseName}.png`;
}

export function getItemImageUrl(itemName: string): string {
  if (itemName.startsWith("http")) return itemName.replace(/\.png\.png$/, ".png");
  return `${STEAM_CDN_IMAGES}/items/${itemName}.png`;
}

export function getAbilityImageUrl(abilityName: string): string {
  if (abilityName.startsWith("http")) return abilityName;
  return `${STEAM_CDN_IMAGES}/abilities/${abilityName}.png`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatMatchDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatMatchTime(unixTime: number): string {
  const d = new Date(unixTime * 1000);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return "刚刚结束";
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export function getTeamLogoUrl(logoUrl?: string, teamId?: number): string {
  if (logoUrl && logoUrl.startsWith("http")) return logoUrl;
  if (teamId) return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/team_logos/${teamId}.png`;
  return "";
}
