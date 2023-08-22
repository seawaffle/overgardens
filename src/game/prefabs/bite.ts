import { Entity, SlotType } from "../components";

export const Bite: Entity = {
  name: "Bite",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: false,
    slotType: SlotType.Head,
    consumable: false,
    damage: "1d4-1",
    melee: true,
  },
};
