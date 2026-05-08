import { cache } from "react";
import type { ItemData } from "@/types/dota";
import type { DataSource } from "./types";
import { fetchItems } from "./opendota";
import { MOCK_ITEMS } from "@/lib/mock-data";

export const getAllItems = cache(async (source: DataSource = "api") => {
  if (source === "mock") {
    return MOCK_ITEMS;
  }

  const data = await fetchItems();
  if (!data) return MOCK_ITEMS;

  // Map OpenDota constants to our ItemData format
  // Only include items that exist in our mock data (has Chinese name + description)
  const items: ItemData[] = [];
  for (const [key, val] of Object.entries(data)) {
    if (typeof val !== "object" || !val || !("id" in val)) continue;
    const item = val as { id: number; name: string; cost: number; recipe: number };
    if (!item.id || !item.name || item.name.startsWith("recipe_")) continue;

    // Find matching mock item for Chinese name
    const mockItem = MOCK_ITEMS.find((m) => m.name === `item_${item.name}`);
    if (mockItem) {
      items.push({ ...mockItem, cost: item.cost });
    } else {
      items.push({
        id: item.id,
        name: `item_${item.name}`,
        localizedNameZh: item.name
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        localizedNameEn: item.name,
        cost: item.cost,
        isRecipe: item.recipe === 1,
        isSecretShop: false,
        components: [],
        imageIcon: item.name,
        descriptionZh: "",
        tier: null,
        isActive: true,
      });
    }
  }

  return items;
});

export async function getItemById(id: number, source: DataSource = "api") {
  const items = await getAllItems(source);
  return items.find((i) => i.id === id) ?? null;
}
