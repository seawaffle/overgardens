import { Game } from "../game";
import {
  findOpenGround,
  findOpenNearCoord,
  isReachable,
  mixNoise,
  randomOpenTile,
  randomTileShading,
  range,
  reshape,
} from "../utils";
import { Manager } from "./manager";
import * as Prefabs from "../prefabs";
import { nanoid } from "nanoid";
import { Area, Level, Map, Tile } from "../data";
import { CharCode, Generation, Vector2 } from "malwoden";
import { Entity } from "../components";
import { StringGenerator } from "rot-js";
import NameData from "../prefabs/names.json";
import { populateBodyStats } from "../mechanics";

export class ProcGenManager extends Manager {
  readonly AREA_NUMBER = 10;
  readonly MAX_LEVELS = 7;
  readonly MIN_LEVELS = 4;
  stringGen: StringGenerator;
  readonly MAX_NAME_SIZE = 9;

  constructor(game: Game) {
    super(game);

    this.stringGen = new StringGenerator({});
    for (const name of NameData) {
      this.stringGen.observe(name);
    }
  }

  generate() {
    this.generateMap();
    this.game.mapIndexingSystem.update();
    this.game.ecs.world.clear();
  }

  generateName(): string {
    const name = this.stringGen.generate();
    return name.length <= this.MAX_NAME_SIZE ? name : this.generateName();
  }

  generateMap(): Map {
    const map = new Map(this.game.map.areaWidth, this.game.map.areaHeight);
    // only generate first area to start, generate others before we go to them
    map.areas.push(this.generateArea(0));
    return map;
  }

  generateArea(id: number): Area {
    const area = new Area(
      id,
      this.game.map.areaWidth,
      this.game.map.areaHeight,
    );
    area.rootNote = this.game.music.getRandomRoot();
    const levelCount = this.game.rng.nextInt(this.MIN_LEVELS, this.MAX_LEVELS);
    console.log(`generating ${levelCount} levels`);
    for (const i of range(0, levelCount)) {
      if (i === 0) {
        area.levels.push(this.generateLevel(i, area.rootNote));
      } else {
        area.levels.push(
          this.generateLevel(i, area.rootNote, area.levels[i - 1]),
        );
      }
    }
    return area;
  }

