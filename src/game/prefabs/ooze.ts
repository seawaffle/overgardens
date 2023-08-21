import { Entity } from "../components";
import { Palette } from "../data";

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
    might: {base: 1, modifier: 0, bonus: 0},
    agility: {base: 1, modifier: 0, bonus: 0},
    stability: {base: 1, modifier: 0, bonus: 0},
    intellect: {base: 1, modifier: 0, bonus: 0},
    hp: 5,
    maxHp: 5,
  },
};
