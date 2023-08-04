import { Rand } from "malwoden";
import { Game } from "../game";
import { Area, Level, Map } from "../map";
import { Manager } from "./manager";

export class MapManager extends Manager {
  map: Map | undefined;
  areaWidth = 80;
  areaHeight = 50;
  rng: Rand.AleaRNG;

  constructor(game: Game) {
    super(game);
    this.rng = new Rand.AleaRNG();
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
    this.map = Map.generateMap(this.rng, this.areaWidth, this.areaHeight);
  }

  getCurrentLevel(): Level | undefined {
    if (this.map) {
      const area = this.map.areas[this.map.currentArea];
      return area.levels[area.currentLevel];
    }
    return undefined;
  }
}
