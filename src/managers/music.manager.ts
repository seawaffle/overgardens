import { Manager } from "./manager";
import * as Tone from "tone";
import { ScaleType } from "tonal";
import { Rand } from "malwoden";

export class MusicManager extends Manager {
  async startAudio() {
    await Tone.start();
    console.log("music online");
  }

  static getRandomRoot(): string {
    const rng = new Rand.AleaRNG();
    const note = rng.nextItem<string>([
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ]);
    const octave = rng.nextItem<string>(["3", "4", "5"]);
    return `${note}${octave}`;
  }

  static getRandomScale(): string {
    const rng = new Rand.AleaRNG();
    return rng.nextItem<string>(ScaleType.names())!;
  }

  update() {
    Tone.Transport.start();
  }
}
