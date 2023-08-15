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

  generateMap() {
    this.map = this.game.procgen.generateMap();
    // const area = this.map.getCurrentArea();
    this.game.procgen.generateEntities(this.map.getCurrentLevel());
    this.game.procgen.placePlayer(this.map.getCurrentLevel());
    this.game.procgen.populateStairs(this.map.getCurrentArea());
  }

  loadMap(data: Record<string, any>) {
    this.map = new Map(data.width, data.height);
    this.map.currentArea = data.currentArea;
    for (const a of data.areas) {
      const area = new Area(a.id, a.widt, a.height);
      area.currentLevel = a.currentLevel;
      area.rootNote = a.rootNote;
      for (const l of a.levels) {
        const level = new Level(l.id, l.width, l.height);
        level.tiles.items = l.tiles.items;
        for (const t of level.tiles.items) {
          t.bg_color_dark = this.deserializeColor(t.bg_color_dark);
          t.bg_color_light = this.deserializeColor(t.bg_color_light);
          t.fg_color_dark = this.deserializeColor(t.fg_color_dark)
          t.fg_color_light = this.deserializeColor(t.fg_color_light)
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

  changeZone(area: number, level: number) {
    if (this.map!.areas.length > area) {
      this.map!.currentArea = area;
    }
    const currentArea = this.map!.getCurrentArea()!;
    if (currentArea.levels.length > level) {
      currentArea.currentLevel = level;
    }
  }

  // have to do this because it can't figure out that it's supposed to be a color
  deserializeColor(color: Color): Color {
    return new Color(color.r, color.g, color.b);
  }

  getCurrentArea(): Area | undefined{
    if (this.map) {
      return this.map.getCurrentArea();
    }
    return undefined;
  }

  getCurrentLevel(): Level | undefined {
    if (this.map) {
      return this.map.getCurrentLevel();
    }
    return undefined;
  }
}
