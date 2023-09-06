import type { Entity } from "../components";
import type { Game } from "../game";

export class StatusFunctions {
  returnFunction(name: any) {
    const func: keyof StatusFunctions = name;
    return this[func];
  }

  hunger(game: Game, entity: Entity, args: string[]) {
    let turnsUntilHunger = parseInt(args[0]);
    const minTurns = args[1];
    const maxTurns = args[2];
    // subtract current turn
    turnsUntilHunger--;
    if (turnsUntilHunger <= 0) {
      // hunger activates
      console.log("hunger begins");
      turnsUntilHunger = game.rng.nextInt(
        parseInt(minTurns),
        parseInt(maxTurns),
      );
    }
    const status = entity.statuses!.find(
      (status) => status.function === "hunger",
    )!;
    status.args = [turnsUntilHunger.toString(), minTurns, maxTurns];
  }

  shadowMerge(_game: Game, _entity: Entity, _args: string[]) {
    // dummy
  }
}
