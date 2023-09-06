import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";
import { keyEventToIndex } from "../utils";

export class AbilityContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.Abilities) {
        switch (keyEvent.key) {
          case Input.KeyCode.Escape: {
            Actions.closeAbilities(game);
            break;
          }
          default: {
            const index = keyEventToIndex(keyEvent);
            if (index >= 0 && index <= 52) {
              Actions.activateAbility(
                game,
                game.player!,
                game.player!.abilities![index],
              );
            }
          }
        }
      }
    });
  }
}
