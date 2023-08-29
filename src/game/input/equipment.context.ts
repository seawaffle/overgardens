import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";

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
          }
        } else if (this.game.slotToEquip) {
          switch (keyEvent.key) {
            case Input.KeyCode.Escape: {
              Actions.closeItemPicker(game);
              break;
            }
          }
        } else {
          switch (keyEvent.key) {
            case Input.KeyCode.Escape: {
              Actions.closeEquipment(game);
              break;
            }
          }
        }
      }
    });
  }
}
