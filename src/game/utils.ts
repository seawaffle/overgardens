import { Color, Rand, Struct, Vector2 } from "malwoden";
import { Noise } from "rot-js";
import { Map, Tile } from "./data";
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

export function findOpenGround(map: Map, edge?: string) {
  const level = map.getCurrentLevel();
  const mapCenter = { x: level.width / 2, y: level.height / 2 };
  let position = { x: 0, y: 0 };
  switch (edge) {
    case "north": {
      for (let y = 0; y < level.height; y++) {
        const coord = { x: mapCenter.x, y };
        if (!level.isBlocked(coord)) {
          position = coord;
          break;
        }
      }
      break;
    }
    case "south": {
      for (let y = level.height - 1; y > 0; y--) {
        const coord = { x: mapCenter.x, y };
        if (!level.isBlocked(coord)) {
          position = coord;
          break;
        }
      }
      break;
    }
    case "east": {
      for (let x = level.width - 1; x > 0; x--) {
        const coord = { x, y: mapCenter.y };
        if (!level.isBlocked(coord)) {
          position = coord;
          break;
        }
      }
      break;
    }
    case "west": {
      for (let x = 0; x < level.width; x++) {
        const coord = { x, y: mapCenter.y };
        if (!level.isBlocked(coord)) {
          position = coord;
          break;
        }
      }
      break;
    }
    default: {
      const coords: Vector2[] = [];
      const badCoords: Vector2[] = [];
      coords.push(mapCenter);
      while (coords.length > 0) {
        const coord = coords.pop()!;
        if (!level.isBlocked(coord)) {
          position = coord;
          break;
        } else {
          for (const c of level.tiles.getNeighbors(coord)) {
            if (!badCoords.includes(c)) {
              coords.push(c);
            }
          }
        }
      }
      break;
    }
  }
  return position;
}

export function randomOpenTile(map: Map): Vector2 {
  const level = map.getCurrentLevel();
  const rng = new Rand.AleaRNG();
  while (true) {
    let pos = { x: rng.nextInt(0, level.width), y: rng.nextInt(0, level.height) };
    if (!level.isBlocked(pos)) {
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

export function randomTileShading(rng: Rand.AleaRNG, tile: Tile): Tile {
  let randR = rng.nextInt(-4, 5);
  let randG = rng.nextInt(-4, 5);
  let randB = rng.nextInt(-4, 5);
  tile.color_light = adjustColor(tile.color_light, randR, randG, randB);
  // tile.bg_color_light = adjustColor(tile.bg_color_light, randR, randG, randB);
  tile.color_dark = adjustColor(tile.color_dark, randR, randG, randB);
  // tile.bg_color_dark = adjustColor(tile.bg_color_dark, randR, randG, randB);
  return tile;
}

function adjustColor(color: Color, r: number, g: number, b: number): Color {
  return new Color(color.r + r, color.g + g, color.b + b);
}
