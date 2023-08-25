import { Entity, SlotType } from "../components";
import { Palette } from "../data";

export const Knife: Entity = {
  name: "Knife",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: true,
    slotType: SlotType.Hand,
    consumable: false,
    damage: "1d4",
    melee: true,
  },
  renderable: {
    glyph: {
      character: "/",
      fg: Palette.GreyNurseHex,
    },
    renderOrder: 2,
  },
};

export const ShortSword: Entity = {
  name: "Short Sword",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: true,
    slotType: SlotType.Hand,
    consumable: false,
    damage: "1d6",
    melee: true,
  },
  renderable: {
    glyph: {
      character: "/",
      fg: Palette.GreyNurseHex,
    },
    renderOrder: 2,
  },
};

export const Fist: Entity = {
  name: "Fist",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: false,
    slotType: SlotType.Hand,
    consumable: false,
    damage: "1d4-1",
    melee: true,
  },
};

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
