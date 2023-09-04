import { Reaction } from "../data";

export const Factions: object = {
  player: {
    default: Reaction.Ignore,
  },
  mindless: {
    default: Reaction.Attack,
  },
  herbivores: {
    default: Reaction.Flee,
    herbivores: Reaction.Ignore,
  },
};
