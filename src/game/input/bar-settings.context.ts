import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";
import { keyEventToIndex } from "../utils";

export class BarSettingsContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.BarSettings) {
        // separate switch for ability select
        if (this.game.abilityBar.keyToSet) {
          switch (keyEvent.key) {
            case Input.KeyCode.Escape: {
              this.game.abilityBar.keyToSet = undefined;
              break;
            }
            default: {
              const index = keyEventToIndex(keyEvent);
              if (index >= 0 && index <= 52) {
                this.game.abilityBar.setAbility(
                  this.game.abilityBar.keyToSet!,
                  index,
                );
                this.game.updateScreen = true;
              }
            }
          }
        } else {
          switch (keyEvent.key) {
            case Input.KeyCode.Escape: {
              Actions.closeBarSettings(game);
              break;
            }
            case Input.KeyCode.One:
            case Input.KeyCode.Two:
            case Input.KeyCode.Three:
            case Input.KeyCode.Four:
            case Input.KeyCode.Five:
            case Input.KeyCode.Six:
            case Input.KeyCode.Seven:
            case Input.KeyCode.Eight:
            case Input.KeyCode.Nine:
            case Input.KeyCode.Zero: {
              this.game.abilityBar.keyToSet = keyEvent.key;
              break;
            }
          }
        }
      }
    });
  }
}
