import { Game } from "../game";
import { findOpenGround, mixNoise, randomOpenTile, randomTileShading, range, reshape } from "../utils";
import { Manager } from "./manager";
import * as Prefabs from "../prefabs";
import { nanoid } from "nanoid";
import { Area, Level, Map, Tile } from "../data";
import { MusicManager } from "./music.manager";
import { CharCode, Generation, Vector2 } from "malwoden";
import { Entity } from "../components";

export class ProcGenManager extends Manager {
  readonly AREA_NUMBER = 10;
  readonly MAX_LEVELS = 7;
  readonly MIN_LEVELS = 4;

  constructor(game: Game) {
    super(game);
  }

  generate() {
    this.generateMap();
    this.game.mapIndexingSystem.update();
    this.game.ecs.world.clear();
  }

  generateMap(): Map {
    const map = new Map(this.game.map.areaWidth, this.game.map.areaHeight);
    // only generate first area to start, generate others before we go to them
    map.areas.push(this.generateArea(0));
    return map;
  }

  generateArea(id: number): Area {
    const area = new Area(id, this.game.map.areaWidth, this.game.map.areaHeight);
    area.rootNote = MusicManager.getRandomRoot();
    for (const i of range(0, this.game.rng.nextInt(this.MIN_LEVELS, this.MAX_LEVELS))) {
      if (i === 0) {
        area.levels.push(this.generateLevel(i, area.rootNote));
      } else {
        area.levels.push(this.generateLevel(i, area.rootNote, area.levels[i - 1]));
      }
    }
    return area;
  }

  generateLevel(id: number, rootNote: string, previousLevel?: Level): Level {
    const level = new Level(id, this.game.map.areaWidth, this.game.map.areaHeight);
    level.rootNote = rootNote;
    level.mode = MusicManager.getRandomScale();
    if (previousLevel) {
      this.generateDungeon(level, previousLevel);
    } else {
      this.generateSurface(level);
    }
    return level;
  }

  generateSurface(level: Level) {
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
          if (this.game.rng.next() > 0.9) {
            tile = randomTileShading(this.game.rng, { ...Tile.Tree });
          } else {
            tile = randomTileShading(this.game.rng, { ...Tile.Grass });
          }
        } else if (n >= 0.5) {
          tile = randomTileShading(this.game.rng, { ...Tile.Ground });
        } else {
          const cloudCover = cloudMap.get({ x, y })!;
          if (cloudCover >= 0.5) {
            tile = randomTileShading(this.game.rng, { ...Tile.Cloud });
            if (cloudCover >= 0.6) {
              tile.character = CharCode.darkShade;
            } else if (cloudCover >= 0.55) {
              tile.character = CharCode.mediumShade;
            }
          } else {
            tile = randomTileShading(this.game.rng, { ...Tile.Sky });
          }
        }
        level.tiles.set({ x, y }, tile);
      }
    }
  }

  generateDungeon(level: Level, previousLevel: Level) {
    const builder = new Generation.CellularAutomataBuilder({
      width: this.game.map.areaWidth,
      height: this.game.map.areaHeight,
      wallValue: 1,
      floorValue: 0
    })
    builder.randomize(0.6);
    builder.doSimulationStep(3);
    builder.connect(0);
    const map = builder.getMap();
    // set all previous sky tiles to sky, to preserve the shape of the island
    const cloudMap = mixNoise(
      level.width,
      level.height,
      [1, 1 / 2, 1 / 4, 1 / 8, 1 / 16],
      2,
    );
    for (let x = 0; x < this.game.map.areaWidth; x++) {
      for (let y = 0; y < this.game.map.areaHeight; y++) {
        const position = {x, y};
        const prevTile = previousLevel.tiles.get(position)!;
        const genTile = map.get(position)
        let tile: Tile;
        if (prevTile.type === "sky" || prevTile.type === "cloud") {
          const cloudCover = cloudMap.get({ x, y })!;
          if (cloudCover >= 0.5) {
            tile = randomTileShading(this.game.rng, { ...Tile.Cloud });
            if (cloudCover >= 0.6) {
              tile.character = CharCode.darkShade;
            } else if (cloudCover >= 0.55) {
              tile.character = CharCode.mediumShade;
            }
          } else {
            tile = randomTileShading(this.game.rng, { ...Tile.Sky });
          }
        } else {
          tile = randomTileShading(this.game.rng, genTile === 0 ? { ...Tile.Floor} : { ...Tile.Wall});
        }
        level.tiles.set(position, tile);
      }
    }
  }

  placePlayer(level: Level, stairs?: Vector2) {
    if (this.game.player) {
      if (stairs) {
        this.game.player.position = stairs;
      } else {
        this.game.player.position = findOpenGround(level, "south");
      }
    } else {
      const player = { ...Prefabs.Player };
      player.id = nanoid();
      player.position = findOpenGround(level, "south");
      this.game.player = this.game.ecs.addEntity(player);  
    }
  }

  generateEntities(level: Level, previousLevel?: Level, nextLevel?: Level) {
    for (const _ of range(0, this.game.rng.nextInt(3, 10))) {
      this.game.mapIndexingSystem.update();
      const rat: Entity = JSON.parse(JSON.stringify(Prefabs.Rat));
      rat.id = nanoid();
      rat.position = randomOpenTile(level);
      this.game.ecs.addEntity(rat);
    }
    for (const _ of range(0, this.game.rng.nextInt(1, 2))) {
      this.game.mapIndexingSystem.update();
      const ooze: Entity = JSON.parse(JSON.stringify(Prefabs.Ooze));
      ooze.id = nanoid();
      ooze.position = randomOpenTile(level);
      this.game.ecs.addEntity(ooze);
    }
    if (nextLevel) {
      // if there's a place to go down to, put some stairs
      const downstairs: Entity = JSON.parse(JSON.stringify(Prefabs.DownStairs));
      downstairs.travelable = { destArea: 0, destLevel: nextLevel.id };
      downstairs.position = randomOpenTile(level);
      this.game.ecs.addEntity(downstairs);
    }
    if (previousLevel) {
      // if there's a place to go up to, put some stairs
      const upstairs: Entity = JSON.parse(JSON.stringify(Prefabs.UpStairs));
      upstairs.travelable = { destArea: 0, destLevel: previousLevel.id };
      upstairs.position = randomOpenTile(level);
      this.game.ecs.addEntity(upstairs);
    }
  }
}
