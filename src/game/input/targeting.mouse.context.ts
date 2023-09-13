import { Input } from "malwoden";
import { Game } from "../game";
import * as Actions from "../actions";

export class TargetingMouseContext extends Input.MouseContext {
  constructor(public game: Game) {
    super();

    this.onMouseDown((mouseEvent) => {
      const mapPos = this.game.render.convertMouseToMapPosition({
        x: mouseEvent.x,
        y: mouseEvent.y,
      });
      if (!this.game.targetPosition) {
        return;
      }
      if (
        mapPos.x === this.game.targetPosition.x &&
        mapPos.y === this.game.targetPosition.y
      ) {
        Actions.selectTarget(game);
      } else {
        Actions.moveTargeting(this.game, mapPos, true);
      }
    });
  }
}
