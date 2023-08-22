import { Entity, SlotType } from "../components";

export const Fist: Entity = {
  name: "Fist",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: false,
    slotType: SlotType.Hand,
    consumable: false,
    damage: "1d4",
    melee: true,
  },
};
