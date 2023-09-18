import { Armor, Categories, Weapons } from ".";
import { SlotType, type Lineage, Palette } from "../data";

export const Lineages: Map<string, Lineage> = new Map<string, Lineage>();
Lineages.set("human", {
  name: "Human",
  categories: [Categories.get("scout")!, Categories.get("warrior")!],
  minDifficulty: 0,
  faction: "human",
  baseStats: {
    might: 10,
    agility: 10,
    stability: 10,
    intellect: 10,
  },
  usesEquipment: true,
  equipment: [Weapons.get("knife")!, Armor.get("clothes")!],
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
      name: "Right Hand",
      type: SlotType.Hand,
      ableToEquipItems: true,
      equippedItem: { ...Weapons.get("fist")! },
    },
    {
      name: "Left Hand",
      type: SlotType.Hand,
      ableToEquipItems: true,
      equippedItem: { ...Weapons.get("fist")! },
    },
    {
      name: "Feet",
      type: SlotType.Feet,
      ableToEquipItems: true,
      equippedItem: undefined,
    },
  ],
  renderable: {
    glyph: {
      character: "i",
      fg: Palette.GreyNurseHex,
    },
    renderOrder: 1,
  },
});
Lineages.set("ratling", {
  name: "Ratling",
  categories: [Categories.get("scout")!, Categories.get("warrior")!],
  minDifficulty: 0,
  faction: "ratling",
  baseStats: {
    might: 8,
    agility: 14,
    stability: 8,
    intellect: 10,
  },
  usesEquipment: true,
  equipment: [Weapons.get("knife")!, Armor.get("clothes")!],
  slots: [
    {
      name: "Head",
      type: SlotType.Head,
      ableToEquipItems: true,
      equippedItem: { ...Weapons.get("bite")! },
    },
    {
      name: "Body",
      type: SlotType.Body,
      ableToEquipItems: true,
      equippedItem: undefined,
    },
    {
      name: "Right Hand",
      type: SlotType.Hand,
      ableToEquipItems: true,
      equippedItem: { ...Weapons.get("fist")! },
    },
    {
      name: "Left Hand",
      type: SlotType.Hand,
      ableToEquipItems: true,
      equippedItem: { ...Weapons.get("fist")! },
    },
    {
      name: "Feet",
      type: SlotType.Feet,
      ableToEquipItems: true,
      equippedItem: undefined,
    },
  ],
  renderable: {
    glyph: {
      character: "r",
      fg: Palette.GreyNurseHex,
    },
    renderOrder: 1,
  },
});
Lineages.set("apekin", {
  name: "Apekin",
  categories: [Categories.get("warrior")!],
  minDifficulty: 0,
  faction: "apekin",
  baseStats: {
    might: 14,
    agility: 8,
    stability: 10,
    intellect: 8,
  },
  usesEquipment: true,
  equipment: [],
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
      name: "Right Hand",
      type: SlotType.Hand,
      ableToEquipItems: true,
      equippedItem: { ...Weapons.get("fist")! },
    },
    {
      name: "Left Hand",
      type: SlotType.Hand,
      ableToEquipItems: true,
      equippedItem: { ...Weapons.get("fist")! },
    },
    {
      name: "Feet",
      type: SlotType.Feet,
      ableToEquipItems: true,
      equippedItem: undefined,
    },
  ],
  renderable: {
    glyph: {
      character: "A",
      fg: Palette.KormaHex,
    },
    renderOrder: 1,
  },
});
Lineages.set("ooze", {
  name: "Ooze",
  categories: [],
  minDifficulty: 0,
  faction: "mindless",
  baseStats: {
    might: 8,
    agility: 8,
    stability: 16,
    intellect: 8,
  },
  usesEquipment: false,
  equipment: [],
  slots: [
    {
      name: "Body",
      type: SlotType.Body,
      ableToEquipItems: false,
      equippedItem: undefined,
    },
    {
      name: "Pseudopod",
      type: SlotType.Hand,
      ableToEquipItems: false,
      equippedItem: { ...Weapons.get("fist")! },
    },
  ],
  renderable: {
    glyph: {
      character: "o",
      fg: Palette.KaitokeGreenHex,
    },
    renderOrder: 1,
  },
});
