import { Entity } from ".";

export enum SlotType {
  Head,
  Body,
  Feet,
  Gloves,
  Hand,
}

export interface Slot {
  name: string;
  type: SlotType;
  ableToEquipItems: boolean;
  equippedItem: Entity | undefined;
}
