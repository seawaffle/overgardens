import { Entity, SlotType } from "../components";
import { Palette } from "../data";
import { Fist } from ".";

export const Ooze: Entity = {
  name: "Ooze",
  renderable: {
    glyph: {
      character: "o",
      fg: Palette.KaitokeGreenHex,
    },
    renderOrder: 1,
  },
  blocksTile: true,
  mobile: true,
  viewshed: {
    range: 5,
    dirty: true,
  },
  faction: "mindless",
  initiative: 8,
  body: {
    damageReduction: 1,
    slots: [
      {
        name: "Head",
        type: SlotType.Head,
        ableToEquipItems: true,
        equippedItem: { ...Fist },
      },
    ],
  },
};
