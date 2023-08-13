import { Query, With } from "miniplex";
import { Entity } from "../components";
import { System } from "./system";
import { Game } from "../game";
import { GameState } from "../data";
import { AI } from "../ai/ai";
import { AdjacentAI, MovementAI } from "../ai";

export class AISystem extends System {
  ais: AI[] = [new AdjacentAI(this.game), new MovementAI(this.game)];
  query: Query<With<Entity, "currentTurn">>;

  constructor(game: Game) {
    super(game);
    this.query = this.game.ecs.world.with("currentTurn").without("player");
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
          e.goal = undefined;
          break;
        }
      }
      this.game.ecs.world.removeComponent(e, "currentTurn");
    }
  }
}
