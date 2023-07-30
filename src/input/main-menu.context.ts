import { Input } from "malwoden";
import { Game } from "../game";

export class MainMenuContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();
  }
}