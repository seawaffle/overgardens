import { SlotType } from ".";

export interface ItemProperties {
  equippable: boolean;
  equipped?: true;
  droppedOnDeath: boolean;
  slotType?: SlotType;
  consumable?: boolean;
  dodgeValue?: number;
  armorReduction?: number;
  damage?: string;
  melee?: true;
  twoHanded?: true;
}
