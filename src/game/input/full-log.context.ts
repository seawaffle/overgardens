import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";

export class FullLogContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.FullLog) {
        switch (keyEvent.key) {
          case Input.KeyCode.Escape: {
            Actions.closeFullLog(game);
            break;
          }
          case Input.KeyCode.UpArrow: {
            Actions.scrollUpFullLog(game);
            break;
          }
          case Input.KeyCode.DownArrow: {
            Actions.scrollDownFullLog(game);
            break;
          }
        }
      }
    });
  }
}
