import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";
import { keyEventToIndex } from "../utils";

export class PickupContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.Pickup) {
        switch (keyEvent.key) {
          case Input.KeyCode.Escape: {
            Actions.closePickup(game);
            break;
          }
          case Input.KeyCode.Enter: {
            Actions.pickUpMultiple(this.game, this.game.player!);
            Actions.closePickup(this.game);
            break;
          }
          default: {
            const index = keyEventToIndex(keyEvent);
            if (this.game.toBePickedUp && index >= 0 && index <= 52) {
              this.game.toBePickedUp[index] = !this.game.toBePickedUp[index];
              this.game.updateScreen = true;
            }
          }
        }
      }
    });
  }
}
