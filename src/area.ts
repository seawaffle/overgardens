import { Struct } from "malwoden";
import { TileTypes } from "./tile-types";

export class Map {
  areas: Area[];
  currentArea: number;

  constructor(public width: number, public height: number) {
    this.areas = [];
    this.currentArea = 0;
  }

  public addArea() {
    let index = this.areas.length;
    let area = new Area(index, this.width, this.height);
    this.areas.push(area);
  }

  public static generateMap(width: number, height: number): Map {
    let map = new Map(width, height);
    return map;
  }
}

export class Area {
  levels: Level[];
  currentLevel: number;

  constructor(public id: number, public width: number, public height: number) {
    this.levels = [];
    this.currentLevel = 0;
  }

}

export class Level {
  tiles: Struct.Table<TileTypes>;

  constructor(public id: number, public width: number, public height: number) {
    this.tiles = new Struct.Table<TileTypes>(width, height);
  }
  
}
