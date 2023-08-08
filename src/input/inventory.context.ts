import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";

export class InventoryContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.Inventory) {
        switch (keyEvent.key) {
          case Input.KeyCode.Escape: {
            Actions.closeInventory(game);
            break;
          }
        }
      }
    });
  }
}
