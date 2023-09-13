import type { Ability } from "../components";

export const Abilities = new Map<string, Ability>();
Abilities.set("puppeteer", {
  name: "Puppeteer",
  function: "puppeteer",
  args: [],
  description: "",
  turnsLeft: 100,
  cooldownAmount: 100,
  targetingProperties: { range: 5, radius: 0 },
});
Abilities.set("shadowMerge", {
  name: "Shadow Merge",
  function: "shadowMerge",
  args: [],
  description: "",
  turnsLeft: 50,
  cooldownAmount: 50,
});

Abilities.set("rangedAttack", {
  name: "",
  function: "rangedAttack",
  args: [],
  description: "",
  turnsLeft: 0,
  cooldownAmount: 0,
});
