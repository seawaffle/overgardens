import { GameState } from ".";

export class StateListener {
  notify(state: GameState) {
    console.log(`new state: ${state}`);
  }
}
