import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";

export class GameOverContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.GameOver) {
        switch (keyEvent.key) {
          case Input.KeyCode.Q:
          case Input.KeyCode.Escape: {
            Actions.gameOver(game);
            break;
          }
          default: {
            break;
          }
        }
      }
    });
  }
}
