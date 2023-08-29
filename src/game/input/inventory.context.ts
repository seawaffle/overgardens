import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";
import { keyEventToIndex } from "../utils";

export class InventoryContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.Inventory) {
        // separate switch for item details
        if (this.game.itemToDescribe) {
          switch (keyEvent.key) {
            case Input.KeyCode.Escape: {
              Actions.closeItemDetails(game);
              break;
            }
            case Input.KeyCode.E: {
              Actions.equipItem(game, game.player!, game.itemToDescribe!);
              game.updateScreen = true;
              Actions.closeItemDetails(game);
              break;
            }
            case Input.KeyCode.D: {
              Actions.dropItem(game, game.player!, game.itemToDescribe!);
              game.updateScreen = true;
              Actions.closeItemDetails(game);
              break;
            }
          }
        } else {
          switch (keyEvent.key) {
            case Input.KeyCode.Escape: {
              Actions.closeInventory(game);
              break;
            }
            case Input.KeyCode.UpArrow: {
              Actions.scrollUpScreen(game);
              break;
            }
            case Input.KeyCode.DownArrow: {
              Actions.scrollDownScreen(
                game,
                game.player!.inventory!.items.length,
              );
              break;
            }
            default: {
              const index = keyEventToIndex(keyEvent);
              if (index >= 0 && index <= 52) {
                Actions.openItemDetails(
                  game,
                  game.player!.inventory!.items[index],
                );
              }
            }
          }
        }
      }
    });
  }
}
