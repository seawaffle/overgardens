import { Input } from "malwoden";
import { Game } from "../game";
import { GameState } from "../game-state";

export class AdventureContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();
    this.onAnyUp((keyEvent) => {
      if (this.game.gameState.state !== GameState.AwaitingInput) {
        switch (keyEvent.key) {
          case Input.KeyCode.LeftArrow: {
            break;
          }
        }
      }
    });
  }

}