  generateLevel(id: number, rootNote: string, previousLevel?: Level): Level {
    const level = new Level(
      id,
      this.game.map.areaWidth,
      this.game.map.areaHeight,
    );
    level.rootNote = rootNote;
    level.mode = this.game.music.getRandomScale();
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
          if (this.game.rng.next() > 0.95) {
            tile = randomTileShading(this.game.rng, { ...Tile.Tree }, 5);
          } else {
            tile = randomTileShading(this.game.rng, { ...Tile.Grass }, 8);
          }
        } else if (n >= 0.5) {
          tile = randomTileShading(this.game.rng, { ...Tile.Ground }, 6);
        } else {
          const cloudCover = cloudMap.get({ x, y })!;
          if (cloudCover >= 0.5) {
            tile = randomTileShading(this.game.rng, { ...Tile.Cloud }, 5);
            if (cloudCover >= 0.6) {
              tile.character = CharCode.darkShade;
            } else if (cloudCover >= 0.55) {
              tile.character = CharCode.mediumShade;
            }
          } else {
            tile = randomTileShading(this.game.rng, { ...Tile.Sky }, 5);
          }
        }
        level.tiles.set({ x, y }, tile);
      }
    }
  }

  generateDungeon(level: Level, previousLevel: Level) {
    const builder = new Generation.CellularAutomataBuilder({
      width: level.width,
      height: level.height,
      wallValue: 1,
      floorValue: 0,
      rng: this.game.rng,
    });
    builder.randomize(this.game.rng.next(0.5, 0.7));
    builder.doSimulationStep(3);
    builder.connect(0);
    const map = builder.getMap();
    // const noiseMap = mixNoise(
    //   level.width,
    //   level.height,
    //   [1, 1 / 2, 1 / 4, 1 / 8, 1 / 16],
    //   2,
    // );
    // set all previous sky tiles to sky, to preserve the shape of the island
    const cloudMap = mixNoise(
      level.width,
      level.height,
      [1, 1 / 2, 1 / 4, 1 / 8, 1 / 16],
      2,
    );
    for (let x = 0; x < level.width; x++) {
      for (let y = 0; y < level.height; y++) {
        const position = { x, y };
        const prevTile = previousLevel.tiles.get(position)!;
        let genTile = map.get(position);
        // const noise = noiseMap.get(position)!;
        let tile: Tile;
        if (prevTile.type === "sky" || prevTile.type === "cloud") {
          const cloudCover = cloudMap.get({ x, y })!;
          if (cloudCover >= 0.5) {
            tile = randomTileShading(this.game.rng, { ...Tile.Cloud }, 5);
            if (cloudCover >= 0.6) {
              tile.character = CharCode.darkShade;
            } else if (cloudCover >= 0.55) {
              tile.character = CharCode.mediumShade;
            }
          } else {
            tile = randomTileShading(this.game.rng, { ...Tile.Sky }, 5);
          }
        } else {
          // if (noise > 0.9) {
          //   genTile = 0;
          // }
          tile = randomTileShading(
            this.game.rng,
            genTile === 0 ? { ...Tile.Floor } : { ...Tile.Wall },
            7,
          );
        }
        level.tiles.set(position, tile);
      }
    }
  }

  populateStairs(area: Area) {
    for (let i = 0; i < area.levels.length; i++) {
      const level = area.levels[i];
      if (i === 0) {
        let pos = randomOpenTile(this.game.rng, level);
        while (
          !isReachable(level, this.game.player!.position!, pos) &&
          pos !== this.game.player!.position!
        ) {
          pos = randomOpenTile(this.game.rng, level);
        }
        const tile = randomTileShading(
          this.game.rng,
          { ...Tile.DownStairs },
          5,
        );
        tile.destination = { area: area.id, level: i + 1 };
        level.tiles.set(pos, tile);
        console.log(
          `${area.id}.${level.id} ${tile.type} = ${JSON.stringify(pos)} to ${
            tile.destination.area
          }.${tile.destination.level}`,
        );
      } else {
        // place up stairs based on previous level's position
        const previousLevel = area.levels[i - 1];
        let upPos = findOpenNearCoord(
          level,
          this.findStairPosition(previousLevel, "down stairs")!,
        )!;
        let validPosition = false;
        while (!validPosition) {
          let openCount = 0;
          const neighbors = level.tiles.getNeighbors(upPos)!;
          for (const nPos of neighbors) {
            const n = level.tiles.get(nPos)!;
            if (n.walkable) {
              openCount++;
              if (openCount > 2) {
                validPosition = true;
                break;
              }
            }
          }
          if (!validPosition) {
            upPos = randomOpenTile(this.game.rng, level);
          }
        }
        const tile = randomTileShading(this.game.rng, { ...Tile.UpStairs }, 5);
        tile.destination = { area: area.id, level: i - 1 };
        level.tiles.set(upPos, tile);
        console.log(
          `${area.id}.${level.id} ${tile.type} = ${JSON.stringify(upPos)} to ${
            tile.destination.area
          }.${tile.destination.level}`,
        );
        // place down stairs on any level that isn't the bottom
        if (i + 1 < area.levels.length) {
          let pos = randomOpenTile(this.game.rng, level);
          while (!isReachable(level, upPos, pos)) {
            pos = randomOpenTile(this.game.rng, level);
          }
          const downTile = randomTileShading(
            this.game.rng,
            { ...Tile.DownStairs },
            5,
          );
          downTile.destination = { area: area.id, level: i + 1 };
          level.tiles.set(pos, downTile);
          console.log(
            `${area.id}.${level.id} ${downTile.type} = ${JSON.stringify(
              pos,
            )} to ${downTile.destination.area}.${downTile.destination.level}`,
          );
        }
      }
    }
  }

  findStairPosition(level: Level, type: string): Vector2 | undefined {
    for (let x = 0; x < level.width; x++) {
      for (let y = 0; y < level.height; y++) {
        const position = { x, y };
        const tile = level.tiles.get(position)!;
        if (tile.type === type) {
          return position;
        }
      }
    }
    return undefined;
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
      const name = this.generateName();
      player.name = name[0].toUpperCase() + name.slice(1);
      player.position = findOpenGround(level, "south");
      populateBodyStats(player);
      this.game.player = this.game.ecs.addEntity(player);
    }
  }

  generateEntities(level: Level) {
    for (const _ of range(0, this.game.rng.nextInt(3, 10))) {
      this.game.mapIndexingSystem.update();
      const rat: Entity = JSON.parse(JSON.stringify(Prefabs.Rat));
      rat.id = nanoid();
      rat.position = randomOpenTile(this.game.rng, level);
      populateBodyStats(rat);
      this.game.ecs.addEntity(rat);
    }
    for (const _ of range(0, this.game.rng.nextInt(1, 2))) {
      this.game.mapIndexingSystem.update();
      const ooze: Entity = JSON.parse(JSON.stringify(Prefabs.Ooze));
      ooze.id = nanoid();
      ooze.position = randomOpenTile(this.game.rng, level);
      populateBodyStats(ooze);
      this.game.ecs.addEntity(ooze);
    }
  }
}
