import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";
import { keyEventToIndex } from "../utils";

export class EquipmentContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.Equipment) {
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
            case Input.KeyCode.U: {
              Actions.unequipItem(game, game.player!, game.itemToDescribe!);
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
        } else if (this.game.slotToEquip) {
          switch (keyEvent.key) {
            case Input.KeyCode.Escape: {
              Actions.closeItemPicker(game);
              break;
            }
            default: {
              const index = keyEventToIndex(keyEvent);
              if (index >= 0 && index <= 52) {
                Actions.equipItem(
                  game,
                  game.player!,
                  game.player!.inventory!.items[index],
                  game.slotToEquip,
                );
                game.updateScreen = true;
                Actions.closeItemPicker(game);
              }
            }
          }
        } else {
          switch (keyEvent.key) {
            case Input.KeyCode.Escape: {
              Actions.closeEquipment(game);
              break;
            }
            default: {
              const index = keyEventToIndex(keyEvent);
              if (index >= 0 && index <= game.player!.body!.slots!.length) {
                const slot = game.player!.body!.slots![index];
                if (
                  slot.equippedItem &&
                  !slot.equippedItem!.itemProperties!.natural
                ) {
                  Actions.openItemDetails(this.game, slot.equippedItem);
                } else {
                  Actions.openItemPicker(this.game, slot);
                }
              }
            }
          }
        }
      }
    });
  }
}
