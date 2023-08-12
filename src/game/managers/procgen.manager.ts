import { Game } from "../game";
import { findOpenGround, randomOpenTile, range } from "../utils";
import { Manager } from "./manager";
import * as Prefabs from "../prefabs";
import { nanoid } from "nanoid";

export class ProcGenManager extends Manager {
  constructor(game: Game) {
    super(game);
  }

  generate() {
    this.generateMap();
    this.game.mapIndexingSystem.update();
    this.game.ecs.world.clear();
    this.generateEntities();
  }

  generateMap() {
    this.game.map.generateMap();
  }

  generateEntities() {
    const map = this.game.map.map!;
    const player = { ...Prefabs.Player };
    player.id = nanoid();
    player.position = { pos: findOpenGround(map, "south") };
    this.game.player = this.game.ecs.addEntity(player);
    for (const _ of range(0, this.game.rng.nextInt(3, 10))) {
      this.game.mapIndexingSystem.update();
      const rat = JSON.parse(JSON.stringify(Prefabs.Rat));
      rat.id = nanoid();
      rat.position = { pos: randomOpenTile(map) };
      this.game.ecs.addEntity(rat);
    }
  }
}
