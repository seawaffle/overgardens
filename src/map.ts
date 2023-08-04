import { Rand, Struct, Vector2 } from "malwoden";
import { Tile } from "./tile";

export class Map {
  areas: Area[];
  currentArea: number;

  constructor(
    public width: number,
    public height: number,
  ) {
    this.areas = [];
    this.currentArea = 0;
  }

  public addArea() {
    const index = this.areas.length;
    const area = new Area(index, this.width, this.height);
    area.addLevel();
    this.areas.push(area);
  }

  public static generateMap(width: number, height: number): Map {
    const map = new Map(width, height);
    map.addArea();
    return map;
  }
}

export class Area {
  levels: Level[];
  currentLevel: number;

  constructor(
    public id: number,
    public width: number,
    public height: number,
  ) {
    this.levels = [];
    this.currentLevel = 0;
  }

  public addLevel() {
    const index = this.levels.length;
    const level = new Level(index, this.width, this.height);
    const rng = new Rand.AleaRNG("poop");
    level.tiles.fill(Tile.Floor);
    for (let i = 0; i < 300; i++) {
      const x = rng.nextInt(0, level.width - 1);
      const y = rng.nextInt(0, level.height - 1);
      level.tiles.set({ x, y }, Tile.Wall);
    }
    this.levels.push(level);
  }
}

export class Level {
  tiles: Struct.Table<Tile>;
  visibleTiles: Struct.Table<boolean>;
  exploredTiles: Struct.Table<boolean>;
  blockedTiles: Struct.Table<boolean>;

  constructor(
    public id: number,
    public width: number,
    public height: number,
  ) {
    this.tiles = new Struct.Table<Tile>(width, height);
    this.visibleTiles = new Struct.Table<boolean>(width, height);
    this.visibleTiles.fill(false);
    this.exploredTiles = new Struct.Table<boolean>(width, height);
    this.exploredTiles.fill(false);
    this.blockedTiles = new Struct.Table<boolean>(width, height);
    this.blockedTiles.fill(false);
  }

  populateBlocked() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const tile = this.tiles.get({ x, y })!;
        this.setBlocked({ x, y }, !tile.walkable);
      }
    }
  }

  setBlocked(tile: Vector2, value = true) {
    this.blockedTiles.set(tile, value);
  }

  isBlocked(tile: Vector2): boolean {
    return !!this.blockedTiles.get(tile);
  }
}
