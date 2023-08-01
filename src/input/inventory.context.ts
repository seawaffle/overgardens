import { Input } from "malwoden";
import { Game } from "../game";

export class InventoryContext extends Input.KeyboardContext {
  constructor(public game: Game) {
    super();
  }
}
