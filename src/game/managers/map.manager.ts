import { Game } from "../game";
import { Area, Level, Map } from "../data";
import { Manager } from "./manager";
import { Color } from "malwoden";

export class MapManager extends Manager {
  map: Map | undefined;
  areaWidth = 80;
  areaHeight = 80;

  constructor(game: Game) {
    super(game);
  }

  loadMap(data: Record<string, any>) {
    this.map = new Map(data.width, data.height);
    this.map.currentArea = data.currentArea;
    for (const a of data.areas) {
      const area = new Area(a.id, a.width, a.height);
      area.currentLevel = a.currentLevel;
      area.rootNote = a.rootNote;
      for (const l of a.levels) {
        const level = new Level(l.id, l.width, l.height);
        level.tiles.items = l.tiles.items;
        for (const t of level.tiles.items) {
          t.bg_color_dark = new Color(
            t.bg_color_dark.r,
            t.bg_color_dark.g,
            t.bg_color_dark.b,
          );
          t.bg_color_light = new Color(
            t.bg_color_light.r,
            t.bg_color_light.g,
            t.bg_color_light.b,
          );
          t.fg_color_dark = new Color(
            t.fg_color_dark.r,
            t.fg_color_dark.g,
            t.fg_color_dark.b,
          );
          t.fg_color_light = new Color(
            t.fg_color_light.r,
            t.fg_color_light.g,
            t.fg_color_light.b,
          );
        }
        level.blockedTiles.items = l.blockedTiles.items;
        level.exploredTiles.items = l.exploredTiles.items;
        level.visibleTiles.items = l.visibleTiles.items;
        level.mode = l.mode;
        level.rootNote = l.rootNote;
        area.levels.push(level);
      }
      this.map.areas.push(area);
    }
  }

  generateMap() {
    this.map = Map.generateMap(this.game.rng, this.areaWidth, this.areaHeight);
  }

  getCurrentLevel(): Level | undefined {
    if (this.map) {
      return this.map.getCurrentLevel();
    }
    return undefined;
  }
}
