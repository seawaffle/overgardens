import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";

export class AdventureContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      // if an extended action is happening, pressing a key should end it
      if (this.game.extendedActionSystem.hasAction()) {
        this.game.extendedActionSystem.endAction();
      }
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
          case Input.KeyCode.Numpad1: {
            Actions.tryMoveEntity(game, game.player, { x: -1, y: 1 });
            break;
          }
          case Input.KeyCode.Numpad3: {
            Actions.tryMoveEntity(game, game.player, { x: 1, y: 1 });
            break;
          }
          case Input.KeyCode.Numpad7: {
            Actions.tryMoveEntity(game, game.player, { x: -1, y: -1 });
            break;
          }
          case Input.KeyCode.Numpad9: {
            Actions.tryMoveEntity(game, game.player, { x: 1, y: -1 });
            break;
          }
          case Input.KeyCode.Comma: {
            if (keyEvent.shiftKey) {
              // open angle bracket
              Actions.changeLevel(game);
              break;
            }
            break;
          }
          case Input.KeyCode.Period: {
            if (keyEvent.shiftKey) {
              // close angle bracket
              Actions.changeLevel(game);
              break;
            }
            Actions.wait(game, game.player);
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
          case Input.KeyCode.X: {
            Actions.startExamine(game);
            break;
          }
          case Input.KeyCode.O: {
            Actions.autoExplore(game, game.player!);
            break;
          }
          case Input.KeyCode.L: {
            Actions.openFullLog(game);
            break;
          }
          case Input.KeyCode.E: {
            Actions.openEquipment(game);
            break;
          }
          case Input.KeyCode.C: {
            Actions.openCharacterSheet(game);
            break;
          }
          case Input.KeyCode.P: {
            Actions.pickUp(game, game.player!);
            break;
          }
          case Input.KeyCode.M: {
            Actions.autoAttack(game, game.player!);
            break;
          }
          case Input.KeyCode.W: {
            Actions.waitUntilHealed(game, game.player!);
            break;
          }
          case Input.KeyCode.K: {
            Actions.kneelAtAltar(game, game.player!);
            break;
          }
          case Input.KeyCode.A: {
            Actions.openAbilities(game);
            break;
          }
        }
      }
    });
  }
}
