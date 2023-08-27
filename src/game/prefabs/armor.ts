import { Entity, SlotType } from "../components";
import { Palette } from "../data";

export const Shirt: Entity = {
  name: "Clothes",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: true,
    slotType: SlotType.Body,
    dodgeValue: 1,
  },
  renderable: {
    glyph: {
      character: "(",
      fg: Palette.GreyNurseHex,
    },
    renderOrder: 2,
  },
};
export const LeatherHelm: Entity = {
  name: "Leather Helm",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: true,
    slotType: SlotType.Head,
    damageReduction: 1,
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
