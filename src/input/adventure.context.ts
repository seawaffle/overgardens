import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../game-state";
import * as Actions from "../actions";

export class AdventureContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyUp((keyEvent) => {
      if (this.game.gameState.state === GameState.AwaitingInput) {
        switch (keyEvent.key) {
          case Input.KeyCode.Numpad4:
          case Input.KeyCode.LeftArrow: {
            Actions.tryMoveEntity(game, game.player, { x: -1, y: 0 });
            break;
          }
          case Input.KeyCode.Numpad6:
          case Input.KeyCode.RightArrow: {
            Actions.tryMoveEntity(game, game.player, { x: 1, y: 0 });
            break;
          }
          case Input.KeyCode.Numpad8:
          case Input.KeyCode.UpArrow: {
            Actions.tryMoveEntity(game, game.player, { x: 0, y: -1 });
            break;
          }
          case Input.KeyCode.Numpad2:
          case Input.KeyCode.DownArrow: {
            Actions.tryMoveEntity(game, game.player, { x: 0, y: 1 });
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
          case Input.KeyCode.Escape: {
            Actions.openEscapeMenu(game);
            break;
          }
        }
      }
    });
  }
}
