import { Reaction } from "../data/faction";

export const Factions: Object = {
  player: {
    default: Reaction.Ignore,
  },
  mindless: {
    default: Reaction.Attack,
  },
  herbivores: {
    default: Reaction.Ignore,
    herbivores: Reaction.Ignore,
  },
};
