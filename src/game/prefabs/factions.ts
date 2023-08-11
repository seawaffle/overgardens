import { Faction, Reaction } from "../data/faction";

export const Factions: Faction[] = [
  { name: "player", views: new Map<string, Reaction>() },
  {
    name: "mindless",
    views: new Map<string, Reaction>().set("default", Reaction.Attack),
  },
  {
    name: "herbivores",
    views: new Map<string, Reaction>().set("default", Reaction.Ignore),
  },
];
