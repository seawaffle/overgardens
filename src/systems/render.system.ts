import { Color, Glyph } from "malwoden";
import { System } from "./system";

export class RenderSystem extends System {
  update(): void {
    this.render();
  }

  render(): void {
    const level = this.game.map.getCurrentLevel();
    for (let x = 0; x < level.tiles.width; x++) {
      for (let y = 0; y < level.tiles.height; y++) {
        this.game.render.draw(
          { x, y },
          new Glyph(" ", Color.White, level.tiles.get({ x, y })?.color_light),
        );
      }
    }
  }
}
