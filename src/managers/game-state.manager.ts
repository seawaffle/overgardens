import { Game } from "../game";
import { GameState } from "../game-state";
import { Manager } from "./manager";

export class GameStateManager extends Manager {
  state: GameState;

  constructor(game: Game) {
    super(game);

    this.state = GameState.Init;
  }
}