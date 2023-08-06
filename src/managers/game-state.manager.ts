import { Game } from "../game";
import { GameState } from "../game-state";
import { StateListener } from "../state-listener";
import { Manager } from "./manager";

export class GameStateManager extends Manager {
  state: GameState;
  listeners: StateListener[];

  constructor(game: Game) {
    super(game);
    this.listeners = [];
    this.state = GameState.Init;
  }

  registerListener(listener: StateListener) {
    this.listeners.push(listener);
  }

  notifyListeners() {
    for (const l of this.listeners) {
      l.notify(this.state);
    }
  }

  setState(state: GameState) {
    this.state = state;
    this.notifyListeners();
  }
}
