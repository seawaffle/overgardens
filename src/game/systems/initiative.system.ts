import { Query, type With } from "miniplex";
import { System } from "./system";
import type { Entity } from "../components";
import { Game } from "../game";
import { GameState } from "../data";
import { distanceFromPosition } from "../utils";

export class InitiativeSystem extends System {
  initiativeQuery: Query<With<Entity, "initiative" | "position">>;

  constructor(game: Game) {
    super(game);

    this.initiativeQuery = this.game.ecs.world.with("initiative", "position");
  }

  update() {
    if (this.game.gameState.state !== GameState.Ticking) {
      return;
    }

    for (const e of this.initiativeQuery) {
      if (
        distanceFromPosition(this.game.player!.position!, e.position) >
        this.game.player!.viewshed!.range
      ) {
        continue;
      }
      e.initiative -= 1;
      if (e.initiative < 1) {
        e.initiative = 6;
        if (e.player) {
          this.game.gameState.setState(GameState.AwaitingInput);
        } else {
          this.game.ecs.world.addComponent(e, "currentTurn", true);
        }
      }
    }
  }
}
