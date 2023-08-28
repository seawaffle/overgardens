import { Color, Pathfinding, Rand, Struct, Vector2 } from "malwoden";
import { Noise } from "rot-js";
import { Level, Tile } from "./data";
import { ColorTranslator } from "colortranslator";
// noise related functions stolen from https://www.redblobgames.com/maps/terrain-from-noise
export function mixNoise(
  width: number,
  height: number,
  spectrum: number[],
  frequency: number,
): Struct.Table<number> {
  const maps: Struct.Table<number>[] = [];
  let scale = 0.0;
  const amplitudes = [];
  for (
    let octave = 0, exponent = 1;
    octave < spectrum.length;
    octave++, exponent *= 2
  ) {
    scale += spectrum[octave];
    maps.push(fillNoise(width, height, frequency * exponent));
    amplitudes.push(spectrum[octave]);
  }
  return addMaps(
    width,
    height,
    maps,
    amplitudes.map(function (a) {
      return a / scale;
    }),
  );
}

function fillNoise(
  width: number,
  height: number,
  frequency: number,
): Struct.Table<number> {
  const output = new Struct.Table<number>(width, height);
  const noise = new Noise.Simplex();
  const aspect = output.width / output.height;
  for (let y = 0; y < output.height; y++) {
    for (let x = 0; x < output.width; x++) {
      const nx = x / output.width - 0.5;
      const ny = y / output.height - 0.5;
      const z = noise.get(nx * frequency * aspect, ny * frequency);
      output.set({ x, y }, z / 2 + 0.5);
    }
  }
  return output;
}

function addMaps(
  width: number,
  height: number,
  maps: Struct.Table<number>[],
  amplitudes: number[],
): Struct.Table<number> {
  const output = new Struct.Table<number>(width, height);
  const N = maps.length;
  if (N !== amplitudes.length) {
    throw `map count (${N}) and amplitude count (${amplitudes.length}) must be the same`;
  }

  for (let y = 0; y < output.height; y++) {
    for (let x = 0; x < output.width; x++) {
      let z = 0;
      for (let i = 0; i < N; i++) {
        z += amplitudes[i] * maps[i].get({ x, y })!;
      }
      output.set({ x, y }, z);
    }
  }
  return output;
}

function lerp(a: number, b: number, t: number) {
  return a * (1 - t) + b * t;
}
export function reshape(e: number, d: number) {
  return lerp(e, 1 - d, 0.5);
}

export function findOpenGround(level: Level, edge?: string) {
  const mapCenter = { x: level.width / 2, y: level.height / 2 };
  let position: Vector2 | undefined = undefined;
  switch (edge) {
    case "north": {
      for (let y = 0; y < level.height; y++) {
        const coord = { x: mapCenter.x, y };
        if (!level.isBlocked(coord) && level.tiles.get(coord)!.walkable) {
          position = coord;
          break;
        }
      }
      break;
    }
    case "south": {
      for (let y = level.height - 1; y > 0; y--) {
        const coord = { x: mapCenter.x, y };
        if (!level.isBlocked(coord) && level.tiles.get(coord)!.walkable) {
          position = coord;
          break;
        }
      }
      break;
    }
    case "east": {
      for (let x = level.width - 1; x > 0; x--) {
        const coord = { x, y: mapCenter.y };
        if (!level.isBlocked(coord) && level.tiles.get(coord)!.walkable) {
          position = coord;
          break;
        }
      }
      break;
    }
    case "west": {
      for (let x = 0; x < level.width; x++) {
        const coord = { x, y: mapCenter.y };
        if (!level.isBlocked(coord) && level.tiles.get(coord)!.walkable) {
          position = coord;
          break;
        }
      }
      break;
    }
    default: {
      position = findOpenNearCoord(level, mapCenter);
      break;
    }
  }
  return position;
}

export function isReachable(
  level: Level,
  start: Vector2,
  pos: Vector2,
): boolean {
  const astar = new Pathfinding.AStar({
    topology: "eight",
    isBlockedCallback: (p) => {
      const tile = level.tiles.get(p);
      if (tile) {
        return !tile.walkable;
      }
      return true;
    },
  });
  const path = astar.compute(start, pos);
  return path !== undefined && path.length > 1;
}

export function findOpenNearCoord(level: Level, pos: Vector2) {
  const coords: Vector2[] = [];
  const badCoords: Vector2[] = [];
  let position: Vector2 | undefined = undefined;
  coords.push(pos);
  while (coords.length > 0) {
    const coord = coords.pop();
    if (
      !coord ||
      coord.x < 0 ||
      coord.x > level.width ||
      coord.y < 0 ||
      coord.y > level.height
    ) {
      continue;
    }
    if (!level.isBlocked(coord) && level.tiles.get(coord)!.walkable) {
      position = coord;
      break;
    } else {
      badCoords.push(coord);
      for (const c of level.tiles.getNeighbors(coord)) {
        if (!badCoords.includes(c)) {
          coords.push(c);
        }
      }
    }
  }
  return position;
}

export function randomOpenTile(rng: Rand.AleaRNG, level: Level): Vector2 {
  while (true) {
    const pos = {
      x: rng.nextInt(0, level.width),
      y: rng.nextInt(0, level.height),
    };
    const tile = level.tiles.get(pos);
    if (!level.isBlocked(pos) && tile!.walkable) {
      return pos;
    }
  }
}

export function* range(min: number, max: number, step = 1) {
  let value = min;
  while (value <= max) {
    yield value;
    value += step;
  }
}

export function hexToColor(hex: string): Color {
  const c = new ColorTranslator(hex);
  return new Color(c.R, c.G, c.B);
}

export function randomTileShading(
  rng: Rand.AleaRNG,
  tile: Tile,
  range: number,
): Tile {
  const randR = rng.nextInt(range * -1, range);
  const randG = rng.nextInt(range * -1, range);
  const randB = rng.nextInt(range * -1, range);
  tile.fg_color_light = adjustColor(tile.fg_color_light, randR, randG, randB);
  tile.bg_color_light = adjustColor(tile.bg_color_light, randR, randG, randB);
  tile.fg_color_dark = adjustColor(tile.fg_color_dark, randR, randG, randB);
  tile.bg_color_dark = adjustColor(tile.bg_color_dark, randR, randG, randB);
  return tile;
}

export function distanceFromPosition(a: Vector2, b: Vector2) {
  const dx = Math.max(a.x, b.x) - Math.min(a.x, b.x);
  const dy = Math.max(a.y, b.y) - Math.min(a.y, a.y);
  return Math.sqrt(dx * dx + dy * dy);
}

function adjustColor(color: Color, r: number, g: number, b: number): Color {
  return new Color(color.r + r, color.g + g, color.b + b);
}

export function deepCopy(item: any): any {
  return JSON.parse(JSON.stringify(item));
}

// stolen out of rot.js, modified to work with malwoden rand object
export function getWeightedValue(
  rng: Rand.AleaRNG,
  data: { [key: string]: number; [key: number]: number },
) {
  let total = 0;

  for (const id in data) {
    total += data[id];
  }
  const random = rng.next() * total;

  let id,
    part = 0;
  for (id in data) {
    part += data[id];
    if (random < part) {
      return id;
    }
  }

  // If by some floating-point annoyance we have
  // random >= total, just return the last id.
  return id;
}
