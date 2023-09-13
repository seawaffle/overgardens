import { type Entity } from "../components";
import { Palette, SlotType } from "../data";

export const Armor: Map<string, Entity> = new Map<string, Entity>();
Armor.set("clothes", {
  id: "",
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
  id: "",
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
  id: "",
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
