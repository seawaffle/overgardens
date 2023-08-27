import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";

export class EquipmentContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.Equipment) {
        switch (keyEvent.key) {
          case Input.KeyCode.Escape: {
            if (this.game.itemToDescribe) {
              Actions.closeItemDetails(game);
            } else {
              Actions.closeEquipment(game);
            }
            break;
          }
        }
      }
    });
  }
}
