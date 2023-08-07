import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";

export class MainMenuContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyUp((keyEvent) => {
      if (this.game.gameState.state === GameState.MainMenu) {
        switch (keyEvent.key) {
          case Input.KeyCode.N: {
            Actions.newGame(game);
            break;
          }
          case Input.KeyCode.L: {
            Actions.loadGame(game);
            break;
          }
        }
      }
    });
  }
}
