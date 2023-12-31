import { Game } from "../game";
import {
  deepCopy,
  findOpenGround,
  findOpenNearCoord,
  getWeightedValue,
  isReachable,
  mixNoise,
  randomOpenTile,
  randomTileShading,
  range,
  reshape,
} from "../utils";
import { Manager } from "./manager";
import * as Prefabs from "../prefabs";
import * as Actions from "../actions";
import { nanoid } from "nanoid";
import {
  type Ageless,
  Area,
  Level,
  Map,
  Tile,
  type Category,
  type Lineage,
  type Ranking,
} from "../data";
import { CharCode, Generation, type Vector2 } from "malwoden";
import { StringGenerator } from "rot-js";
import NameData from "../prefabs/names.json";
import { populateBodyStats } from "../mechanics";
import type { Entity } from "../components";

export class ProcGenManager extends Manager {
  readonly AREA_NUMBER = 10;
  readonly MAX_LEVELS = 7;
  readonly MIN_LEVELS = 4;
  stringGen: StringGenerator;
  readonly MAX_NAME_SIZE = 9;
  pantheon: Ageless[] = [];

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
    let name = this.stringGen.generate().trim();
    if (name.length >= this.MAX_NAME_SIZE) {
      name = this.generateName();
    }
    if ([...name].some((char) => char.charCodeAt(0) > 127)) {
      name = this.generateName();
    }
    return name;
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
      const difficulty = area.id * 10 + i;
      if (i === 0) {
        area.levels.push(this.generateLevel(i, area.rootNote, difficulty));
      } else {
        area.levels.push(
          this.generateLevel(i, area.rootNote, difficulty, area.levels[i - 1]),
        );
      }
    }
    return area;
  }

  generateLevel(
    id: number,
    rootNote: string,
    difficulty: number,
    previousLevel?: Level,
  ): Level {
    const level = new Level(
      id,
      this.game.map.areaWidth,
      this.game.map.areaHeight,
    );
    level.rootNote = rootNote;
    level.mode = this.game.music.getRandomScale();
    level.difficulty = difficulty;
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
        const genTile = map.get(position);
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
        // set down stairs
        let pos = randomOpenTile(this.game.rng, level);
        while (
          !isReachable(level, this.game.player!.position!, pos) &&
          pos !== this.game.player!.position!
        ) {
          pos = randomOpenTile(this.game.rng, level);
        }
        const stairTile = randomTileShading(
          this.game.rng,
          { ...Tile.DownStairs },
          5,
        );
        stairTile.destination = { area: area.id, level: i + 1 };
        level.tiles.set(pos, stairTile);
        console.log(
          `${area.id}.${level.id} ${stairTile.type} = ${JSON.stringify(
            pos,
          )} to ${stairTile.destination.area}.${stairTile.destination.level}`,
        );

        // set island transporters on level 0
        pos = randomOpenTile(this.game.rng, level);
        while (
          !isReachable(level, this.game.player!.position!, pos) &&
          pos !== this.game.player!.position!
        ) {
          pos = randomOpenTile(this.game.rng, level);
        }
        const tile = randomTileShading(
          this.game.rng,
          { ...Tile.Transporter },
          5,
        );
        tile.destination = { area: area.id + 1, level: 0 };
        level.tiles.set(pos, tile);
        console.log(
          `${area.id}.${level.id} ${tile.type} = ${JSON.stringify(pos)} to ${
            tile.destination.area
          }.${tile.destination.level}`,
        );
        if (area.id > 0) {
          pos = randomOpenTile(this.game.rng, level);
          while (
            !isReachable(level, this.game.player!.position!, pos) &&
            pos !== this.game.player!.position!
          ) {
            pos = randomOpenTile(this.game.rng, level);
          }
          const tile = randomTileShading(
            this.game.rng,
            { ...Tile.Transporter },
            5,
          );
          tile.destination = { area: area.id - 1, level: 0 };
          level.tiles.set(pos, tile);
          console.log(
            `${area.id}.${level.id} ${tile.type} = ${JSON.stringify(pos)} to ${
              tile.destination.area
            }.${tile.destination.level}`,
          );
        }
      } else {
        // place up stairs based on previous level's position
        const previousLevel = area.levels[i - 1];
        let upPos = findOpenNearCoord(
          level,
          this.findStair(previousLevel, i)!,
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

  findStair(level: Level, oldLevel: number): Vector2 | undefined {
    for (let x = 0; x < level.width; x++) {
      for (let y = 0; y < level.height; y++) {
        const position = { x, y };
        const tile = level.tiles.get(position)!;
        if (tile.destination && tile.destination.level === oldLevel) {
          return position;
        }
      }
    }
    return undefined;
  }

  findTransporter(level: Level, oldArea: number): Vector2 | undefined {
    for (let x = 0; x < level.width; x++) {
      for (let y = 0; y < level.height; y++) {
        const position = { x, y };
        const tile = level.tiles.get(position)!;
        if (tile.destination && tile.destination.area === oldArea) {
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
      const player = deepCopy(Prefabs.Player);
      player.id = nanoid();
      player.name = this.generateName()
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
      player.position = findOpenGround(level, "south");
      populateBodyStats(player);
      this.game.player = this.game.ecs.addEntity(player);
    }
  }

  generateEntities(area: Area, level: Level) {
    this.populateAltars(area, level);
    this.generateLineageCreatures(area, level);
    this.generateItems(area, level);
  }

  generateLineageCreatures(area: Area, level: Level) {
    const maxDifficulty = level.difficulty + this.game.rng.nextInt(0, 3);
    const minDifficulty = level.difficulty - this.game.rng.nextInt(0, 3);
    // const outOfLevelCreature = this.game.rng.next() > 0.8;
    // const group = this.game.rng.next() > 0.7;
    const types = [];
    for (const [_key, lineage] of Prefabs.Lineages) {
      if (
        lineage.minDifficulty >= minDifficulty &&
        lineage.minDifficulty <= maxDifficulty
      ) {
        types.push(lineage);
      }
    }

    const creatureAmount = this.game.rng.nextInt(5, 10);
    for (const _ of range(0, creatureAmount)) {
      const lineage = this.game.rng.nextItem(types);
      if (lineage) {
        // if our lineage difficulty is less than the max, we'll optionally add a
        // category to the entity
        let category = undefined;
        if (lineage.minDifficulty < maxDifficulty) {
          const remainingDifficulty = maxDifficulty - lineage.minDifficulty;
          const cats = [];
          for (const c of lineage.categories) {
            if (c.addedDifficulty < remainingDifficulty) {
              cats.push(c);
            }
          }
          if (this.game.rng.nextBoolean()) {
            category = this.game.rng.nextItem(cats);
          }
        }
        const entity: Entity = this.createEntityFromLineage(
          lineage,
          category,
          undefined,
        );
        if (level === this.game.map.getCurrentLevel()) {
          entity.position = randomOpenTile(this.game.rng, level);
        } else {
          entity.outOfLevel = {
            area: area.id,
            level: level.id,
            pos: randomOpenTile(this.game.rng, level),
          };
        }
        this.game.ecs.addEntity(entity);
        this.game.mapIndexingSystem.update();
      }
    }
  }

  createEntityFromLineage(
    lineage: Lineage,
    category: Category | undefined,
    _ranking: Ranking | undefined,
  ): Entity {
    const entity: Entity = {
      id: nanoid(),
      mobile: true,
      name: `${lineage.name}`,
    };
    const eq = [];
    for (const i of lineage.equipment) {
      eq.push(i);
    }
    if (category) {
      entity.name += ` ${category.name}`;
      for (const i of category.equipment) {
        eq.push(i);
      }
    }
    entity.renderable = deepCopy(lineage.renderable);
    entity.viewshed = {
      range: 5,
      dirty: true,
    };
    entity.initiative = 6;
    entity.faction = lineage.faction;
    entity.body = {
      might: { base: lineage.baseStats.might, modifier: 0, bonus: 0 },
      agility: { base: lineage.baseStats.agility, modifier: 0, bonus: 0 },
      stability: { base: lineage.baseStats.stability, modifier: 0, bonus: 0 },
      intellect: { base: lineage.baseStats.intellect, modifier: 0, bonus: 0 },
      slots: deepCopy(lineage.slots),
    };
    entity.inventory = { items: [] };
    for (let i = eq.length - 1; i >= 0; i--) {
      const item = deepCopy(eq[i]);
      item.id = nanoid();
      this.game.ecs.addEntity(item);
      entity.inventory.items.push(item);
      Actions.equipItem(this.game, entity, item, undefined, false);
    }
    populateBodyStats(entity);
    return entity;
  }

  generateItems(area: Area, level: Level) {
    const entities: Record<string, number> = {};
    for (const i of Prefabs.ItemTable.keys()) {
      const spawnTable = Prefabs.ItemTable.get(i)!;
      if (
        spawnTable.minDifficulty <= level.difficulty &&
        spawnTable.maxDifficulty >= level.difficulty
      ) {
        entities[i] = spawnTable.weight;
      }
    }
    const itemAmount = this.game.rng.nextInt(3, 10);
    for (const _ of range(0, itemAmount)) {
      const entityType = getWeightedValue(this.game.rng, entities)!;
      if (entityType) {
        const entity = deepCopy(Prefabs.AllItems.get(entityType));
        entity.id = nanoid();
        if (level === this.game.map.getCurrentLevel()) {
          entity.position = randomOpenTile(this.game.rng, level);
        } else {
          entity.outOfLevel = {
            area: area.id,
            level: level.id,
            pos: randomOpenTile(this.game.rng, level),
          };
        }
        this.game.ecs.addEntity(entity);
      }
    }
  }

  populateAltars(area: Area, level: Level) {
    let chance = this.game.rng.next(0, 1);
    // guarantee an idol on 0.0
    if (area.id === 0 && level.id === 0) {
      chance = 1;
    }
    if (chance > 0.9) {
      const ageless = this.game.pantheon.pickRandomAgeless();
      const altar = deepCopy(Prefabs.Altar);
      altar.id = nanoid();
      altar.altarProperties = { ageless: ageless.name };
      let position = undefined;
      const firstRun = true;
      while (!position) {
        if (firstRun) {
          position = findOpenGround(level);
        } else {
          position = randomOpenTile(this.game.rng, level);
        }
        if (level.tiles.get(position!)?.destination) {
          position = undefined;
        }
      }
      if (level === this.game.map.getCurrentLevel()) {
        altar.position = position;
      } else {
        altar.outOfLevel = {
          area: area.id,
          level: level.id,
          pos: position,
        };
      }
      this.game.ecs.addEntity(altar);
    }
  }
}
