import { Struct } from "malwoden";
import { createNoise2D } from "simplex-noise";
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
  const noise = createNoise2D();
  const aspect = output.width / output.height;
  for (let y = 0; y < output.height; y++) {
    for (let x = 0; x < output.width; x++) {
      const nx = x / output.width - 0.5;
      const ny = y / output.height - 0.5;
      const z = noise(nx * frequency * aspect, ny * frequency);
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
