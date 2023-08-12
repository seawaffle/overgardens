import { CharCode, Rand, Struct, Vector2 } from "malwoden";
import { Tile } from "./tile";
import { MusicManager } from "../managers/music.manager";
import { mixNoise, randomTileShading, reshape } from "../utils";
import { Entity } from "../components";

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

  public getCurrentArea(): Area {
    return this.areas[this.currentArea];
  }

  public getCurrentLevel(): Level {
    const area = this.getCurrentArea();
    return area.levels[area.currentLevel];
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

  public addLevel(rng: Rand.AleaRNG) {
    const index = this.levels.length;
    const level = new Level(index, this.width, this.height);
    const distanceFn = (nx: number, ny: number) =>
      1 - (1 - nx * nx) * (1 - ny * ny);
    const noiseMap = mixNoise(
      level.width,
      level.height,
      [1, 1 / 2, 1 / 4, 1 / 8, 1 / 16],
      2,
    );
    const cloudMap = mixNoise(
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
        let tile: Tile;
        if (n >= 0.6) {
          if (rng.next() > 0.9) {
            tile = randomTileShading(rng, { ...Tile.Tree });
          } else {
            tile = randomTileShading(rng, { ...Tile.Grass });
          }
        } else if (n >= 0.5) {
          tile = randomTileShading(rng, { ...Tile.Ground });
        } else {
          const cloudCover = cloudMap.get({ x, y })!;
          if (cloudCover >= 0.5) {
            tile = randomTileShading(rng, { ...Tile.Cloud });
            if (cloudCover >= 0.6) {
              tile.character = CharCode.darkShade;
            } else if (cloudCover >= 0.55) {
              tile.character = CharCode.mediumShade;
            }
          } else {
            tile = randomTileShading(rng, { ...Tile.Sky });
          }
        }
        level.tiles.set({ x, y }, tile);
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
  tileContent: Struct.Table<Entity[]>;
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
    this.tileContent = new Struct.Table<Entity[]>(width, height);

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

  clearTileContent() {
    this.tileContent.fill([]);
  }

  addTileContent(tile: Vector2, ...entities: Entity[]) {
    const content = this.getTileContent(tile);
    this.tileContent.set(tile, content.concat(...entities));
  }

  getTileContent(tile: Vector2) {
    return this.tileContent.get(tile) || [];
  }
}
