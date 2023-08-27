import { Struct, Vector2 } from "malwoden";
import { Tile } from "./tile";
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

  public getCurrentArea(): Area {
    return this.areas[this.currentArea];
  }

  public getCurrentLevel(): Level {
    const area = this.getCurrentArea();
    return area.levels[area.currentLevel];
  }
}

export class Area {
  levels: Level[];
  currentLevel: number;
  rootNote: string;
  visited = false;

  constructor(
    public id: number,
    public width: number,
    public height: number,
  ) {
    this.levels = [];
    this.currentLevel = 0;
    this.rootNote = "";
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
  visited = false;
  difficulty: number;

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
    this.difficulty = 0;
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
