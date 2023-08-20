import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";

export class ContextMenuContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.ContextMenu) {
        switch (keyEvent.key) {
          case Input.KeyCode.Escape: {
            Actions.closeContextMenu(game);
            break;
          }
          case Input.KeyCode.I: {
            Actions.openInventory(game);
            break;
          }
          case Input.KeyCode.ForwardSlash: {
            if (keyEvent.shiftKey) {
                Actions.openHelp(game);
            }
            break;
          }
        }
      }
    });
  }
}
