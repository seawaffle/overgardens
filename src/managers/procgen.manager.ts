import { Color, Rand } from "malwoden";
import { Game } from "../game";
import { findOpenGround, randomOpenTile, range } from "../utils";
import { Manager } from "./manager";

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
    this.game.player = this.game.ecs.addEntity({
      position: { pos: findOpenGround(this.game.map.map!, "south") },
      renderable: { glyph: { character: "@", fg: Color.Yellow }, renderOrder: 1 },
      player: true,
      blocksTile: true,
      viewshed: { range: 7, dirty: true },
    });
    const rng = new Rand.AleaRNG();
    for (const _ of range(0, rng.nextInt(3, 10))) {
      this.game.ecs.addEntity({
        position: { pos: randomOpenTile(this.game.map.map!) },
        renderable: { glyph: { character: "r", fg: Color.White }, renderOrder: 1},
        blocksTile: true,
        viewshed: { range: 5, dirty: true },
      });
    }
  }
}