import { type Entity } from "../components";
import { Palette, SlotType } from "../data";

export const Weapons: Map<string, Entity> = new Map<string, Entity>();
Weapons.set("knife", {
  id: "",
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
  id: "",
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
Weapons.set("great-sword", {
  id: "",
  name: "Great Sword",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: true,
    slotType: SlotType.Hand,
    consumable: false,
    damage: "1d12",
    melee: true,
    twoHanded: true,
  },
  renderable: {
    glyph: {
      character: "/",
      fg: Palette.ChileanFireHex,
    },
    renderOrder: 2,
  },
});

Weapons.set("fist", {
  id: "",
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
  id: "",
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

Weapons.set("short-bow", {
  id: "",
  name: "Short Bow",
  mobile: false,
  itemProperties: {
    equippable: true,
    droppedOnDeath: true,
    slotType: SlotType.Hand,
    consumable: false,
    damage: "1d6",
    twoHanded: true,
    targeting: { range: 6, radius: 0 },
  },
  renderable: {
    glyph: {
      character: "|",
      fg: Palette.GreyNurseHex,
    },
    renderOrder: 2,
  },
});
