import { Input } from "malwoden";
import { Game } from "../game";
import * as Actions from "../actions";
import { GameState } from "../data";

export class AdventureMouseContext extends Input.MouseContext {
  constructor(public game: Game) {
    super();

    this.onMouseDown((mouseEvent) => {
      if (this.game.gameState.state !== GameState.AwaitingInput) {
        return;
      }
      const mapPos = this.game.render.convertMouseToMapPosition({
        x: mouseEvent.x,
        y: mouseEvent.y,
      });
      this.game.extendedActionSystem.setAction(Actions.approach, [
        this.game,
        this.game.player,
        mapPos,
      ]);
    });
  }
}
