import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";

export class EscapeContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.EscapeMenu) {
        switch (keyEvent.key) {
          case Input.KeyCode.Escape: {
            Actions.closeEscapeMenu(game);
            break;
          }
          case Input.KeyCode.S: {
            Actions.saveGame(game);
            break;
          }
          case Input.KeyCode.Q: {
            Actions.quitToMainMenu(game);
            break;
          }
        }
      }
    });
  }
}
