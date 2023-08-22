import { Manager } from "./manager";
import * as Tone from "tone";
import { Scale, ScaleType } from "tonal";

export class MusicManager extends Manager {
  leftSynth: Tone.MonoSynth = this.makeSynth();
  rightSynth: Tone.MonoSynth = this.makeSynth();
  async startAudio() {
    await Tone.start();
    console.log("music online");
  }

  makeSynth() {
    return new Tone.MonoSynth({
      volume: -8,
      detune: 0,
      portamento: 0,
      envelope: {
        attack: 0.05,
        attackCurve: "linear",
        decay: 0.3,
        decayCurve: "exponential",
        release: 0.8,
        releaseCurve: "exponential",
        sustain: 0.4,
      },
      filter: {
        Q: 1,
        detune: 0,
        frequency: 0,
        gain: 0,
        rolloff: -12,
        type: "lowpass",
      },
      filterEnvelope: {
        attack: 0.001,
        attackCurve: "linear",
        decay: 0.7,
        decayCurve: "exponential",
        release: 0.8,
        releaseCurve: "exponential",
        sustain: 0.1,
        baseFrequency: 300,
        exponent: 2,
        octaves: 4,
      },
      oscillator: {
        type: "sawtooth",
      },
    });
  }

  getRandomRoot(): string {
    const note = this.game.rng.nextItem<string>([
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
    const octave = this.game.rng.nextItem<string>(["3", "4"]);
    return `${note}${octave}`;
  }

  getRandomScale(): string {
    return this.game.rng.nextItem<string>(ScaleType.names())!;
  }

  generate() {
    Tone.Transport.stop();
    if (this.game.MUSIC) {
      const level = this.game.map.getCurrentLevel()!;
      this.schedule(level.rootNote, level.mode);
      Tone.Transport.start();
    }
  }

  schedule(root: string, scale: string) {
    console.log(`${root} ${scale}`);
    Tone.Transport.bpm.value = 80;
    let leftPanner = new Tone.Panner(-0.5);
    let leftLimiter = new Tone.Limiter(-12);
    let rightPanner = new Tone.Panner(0.5);
    let rightLimiter = new Tone.Limiter(-12);
    this.leftSynth.connect(leftPanner).connect(leftLimiter).toDestination();
    this.rightSynth.connect(rightPanner).connect(rightLimiter).toDestination();
    const notes = Scale.degrees(`${root} ${scale}`);
    new Tone.Loop((time) => {
      this.leftSynth.triggerAttackRelease(
        notes((this.game.rng.nextItem([-3, -2, 1, 1]) || 0) - 5),
        "1:0",
        time,
      );
      this.leftSynth.triggerAttackRelease(
        notes((this.game.rng.nextItem([-3, -2, 2, 3]) || 0) - 5),
        "0:2",
        "+2:1",
      );
      this.leftSynth.triggerAttackRelease(
        notes((this.game.rng.nextItem([-4, -2, 1]) || 0) - 7),
        "0:2",
        "+3:0",
      );
      this.leftSynth.triggerAttackRelease(
        notes((this.game.rng.nextItem([-4, -2, 1]) || 0) - 7),
        "1:0",
        "+5:0",
      );
      this.leftSynth.triggerAttackRelease(
        notes((this.game.rng.nextItem([-5, -3, 1]) || 0) - 5),
        "0:2",
        "+7:1",
      );
      this.leftSynth.triggerAttackRelease(
        notes((this.game.rng.nextItem([-5, -2, 1, 2]) || 0) - 5),
        "1:0",
        "+9:2",
      );
    }, "11m").start("+0.1");
    new Tone.Loop((time) => {
      this.rightSynth.triggerAttackRelease(
        notes(this.game.rng.nextItem([-3, -2, 1, 1, 2, 3]) || 0),
        "1:0",
        time,
      );
      this.rightSynth.triggerAttackRelease(
        notes(this.game.rng.nextItem([-3, -2, 1, 1, 2, 3]) || 0),
        "0:2",
        "+2:1",
      );
      this.rightSynth.triggerAttackRelease(
        notes(this.game.rng.nextItem([-4, -2, 1, 1, 2, 4]) || 0),
        "0:2",
        "+3:0",
      );
      this.rightSynth.triggerAttackRelease(
        notes(this.game.rng.nextItem([-4, -2, 1, 1, 2, 4]) || 0),
        "0:2",
        "+4:0",
      );
      this.rightSynth.triggerAttackRelease(
        notes(this.game.rng.nextItem([-4, -2, 1, 1, 2, 4]) || 0),
        "1:0",
        "+6:0",
      );
      this.rightSynth.triggerAttackRelease(
        notes(this.game.rng.nextItem([-5, -3, 1, 1, 3, 5]) || 0),
        "0:2",
        "+8:1",
      );
      this.rightSynth.triggerAttackRelease(
        notes(this.game.rng.nextItem([-5, -2, 1, 1, 2, 5]) || 0),
        "1:0",
        "+10:2",
      );
      this.rightSynth.triggerAttackRelease(
        notes(this.game.rng.nextItem([-5, -3, 1, 1, 3, 5]) || 0),
        "0:2",
        "+12:0",
      );
    }, "13m").start("+1m");
  }
}
