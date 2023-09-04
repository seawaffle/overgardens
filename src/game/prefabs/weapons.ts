import { type Entity } from "../components";
import { Palette, SlotType } from "../data";

export const Weapons: Map<string, Entity> = new Map<string, Entity>();
Weapons.set("knife", {
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
});

Weapons.set("short-sword", {
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
});

Weapons.set("fist", {
  name: "Fist",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: false,
    slotType: SlotType.Hand,
    consumable: false,
    damage: "1d4-1",
    melee: true,
    natural: true,
  },
});

Weapons.set("bite", {
  name: "Bite",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: false,
    slotType: SlotType.Head,
    consumable: false,
    damage: "1d4-1",
    melee: true,
    natural: true,
  },
});
