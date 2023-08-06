import { Game } from "../game";
import { GameState } from "../game-state";
import { StateListener } from "../state-listener";

export class Screen implements StateListener {
  constructor(public game: Game) {
    this.game.gameState.registerListener(this);
  }

  notify(state: GameState) {
    console.log("base screen: " + state);
  }

  render() {}
}
