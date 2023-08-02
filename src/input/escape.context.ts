import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../game-state";
import * as Actions from "../actions";

export class EscapeContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyUp((keyEvent) => {
      if (this.game.gameState.state === GameState.EscapeMenu) {
        switch (keyEvent.key) {
          case Input.KeyCode.Escape: {
            Actions.closeEscapeMenu(game);
            break;
          }
        }
      }
    });
  }
}
