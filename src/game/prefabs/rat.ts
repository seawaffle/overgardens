import { Entity } from "../components";
import { Palette } from "../data";

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
    might: { base: 1, modifier: 0, bonus: 0 },
    agility: { base: 1, modifier: 0, bonus: 0 },
    stability: { base: 1, modifier: 0, bonus: 0 },
    intellect: { base: 1, modifier: 0, bonus: 0 },
    hp: 5,
    maxHp: 5,
  },
};
