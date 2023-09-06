import type { Query, With } from "miniplex";
import type { Entity } from "../components";
import { System } from "./system";
import type { Game } from "../game";
import { GameState, StatusFunctions } from "../data";

export class CooldownSystem extends System {
  abilityQuery: Query<With<Entity, "abilities">>;
  statusFunctions = new StatusFunctions();
  playerTurn = false;

  constructor(game: Game) {
    super(game);
    this.abilityQuery = this.game.ecs.world.with("abilities");
  }

  update(): void {
    for (const e of this.abilityQuery) {
      if (e.player) {
        if (this.game.gameState.state === GameState.AwaitingInput) {
          if (!this.playerTurn) {
            this.adjustCooldowns(e);
            this.playerTurn = true;
          }
        } else if (this.game.gameState.state === GameState.Ticking) {
          this.playerTurn = false;
        }
      } else {
        if (e.currentTurn) {
          this.adjustCooldowns(e);
        }
      }
    }
  }

  adjustCooldowns(entity: Entity) {
    for (const ability of entity.abilities!) {
      if (ability.turnsLeft > 0) {
        ability.turnsLeft--;
      }
    }
  }
}
