import { Rand, Struct, Vector2 } from "malwoden";
import { Tile } from "./tile";
import { MusicManager } from "./managers/music.manager";
import { mixNoise, reshape } from "./utils";

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

  public addArea(rng: Rand.AleaRNG) {
    const index = this.areas.length;
    const area = new Area(index, this.width, this.height);
    area.rootNote = MusicManager.getRandomRoot();
    area.addLevel(rng);
    this.areas.push(area);
  }

  public static generateMap(
    rng: Rand.AleaRNG,
    width: number,
    height: number,
  ): Map {
    const map = new Map(width, height);
    map.addArea(rng);
    return map;
  }
}

export class Area {
  levels: Level[];
  currentLevel: number;
  rootNote: string;

  constructor(
    public id: number,
    public width: number,
    public height: number,
  ) {
    this.levels = [];
    this.currentLevel = 0;
    this.rootNote = "";
  }

  public addLevel(_rng: Rand.AleaRNG) {
    const index = this.levels.length;
    const level = new Level(index, this.width, this.height);
    level.tiles.fill(Tile.Sky);
    const distanceFn = (nx: number, ny: number) =>
      1 - (1 - nx * nx) * (1 - ny * ny);
    const noiseMap = mixNoise(
      level.width,
      level.height,
      [1, 1 / 2, 1 / 4, 1 / 8, 1 / 16],
      2,
    );
    for (let y = 0; y < level.height; y++) {
      for (let x = 0; x < level.width; x++) {
        const nx = 2 * (x / level.width) - 1;
        const ny = 2 * (y / level.height) - 1;
        let n = noiseMap.get({ x, y })!;
        let d = distanceFn(nx, ny);
        if (d < 0) d = 0;
        if (d > 1) d = 1;
        n = reshape(n, d);
        if (n >= 0.5) {
          level.tiles.set({ x, y }, Tile.Floor);
        }
      }
    }
    level.rootNote = this.rootNote;
    level.mode = MusicManager.getRandomScale();
    this.levels.push(level);
  }
}

export class Level {
  tiles: Struct.Table<Tile>;
  visibleTiles: Struct.Table<boolean>;
  exploredTiles: Struct.Table<boolean>;
  blockedTiles: Struct.Table<boolean>;
  mode: string;
  rootNote: string;

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

    this.mode = "";
    this.rootNote = "";
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
