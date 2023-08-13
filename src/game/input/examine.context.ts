import { Game } from "../game";
import { GameState } from "../data";
import { Input } from "malwoden";
import * as Actions from "../actions";

export class ExamineContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.Examine) {
        switch (keyEvent.key) {
          case Input.KeyCode.Escape: {
            Actions.exitExamine(game);
            break;
          }
          case Input.KeyCode.Numpad4:
          case Input.KeyCode.LeftArrow: {
            Actions.moveExamine(game, { x: -1, y: 0 });
            break;
          }
          case Input.KeyCode.Numpad6:
          case Input.KeyCode.RightArrow: {
            Actions.moveExamine(game, { x: 1, y: 0 });
            break;
          }
          case Input.KeyCode.Numpad8:
          case Input.KeyCode.UpArrow: {
            Actions.moveExamine(game, { x: 0, y: -1 });
            break;
          }
          case Input.KeyCode.Numpad2:
          case Input.KeyCode.DownArrow: {
            Actions.moveExamine(game, { x: 0, y: 1 });
            break;
          }
        }
      }
    });
  }
}
