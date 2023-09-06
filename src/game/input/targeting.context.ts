import { Game } from "../game";
import { GameState } from "../data";
import { Input } from "malwoden";
import * as Actions from "../actions";

export class TargetingContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.Targeting) {
        switch (keyEvent.key) {
          case Input.KeyCode.Escape: {
            Actions.exitTargeting(game);
            break;
          }
          case Input.KeyCode.Numpad4:
          case Input.KeyCode.LeftArrow: {
            Actions.moveTargeting(game, { x: -1, y: 0 });
            break;
          }
          case Input.KeyCode.Numpad6:
          case Input.KeyCode.RightArrow: {
            Actions.moveTargeting(game, { x: 1, y: 0 });
            break;
          }
          case Input.KeyCode.Numpad8:
          case Input.KeyCode.UpArrow: {
            Actions.moveTargeting(game, { x: 0, y: -1 });
            break;
          }
          case Input.KeyCode.Numpad2:
          case Input.KeyCode.DownArrow: {
            Actions.moveTargeting(game, { x: 0, y: 1 });
            break;
          }
          case Input.KeyCode.Numpad1: {
            Actions.moveTargeting(game, { x: -1, y: 1 });
            break;
          }
          case Input.KeyCode.Numpad3: {
            Actions.moveTargeting(game, { x: 1, y: 1 });
            break;
          }
          case Input.KeyCode.Numpad7: {
            Actions.moveTargeting(game, { x: -1, y: -1 });
            break;
          }
          case Input.KeyCode.Numpad9: {
            Actions.moveTargeting(game, { x: 1, y: -1 });
            break;
          }
          case Input.KeyCode.Enter: {
            Actions.selectTarget(game);
            break;
          }
        }
      }
    });
  }
}
