import { Entity, SlotType } from "../components";
import { Palette } from "../data";
import { Bite } from ".";

export const Rat: Entity = {
  name: "Rat",
  renderable: {
    glyph: {
      character: "r",
      fg: Palette.GeyserHex,
    },
    renderOrder: 1,
  },
  blocksTile: true,
  mobile: true,
  viewshed: {
    range: 5,
    dirty: true,
  },
  faction: "herbivores",
  initiative: 2,
  body: {
    might: { base: 8, modifier: 0, bonus: 0 },
    agility: { base: 16, modifier: 0, bonus: 0 },
    stability: { base: 6, modifier: 0, bonus: 0 },
    dodgeValue: 12,
    slots: [
      {
        name: "Head",
        type: SlotType.Head,
        ableToEquipItems: true,
        equippedItem: { ...Bite },
      },
    ],
  },
};
