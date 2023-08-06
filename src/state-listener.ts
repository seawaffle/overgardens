import { GameState } from "./game-state";

export class StateListener {
  notify(state: GameState) {
    console.log(`new state: ${state}`);
  }
}
