import { Input } from "malwoden";
import { Game } from "../game";
import * as Actions from "../actions";
import { GameState } from "../data";

export class AdventureMouseContext extends Input.MouseContext {
  constructor(public game: Game) {
    super();

    this.onMouseDown((mouseEvent) => {
      // if an extended action is happening, pressing a key should end it
      if (this.game.extendedActionSystem.hasAction()) {
        this.game.extendedActionSystem.endAction();
      }

      if (this.game.gameState.state === GameState.Ticking) {
        return;
      }
      const mapPos = this.game.render.convertMouseToMapPosition({
        x: mouseEvent.x,
        y: mouseEvent.y,
      });
      if (
        this.game.render.isInViewport(mapPos) &&
        this.game.gameState.state === GameState.AwaitingInput
      ) {
        this.game.extendedActionSystem.setAction(Actions.approach, [
          this.game,
          this.game.player,
          mapPos,
        ]);
      }
    });
  }
}
