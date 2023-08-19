import { Input } from "malwoden";
import { Game } from "../game";
import * as Actions from "../actions";

export class AdventureMouseContext extends Input.MouseContext {
  constructor(public game: Game) {
    super();

    this.onMouseDown((mouseEvent) => {
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
