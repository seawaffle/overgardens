import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data";
import * as Actions from "../actions";

export class CharacterContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();

    this.onAnyDown((keyEvent) => {
      if (this.game.gameState.state === GameState.Character) {
        switch (keyEvent.key) {
          case Input.KeyCode.Escape: {
            Actions.closeCharacterSheet(game);
            break;
          }
        }
      }
    });
  }
}
