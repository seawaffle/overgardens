import { Query, With } from "miniplex";
import { System } from "./system";
import { Entity } from "../components";
import { Game } from "../game";
import { GameState } from "../data";

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
      e.initiative -= 1;
      if (e.initiative < 1) {
        this.game.ecs.world.addComponent(e, "currentTurn", true);

        e.initiative = 6;

        if (e.player) {
          this.game.gameState.setState(GameState.AwaitingInput);
        }
      }
    }
  }
}
