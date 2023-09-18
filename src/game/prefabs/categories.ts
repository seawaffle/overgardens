import { Weapons } from ".";
import type { Category } from "../data";

export const Categories: Map<string, Category> = new Map<string, Category>();
Categories.set("scout", {
  name: "Scout",
  addedDifficulty: 1,
  equipment: [Weapons.get("short-bow")!],
});
Categories.set("warrior", {
  name: "Warrior",
  addedDifficulty: 1,
  equipment: [Weapons.get("short-sword")!],
});
