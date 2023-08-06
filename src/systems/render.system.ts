import { Color, Glyph } from "malwoden";
import { System } from "./system";
import { Game } from "../game";
import { Query, With } from "miniplex";
import { Entity } from "../components";
import * as Screens from "../screens";

export class RenderSystem extends System {
  renderQuery: Query<With<Entity, "position" | "renderable">>;
  mainMenuScreen: Screens.MainMenuScreen;
  helpScreen: Screens.HelpScreen;
  escapeScreen: Screens.EscapeScreen;
  inventoryScreen: Screens.InventoryScreen;

  constructor(game: Game) {
    super(game);

    this.renderQuery = this.game.ecs.world.with("position", "renderable");
    this.mainMenuScreen = new Screens.MainMenuScreen(this.game);
    this.helpScreen = new Screens.HelpScreen(this.game);
    this.escapeScreen = new Screens.EscapeScreen(this.game);
    this.inventoryScreen = new Screens.InventoryScreen(this.game);
  }

  renderScreens() {
    this.mainMenuScreen.render();
    this.inventoryScreen.render();
    this.helpScreen.render();
    this.escapeScreen.render();
  }

  update(): void {
    this.renderWorld();
    this.renderScreens();
  }

  renderTiles() {
    const level = this.game.map.getCurrentLevel();
    if (level) {
      for (let x = 0; x < level.tiles.width; x++) {
        for (let y = 0; y < level.tiles.height; y++) {
          const v = { x, y };
          const explored = level.exploredTiles.get(v)!;
          const visible = level.visibleTiles.get(v)!;
          const tile = level.tiles.get(v)!;
          const light = new Color(
            tile.color_light.r,
            tile.color_light.g,
            tile.color_light.b,
          );
          const dark = new Color(
            tile.color_dark.r,
            tile.color_dark.g,
            tile.color_dark.b,
          );
          if (visible) {
            this.game.render.draw(v, new Glyph(tile.character, light));
          } else if (explored) {
            this.game.render.draw(v, new Glyph(tile.character, dark));
          }
        }
      }
    }
  }

  renderEntities() {
    for (const { position, renderable } of this.renderQuery) {
      let fg = Color.White;
      let bg = Color.Black;
      if (renderable.glyph.fg) {
        fg = new Color(
          renderable.glyph.fg.r,
          renderable.glyph.fg.g,
          renderable.glyph.fg.b,
        );
      }
      if (renderable.glyph.bg) {
        bg = new Color(
          renderable.glyph.bg.r,
          renderable.glyph.bg.g,
          renderable.glyph.bg.b,
        );
      }
      const glyph = new Glyph(renderable.glyph.character, fg, bg);
      this.game.render.draw(position.pos, glyph);
    }
  }

  renderWorld(): void {
    this.renderTiles();
    this.renderEntities();
  }
}
