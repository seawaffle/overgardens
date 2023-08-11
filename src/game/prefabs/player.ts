import { Entity } from "../components";

export const Player: Entity = {
  name: "Player",
  renderable: {
    glyph: {
      character: "@",
      fg: "yellow",
    },
    renderOrder: 1,
  },
  blocksTile: true,
  player: true,
  mobile: true,
  viewshed: {
    range: 20,
    dirty: true,
  },
  initiative: 0,
  body: {
    strength: 1,
    agility: 1,
    constitution: 1,
    intellect: 1,
    hp: 30,
    maxHp: 30,
  }
};
