import { Weapons } from ".";
import { type Entity } from "../components";
import { Palette, SlotType } from "../data";

export const Creatures: Map<string, Entity> = new Map<string, Entity>();
Creatures.set("rat", {
  id: "",
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
        equippedItem: { ...Weapons.get("bite")! },
      },
    ],
  },
});

Creatures.set("ooze", {
  id: "",
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
        name: "Pseudopod",
        type: SlotType.Hand,
        ableToEquipItems: true,
        equippedItem: { ...Weapons.get("fist")! },
      },
    ],
  },
});
