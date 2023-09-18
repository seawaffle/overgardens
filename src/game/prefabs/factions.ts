import { Reaction } from "../data";

export const Factions: object = {
  player: {
    default: Reaction.Ignore,
  },
  mindless: {
    default: Reaction.Attack,
  },
  ratling: {
    default: Reaction.Attack,
    ratling: Reaction.Ignore,
    apekin: Reaction.Flee,
  },
  apekin: {
    default: Reaction.Attack,
    apekin: Reaction.Ignore,
  },
  human: {
    default: Reaction.Attack,
    human: Reaction.Ignore,
  },
};
