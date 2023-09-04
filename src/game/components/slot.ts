import type { Entity } from ".";
import { SlotType } from "../data";

export interface Slot {
  name: string;
  type: SlotType;
  ableToEquipItems: boolean;
  equippedItem: Entity | undefined;
}
