import { Game } from "../game";
import { Manager } from "./manager";
import { World } from "miniplex";

export class ECSManager extends Manager {
  world: World;

  constructor(game: Game) {
    super(game);

    this.world = new World();
  }
}
