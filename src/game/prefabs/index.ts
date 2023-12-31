import type { Entity } from "../components";
import { Armor } from "./armor";
import { Weapons } from "./weapons";

export * from "./weapons";
export * from "./categories";
export * from "./factions";
export * from "./armor";
export * from "./lineages";
export * from "./player";
export * from "./spawn-table";
export * from "./pantheon";
export * from "./altar";
export * from "./statuses";
export * from "./abilities";
export const AllItems: Map<string, Entity> = new Map<string, Entity>([
  ...Weapons,
  ...Armor,
]);
