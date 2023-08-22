import { Entity } from "../components";

export const Player: Entity = {
  name: "Player",
  renderable: {
    glyph: {
      character: "@",
      fg: "yellow", //deviate from palette for visibility?
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
  faction: "player",
  initiative: 0,
  body: {
    might: { base: 1, modifier: 0, bonus: 0 },
    agility: { base: 1, modifier: 0, bonus: 0 },
    stability: { base: 1, modifier: 0, bonus: 0 },
    intellect: { base: 1, modifier: 0, bonus: 0 },
    hp: { current: 30, max: 30 },
  },
  inventory: { items: [] },
};
