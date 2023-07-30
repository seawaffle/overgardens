import { Input } from "malwoden";
import { Game } from "../game";

export class AdventureContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();
  }
}