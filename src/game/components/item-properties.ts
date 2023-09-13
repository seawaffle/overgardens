import type { TargetingProperties } from ".";
import { SlotType } from "../data";

export interface ItemProperties {
  equippable: boolean;
  equipped?: true;
  droppedOnDeath: boolean;
  slotType?: SlotType;
  consumable?: boolean;
  dodgeValue?: number;
  damageReduction?: number;
  damage?: string;
  melee?: true;
  twoHanded?: true;
  natural?: true;
  targeting?: TargetingProperties;
}
