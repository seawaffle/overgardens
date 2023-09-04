import { Reaction } from "../data/faction";
import { Game } from "../game";
import { Manager } from "./manager";
import * as Prefabs from "../prefabs";
import type { Entity } from "../components";

export class FactionManager extends Manager {
  readonly DEFAULT = "default";
  factions: Map<string, Map<string, Reaction>>;

  constructor(game: Game) {
    super(game);
    const factionData = Prefabs.Factions;
    this.factions = new Map<string, Map<string, Reaction>>();
    for (const f of Object.entries(factionData)) {
      const name: string = f[0];
      const reactions = new Map<string, Reaction>(Object.entries(f[1]));
      this.factions.set(name, reactions);
    }
  }

  getReaction(me: Entity, target: Entity): Reaction {
    let myFaction = "mindless";
    if (me.faction) {
      myFaction = me.faction;
    }
    if (target.faction) {
      const myReactions = this.factions.get(myFaction)!;
      return myReactions.has(target.faction)
        ? myReactions.get(target.faction)!
        : myReactions.get(this.DEFAULT)!;
    }
    return Reaction.Ignore;
  }
}
