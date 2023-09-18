export interface SpawnRange {
  minDifficulty: number;
  maxDifficulty: number;
  weight: number;
}
// export const CreatureTable: Map<string, SpawnRange> = new Map<
//   string,
//   SpawnRange
// >();
// // creatures
// CreatureTable.set("rat", { minDifficulty: 0, maxDifficulty: 4, weight: 5 });
// CreatureTable.set("ooze", { minDifficulty: 0, maxDifficulty: 5, weight: 2 });
// CreatureTable.set("goblin", { minDifficulty: 0, maxDifficulty: 5, weight: 2 });

export const ItemTable: Map<string, SpawnRange> = new Map<string, SpawnRange>();
// weapons
ItemTable.set("knife", { minDifficulty: 0, maxDifficulty: 4, weight: 1 });
ItemTable.set("short-sword", { minDifficulty: 1, maxDifficulty: 6, weight: 1 });
ItemTable.set("short-bow", { minDifficulty: 0, maxDifficulty: 6, weight: 1 });
ItemTable.set("great-sword", {
  minDifficulty: 4,
  maxDifficulty: 10,
  weight: 1,
});
// armor
ItemTable.set("clothes", { minDifficulty: 0, maxDifficulty: 4, weight: 2 });
ItemTable.set("leather-armor", {
  minDifficulty: 2,
  maxDifficulty: 8,
  weight: 1,
});
ItemTable.set("leather-helm", {
  minDifficulty: 0,
  maxDifficulty: 4,
  weight: 1,
});
