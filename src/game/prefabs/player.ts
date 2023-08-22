import { Fist } from ".";
import { Entity, SlotType } from "../components";

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
    might: { base: 12, modifier: 0, bonus: 0 },
    agility: { base: 12, modifier: 0, bonus: 0 },
    stability: { base: 12, modifier: 0, bonus: 0 },
    intellect: { base: 12, modifier: 0, bonus: 0 },
    hp: { current: 30, max: 30 },
    slots: [
      {
        name: "Head",
        type: SlotType.Head,
        ableToEquipItems: true,
        equippedItem: undefined,
      },
      {
        name: "Body",
        type: SlotType.Body,
        ableToEquipItems: true,
        equippedItem: undefined,
      },
      {
        name: "Feet",
        type: SlotType.Feet,
        ableToEquipItems: true,
        equippedItem: undefined,
      },
      {
        name: "Gloves",
        type: SlotType.Gloves,
        ableToEquipItems: true,
        equippedItem: undefined,
      },
      {
        name: "Right Hand",
        type: SlotType.Hand,
        ableToEquipItems: true,
        equippedItem: { ...Fist },
      },
      {
        name: "Left Hand",
        type: SlotType.Hand,
        ableToEquipItems: true,
        equippedItem: { ...Fist },
      },
    ],
  },
  inventory: { items: [] },
};
