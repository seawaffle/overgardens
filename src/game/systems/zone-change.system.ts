import { Query, With } from "miniplex";
import { GameState } from "../data";
import { System } from "./system";
import { Entity } from "../components";
import { Game } from "../game";

export class ZoneChangeSystem extends System {
  currentQuery: Query<With<Entity, "position">>;
  nextQuery: Query<With<Entity, "outOfLevel">>;
  

  constructor(game: Game) {
    super(game);

    this.currentQuery = this.game.ecs.world.with("position").without("player");
    this.nextQuery = this.game.ecs.world.with("outOfLevel");
  }

  update(): void {
    if (this.game.gameState.state !== GameState.ZoneChange) return;
    const player = this.game.player;
    if (!player?.travelable) {
      this.game.gameState.setState(GameState.AwaitingInput);
      return;
    }
    const dest = player.travelable;
    this.freezeEntities();
    this.game.map.changeZone(dest.destArea, dest.destLevel);
    this.unfreezeEntities(dest.destArea, dest.destLevel);
    player.travelable = undefined;
    this.game.gameState.setState(GameState.AwaitingInput);
  }

  freezeEntities() {
    for (const e of this.currentQuery) {
      this.game.ecs.world.addComponent(e, "outOfLevel", {
        area: this.game.map.getCurrentArea()!.id,
        level: this.game.map.getCurrentLevel()!.id,
        pos: e.position,
      });
      this.game.ecs.world.removeComponent(e, "position");
    }
  }

  unfreezeEntities(area: number, level: number) {
    for (const e of this.nextQuery) {
      if (e.outOfLevel.area === area && e.outOfLevel.level === level) {
        this.game.ecs.world.addComponent(e, "position", e.outOfLevel.pos);
        this.game.ecs.world.removeComponent(e, "outOfLevel");
      }
    }
  }
}