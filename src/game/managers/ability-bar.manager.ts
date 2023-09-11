import { Input } from "malwoden";
import { Game } from "../game";
import { Manager } from "./manager";

export class AbilityBarManager extends Manager {
  abilities: Map<Input.KeyCode, number>;
  barUpdate = false;
  keyToSet?: Input.KeyCode;

  constructor(game: Game) {
    super(game);
    this.abilities = new Map<Input.KeyCode, number>();
  }

  setAbility(key: Input.KeyCode, abilityIndex: number) {
    this.abilities.set(key, abilityIndex);
    this.barUpdate = true;
    this.keyToSet = undefined;
  }

  unsetAbility(key: Input.KeyCode) {
    this.abilities.delete(key);
    this.barUpdate = true;
  }

  inputToIndex(key: Input.KeyCode): number | undefined {
    return this.abilities.get(key);
  }

  findNextOpen(): Input.KeyCode | undefined {
    let nextOpen = undefined;
    // ugly if else block i guess
    if (!this.abilities.has(Input.KeyCode.One)) {
      nextOpen = Input.KeyCode.One;
    } else if (!this.abilities.has(Input.KeyCode.Two)) {
      nextOpen = Input.KeyCode.Two;
    } else if (!this.abilities.has(Input.KeyCode.Three)) {
      nextOpen = Input.KeyCode.Three;
    } else if (!this.abilities.has(Input.KeyCode.Four)) {
      nextOpen = Input.KeyCode.Four;
    } else if (!this.abilities.has(Input.KeyCode.Five)) {
      nextOpen = Input.KeyCode.Five;
    } else if (!this.abilities.has(Input.KeyCode.Six)) {
      nextOpen = Input.KeyCode.Six;
    } else if (!this.abilities.has(Input.KeyCode.Seven)) {
      nextOpen = Input.KeyCode.Seven;
    } else if (!this.abilities.has(Input.KeyCode.Eight)) {
      nextOpen = Input.KeyCode.Eight;
    } else if (!this.abilities.has(Input.KeyCode.Nine)) {
      nextOpen = Input.KeyCode.Nine;
    } else if (!this.abilities.has(Input.KeyCode.Zero)) {
      nextOpen = Input.KeyCode.Zero;
    }
    return nextOpen;
  }
}
