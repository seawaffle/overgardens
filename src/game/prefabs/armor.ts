import { Entity, SlotType } from "../components";
import { Palette } from "../data";

export const Armor: Map<string, Entity> = new Map<string, Entity>();
Armor.set("clothes", {
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
});
Armor.set("leather-helm", {
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
});
Armor.set("leather-armor", {
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
});
