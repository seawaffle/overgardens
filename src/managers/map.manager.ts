import { Game } from "../game";
import { Level, Map } from "../map";
import { Manager } from "./manager";

export class MapManager extends Manager {
  map: Map;
  areaWidth = 80;
  areaHeight = 50;

  constructor(game: Game) {
    super(game);

    this.map = Map.generateMap(this.areaWidth, this.areaHeight);
  }

  getCurrentLevel(): Level {
    const area = this.map.areas[this.map.currentArea];
    return area.levels[area.currentLevel];
  }
}
