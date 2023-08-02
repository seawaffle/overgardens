import { Game } from "../game";
import { Manager } from "./manager";
import { World } from "miniplex";
import * as Components from "../components";

export class ECSManager extends Manager {
  world: World<Components.Entity>;

  constructor(game: Game) {
    super(game);

    this.world = new World();
  }

  addEntity(entity: Components.Entity) {
    this.world.add(entity);
  }
}
