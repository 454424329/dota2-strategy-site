import { cache } from "react";
import type { ItemData } from "@/types/dota";
import type { DataSource } from "./types";
import { fetchItems } from "./opendota";
import { MOCK_ITEMS } from "./items-mock";

interface OpenDotaItemConst {
  id: number;
  dname?: string;
  cost?: number | null;
  img?: string;
  lore?: string;
  notes?: string;
  behavior?: string;
  mc?: boolean;
  hc?: boolean;
  cd?: number | null;
  qual?: string;
  components?: string[] | null;
  created?: boolean;
  charges?: boolean;
}

export const getAllItems = cache(async (source: DataSource = "api") => {
  if (source === "mock") {
    return MOCK_ITEMS;
  }

  const data = await fetchItems();
  if (!data) return MOCK_ITEMS;

  // Map OpenDota constants to our ItemData format
  const items: ItemData[] = [];
  for (const [key, val] of Object.entries(data)) {
    if (typeof val !== "object" || !val || !("id" in val)) continue;
    const item = val as OpenDotaItemConst;
    const dname = item.dname || "";
    if (!item.id || !dname || dname.startsWith("Recipe:")) continue;

    // Parse image icon name from img path
    const imgMatch = item.img?.match(/\/items\/(.+)\.png/) || [];
    const imgName = imgMatch[1] || key;

    const mockItem = MOCK_ITEMS.find((m) => m.name === `item_${key}`);
    const cost = typeof item.cost === "number" && item.cost > 0 ? item.cost : 0;

    if (mockItem) {
      items.push({ ...mockItem, cost: cost || mockItem.cost });
    } else {
      items.push({
        id: item.id,
        name: `item_${key}`,
        localizedNameZh: dname,
        localizedNameEn: dname,
        cost,
        isRecipe: dname.includes("Recipe"),
        isSecretShop: item.qual === "secret_shop",
        components: [],
        imageIcon: imgName,
        descriptionZh: item.lore || "",
        tier: null,
        isActive: true,
      });
    }
  }

  return items.length > 0 ? items : MOCK_ITEMS;
});

export async function getItemById(id: number, source: DataSource = "api") {
  const items = await getAllItems(source);
  return items.find((i) => i.id === id) ?? null;
}
