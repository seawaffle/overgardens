import type { Query, With } from "miniplex";
import type { Entity } from "../components";
import { System } from "./system";
import type { Game } from "../game";
import { GameState, StatusFunctions } from "../data";

export class StatusSystem extends System {
  statusQuery: Query<With<Entity, "statuses">>;
  statusFunctions = new StatusFunctions();
  playerTurn = false;

  constructor(game: Game) {
    super(game);
    this.statusQuery = this.game.ecs.world.with("statuses");
  }

  update(): void {
    for (const e of this.statusQuery) {
      if (e.player) {
        if (this.game.gameState.state === GameState.AwaitingInput) {
          if (!this.playerTurn) {
            this.runStatuses(e);
            this.playerTurn = true;
          }
        } else if (this.game.gameState.state === GameState.Ticking) {
          this.playerTurn = false;
        }
      } else {
        if (e.currentTurn) {
          this.runStatuses(e);
        }
      }
    }
  }

  runStatuses(entity: Entity) {
    for (const status of entity.statuses!) {
      const func = this.statusFunctions.returnFunction(status.function);
      func(this.game, entity, status.args);
      status.duration--;
    }
  }
}
