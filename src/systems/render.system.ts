import { Color, Glyph } from "malwoden";
import { System } from "./system";
import { Game } from "../game";
import { Query, With } from "miniplex";
import { Entity } from "../components";


export class RenderSystem extends System {
  renderEntities: Query<With<Entity, 'position' | 'renderable'>>;

  constructor(game: Game) {
    super(game);

    this.renderEntities = this.game.ecs.world.with('position', 'renderable');
  }
  
  update(): void {
    this.render();
  }

  render(): void {
    const level = this.game.map.getCurrentLevel();
    for (let x = 0; x < level.tiles.width; x++) {
      for (let y = 0; y < level.tiles.height; y++) {
        this.game.render.draw({x, y}, new Glyph(' ', Color.White, level.tiles.get({x, y})?.color_light));
      }
    }
    for (const { position, renderable } of this.renderEntities) {
      this.game.render.draw(position.pos, renderable.glyph);
    }
  }
}