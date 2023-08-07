import { Color, Glyph, Vector2 } from "malwoden";
import { System } from "./system";
import { Game } from "../game";
import { Query, With } from "miniplex";
import { Entity } from "../components";
import * as Screens from "../screens";
import { Tile } from "../data";

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
      for (let x = 0; x < this.screenWidth; x++) {
        for (let y = 0; y < this.screenHeight; y++) {
          const displayPos = { x, y };
          const mapPos = { x: cameraCorner.x + x, y: cameraCorner.y + y };
          const explored = level.exploredTiles.get(mapPos)!;
          const visible = level.visibleTiles.get(mapPos)!;
          const tile = level.tiles.get(mapPos) || Tile.Nothing;
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
            this.game.render.draw(displayPos, new Glyph(tile.character, light));
          } else if (explored) {
            this.game.render.draw(displayPos, new Glyph(tile.character, dark));
          }
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
          const pos = this.transformToCameraCoords(position.pos);
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
