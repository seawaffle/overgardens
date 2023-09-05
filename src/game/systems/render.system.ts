import { Glyph } from "malwoden";
import { System } from "./system";
import { Game } from "../game";
import { Query, type With } from "miniplex";
import type { Entity } from "../components";
import * as Screens from "../screens";
import { GameState, Palette, Tile } from "../data";
import { hexToColor } from "../utils";
import { Screen } from "../screens";

export class RenderSystem extends System {
  renderQuery: Query<With<Entity, "position" | "renderable">>;
  screens: Screen[] = [
    new Screens.HUDScreen(this.game),
    new Screens.LogScreen(this.game),
    // new Screens.ActionBarScreen(this.game),
    new Screens.MainMenuScreen(this.game),
    new Screens.HelpScreen(this.game),
    new Screens.EscapeScreen(this.game),
    new Screens.InventoryScreen(this.game),
    new Screens.GameOverScreen(this.game),
    new Screens.ContextMenuScreen(this.game),
    new Screens.FullLogScreen(this.game),
    new Screens.CharacterScreen(this.game),
    new Screens.EquipmentScreen(this.game),
    new Screens.ItemOptionsScreen(this.game),
    new Screens.ItemPickerScreen(this.game),
    new Screens.CommunionScreen(this.game),
  ];

  screenWidth: number;
  screenHeight: number;

  constructor(game: Game) {
    super(game);

    this.screenHeight = this.game.render.viewportHeight;
    this.screenWidth = this.game.render.viewportWidth;

    this.renderQuery = this.game.ecs.world.with("position", "renderable");
  }

  renderScreens() {
    for (const screen of this.screens) {
      screen.render();
    }
  }

  update(): void {
    this.renderWorld();
    this.renderScreens();
  }

  renderTiles() {
    const level = this.game.map.getCurrentLevel();
    if (level) {
      const blank = Tile.Nothing.bg_color_dark;
      for (let x = 0; x < this.screenWidth; x++) {
        for (let y = 0; y < this.screenHeight; y++) {
          const displayPos = { x, y };
          const mapPos = this.game.render.convertViewportToAbsolute(displayPos);
          const explored = level.exploredTiles.get(mapPos)!;
          const visible = level.visibleTiles.get(mapPos)!;
          const tile = level.tiles.get(mapPos) || Tile.Nothing;
          const fg_colorLight = tile.fg_color_light;
          const fg_colorDark = tile.fg_color_dark;
          const bg_colorLight = tile.bg_color_light;
          const bg_colorDark = tile.bg_color_dark;
          let fg = blank;
          let bg = blank;
          if (visible) {
            fg = fg_colorLight;
            bg = bg_colorLight;
          } else if (explored) {
            fg = fg_colorDark;
            bg = bg_colorDark;
          }
          if (
            this.game.gameState.state === GameState.Examine &&
            mapPos.x === this.game.examinePosition.x &&
            mapPos.y === this.game.examinePosition.y
          ) {
            fg = Palette.Mulberry;
            bg = Palette.Mulberry;
          }
          this.game.render.draw(
            displayPos,
            Glyph.fromCharCode(tile.character, fg, bg),
          );
        }
      }
    }
  }

  renderEntities() {
    const level = this.game.map.getCurrentLevel();
    const renderLevel = new Map<string, number>();
    if (level) {
      for (const { position, renderable } of this.renderQuery) {
        if (
          level.visibleTiles.get(position) &&
          this.game.render.isInViewport(position)
        ) {
          const key = `${position.x},${position.y}`;
          if (renderLevel.has(key)) {
            const currentRenderLevel = renderLevel.get(key)!;
            if (renderable.renderOrder >= currentRenderLevel) {
              // something else has a higher priority render level, so don't render this
              // if equal, we'll just default to the first thing rendered
              continue;
            }
          }
          renderLevel.set(key, renderable.renderOrder);
          const tile = level.tiles.get(position);
          const pos = this.game.render.convertAbsoluteToViewport(position);
          let fg = Palette.GreyNurse;
          let bg = tile ? tile.bg_color_light : Palette.Ebony;
          if (renderable.glyph.fg) {
            fg = hexToColor(renderable.glyph.fg);
          }
          if (renderable.glyph.bg) {
            bg = hexToColor(renderable.glyph.bg);
          }
          if (
            this.game.gameState.state === GameState.Examine &&
            position.x === this.game.examinePosition.x &&
            position.y === this.game.examinePosition.y
          ) {
            bg = Palette.Mulberry;
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
