import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";

export class HelpContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.HelpScreen) {
        switch (keyEvent.key) {
          case Input.KeyCode.Escape: {
            Actions.closeHelp(game);
            break;
          }
        }
      }
    });
  }
}
