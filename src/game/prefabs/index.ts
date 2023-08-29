import { Entity } from "../components";
import { Armor } from "./armor";
import { Weapons } from "./weapons";

export * from "./weapons";
export * from "./factions";
export * from "./armor";
export * from "./entities";
export * from "./player";
export * from "./spawn-table";
export * from "./altar";
export const AllItems: Map<string, Entity> = new Map<string, Entity>([
  ...Weapons,
  ...Armor,
]);
