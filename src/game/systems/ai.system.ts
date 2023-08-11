import { Query, With } from "miniplex";
import { Entity } from "../components";
import { System } from "./system";
import { Game } from "../game";
import * as Actions from "../actions";
import { GameState } from "../data";

export class AISystem extends System {
  query: Query<With<Entity, "currentTurn" | "position">>;

  constructor(game: Game) {
    super(game);

    this.query = this.game.ecs.world
      .with("currentTurn", "position")
      .without("player");
  }

  update(): void {
    if (this.game.gameState.state !== GameState.Ticking) {
      return;
    }
    for (const e of this.query) {
      // random movement for now
      const roll = this.game.rng.nextInt(0, 5);
      const dest = { x: 0, y: 0 };
      switch (roll) {
        case 1: {
          dest.x += 1;
          break;
        }
        case 2: {
          dest.x -= 1;
          break;
        }
        case 3: {
          dest.y += 1;
          break;
        }
        case 4: {
          dest.y -= 1;
          break;
        }
        default: {
          break;
        }
      }
      Actions.tryMoveEntity(this.game, e, dest);
      this.game.ecs.world.removeComponent(e, "currentTurn");
    }
  }
}
