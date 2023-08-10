import { Color, Glyph, Vector2 } from "malwoden";
import { System } from "./system";
import { Game } from "../game";
import { Query, With } from "miniplex";
import { Entity } from "../components";
import * as Screens from "../screens";
import { Palette, Tile } from "../data";
import { hexToColor } from "../utils";

export class RenderSystem extends System {
  renderQuery: Query<With<Entity, "position" | "renderable">>;
  mainMenuScreen: Screens.MainMenuScreen;
  helpScreen: Screens.HelpScreen;
  escapeScreen: Screens.EscapeScreen;
  inventoryScreen: Screens.InventoryScreen;

  screenWidth: number;
  screenHeight: number;

  constructor(game: Game) {
    super(game);

    this.screenHeight = this.game.render.displayHeight;
    this.screenWidth = this.game.render.displayWidth;

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

  getCameraCorner(width: number, height: number): Vector2 {
    const playerPosition = this.game.player?.position?.pos;
    if (playerPosition === undefined) {
      return { x: 0, y: 0 };
    }
    const x = playerPosition.x - width / 2;
    const y = playerPosition.y - height / 2;
    return { x, y };
  }

  isInCamera(pos: Vector2) {
    const cameraCorner = this.getCameraCorner(
      this.screenWidth,
      this.screenHeight,
    );
    return (
      pos.x >= cameraCorner.x &&
      pos.x < cameraCorner.x + this.screenWidth &&
      pos.y >= cameraCorner.y &&
      pos.y < cameraCorner.y + this.screenHeight
    );
  }

  transformToCameraCoords(pos: Vector2) {
    const cameraCorner = this.getCameraCorner(
      this.screenWidth,
      this.screenHeight,
    );
    return { x: pos.x - cameraCorner.x, y: pos.y - cameraCorner.y };
  }

  renderTiles() {
    const level = this.game.map.getCurrentLevel();
    const cameraCorner = this.getCameraCorner(
      this.screenWidth,
      this.screenHeight,
    );
    if (level) {
      const blank = Tile.Nothing.color_dark;
      // const bg_blank = Tile.Nothing.bg_color_dark;
      for (let x = 0; x < this.screenWidth; x++) {
        for (let y = 0; y < this.screenHeight; y++) {
          const displayPos = { x, y };
          const mapPos = { x: cameraCorner.x + x, y: cameraCorner.y + y };
          const explored = level.exploredTiles.get(mapPos)!;
          const visible = level.visibleTiles.get(mapPos)!;
          const tile = level.tiles.get(mapPos) || Tile.Nothing;
          const colorLight = tile.color_light;
          const colorDark = tile.color_dark;
          // const bg_colorLight = tile.bg_color_light;
          // const bg_colorDark = tile.bg_color_dark;
          let color = blank;
          // let bg = bg_blank;
          if (visible) {
            color = colorLight
            // fg = fg_colorLight;
            // bg = bg_colorLight;
          } else if (explored) {
            color = colorDark
            // fg = fg_colorDark;
            // bg = bg_colorDark;
          }
          this.game.render.draw(displayPos, Glyph.fromCharCode(tile.character, color, color));
        }
      }
    }
  }

  renderEntities() {
    const level = this.game.map.getCurrentLevel();
    if (level) {
      for (const { position, renderable } of this.renderQuery) {
        if (
          level.visibleTiles.get(position.pos) &&
          this.isInCamera(position.pos)
        ) {
          const tile = level.tiles.get(position.pos);
          const pos = this.transformToCameraCoords(position.pos);
          let fg = Palette.GreyNurse;
          let bg = tile ? tile.color_light : Palette.Ebony;
          if (renderable.glyph.fg) {
            fg = hexToColor(renderable.glyph.fg);
          }
          if (renderable.glyph.bg) {
            bg = hexToColor(renderable.glyph.bg);
          }
          const glyph = new Glyph(renderable.glyph.character, fg, bg);
          this.game.render.draw(pos, glyph);
        }
      }
    }
  }

  renderWorld(): void {
    this.renderTiles();
    this.renderEntities();
  }
}
