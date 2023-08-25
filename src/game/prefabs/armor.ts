import { Entity, SlotType } from "../components";
import { Palette } from "../data";

export const Shirt: Entity = {
  name: "Shirt",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: true,
    slotType: SlotType.Body,
  },
  renderable: {
    glyph: {
      character: "(",
      fg: Palette.GreyNurseHex,
    },
    renderOrder: 2,
  },
};
export const Pants: Entity = {
  name: "Pants",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: true,
  },
  renderable: {
    glyph: {
      character: "(",
      fg: Palette.GreyNurseHex,
    },
    renderOrder: 2,
  },
};
export const LeatherArmor: Entity = {
  name: "Leather Armor",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: true,
    slotType: SlotType.Body,
    damageReduction: 1,
  },
  renderable: {
    glyph: {
      character: "[",
      fg: Palette.ToscaHex,
    },
    renderOrder: 2,
  },
};
