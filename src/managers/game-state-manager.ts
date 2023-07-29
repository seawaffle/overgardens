import { Game } from "../game";
import { Manager } from "./manager";

export enum GameState {
  Init = 1,
  MainMenu,
  AwaitingInput,
  PlayerTurn,
}
export class GameStateManager extends Manager {
  state: GameState;

  constructor(game: Game) {
    super(game);

    this.state = GameState.Init;
  }
}