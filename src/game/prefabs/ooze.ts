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
    strength: 1,
    agility: 1,
    constitution: 1,
    intellect: 1,
    hp: 5,
    maxHp: 5,
  },
};
