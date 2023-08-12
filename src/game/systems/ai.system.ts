import { Query, With } from "miniplex";
import { Entity } from "../components";
import { System } from "./system";
import { Game } from "../game";
import { GameState } from "../data";
import { AI } from "../ai/ai";
import { MovementAI } from "../ai/movement.ai";

export class AISystem extends System {
  ais: AI[] = [];
  query: Query<With<Entity, "currentTurn" | "position">>;

  constructor(game: Game) {
    super(game);
    this.ais.push(new MovementAI(game));
    this.query = this.game.ecs.world
      .with("currentTurn", "position")
      .without("player");
  }

  update(): void {
    if (this.game.gameState.state !== GameState.Ticking) {
      return;
    }
    for (const e of this.query) {
      // evaluate goals
      for (const ai of this.ais) {
        ai.run(e);
        if (e.goal) {
          e.goal.run(e);
          break;
        }
      }
      this.game.ecs.world.removeComponent(e, "currentTurn");
    }
  }
}
