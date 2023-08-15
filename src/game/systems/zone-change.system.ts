import { Query, With } from "miniplex";
import { GameState } from "../data";
import { System } from "./system";
import { Entity } from "../components";
import { Game } from "../game";

export class ZoneChangeSystem extends System {
  hereQuery: Query<With<Entity, "position">>;
  nextQuery: Query<With<Entity, "outOfLevel">>;
  

  constructor(game: Game) {
    super(game);

    this.hereQuery = this.game.ecs.world.with("position").without("player");
    this.nextQuery = this.game.ecs.world.with("outOfLevel");
  }

  update(): void {
    if (this.game.gameState.state !== GameState.ZoneChange) return;
    const player = this.game.player;
    if (!player?.destination) {
      this.game.gameState.setState(GameState.AwaitingInput);
      return;
    }
    const dest = player.destination;
    // const changingAreas = false;
    let upOrDown = "up stairs";
    if (dest.level < this.game.map.getCurrentLevel()!.id) {
      upOrDown = "down stairs";
    }
    this.freezeEntities();
    this.game.map.changeZone(dest.area, dest.level);
    this.unfreezeEntities(dest.area, dest.level);
    player.destination = undefined;
    const newLevel = this.game.map.getCurrentLevel()!;
    const stairPosition = this.game.procgen.findStairPosition(newLevel, upOrDown);
    console.log(`Moving to area: ${dest.area}.${dest.level}. Stair position: ${JSON.stringify(stairPosition)}`)
    this.game.procgen.placePlayer(newLevel, stairPosition);
    player.viewshed!.dirty = true;
    this.game.gameState.setState(GameState.AwaitingInput);
  }

  freezeEntities() {
    for (const e of this.hereQuery) {
      this.game.ecs.world.addComponent(e, "outOfLevel", {
        area: this.game.map.getCurrentArea()!.id,
        level: this.game.map.getCurrentLevel()!.id,
        pos: e.position,
      });
      this.game.ecs.world.removeComponent(e, "position");
      if (e.currentTurn) {
        this.game.ecs.world.removeComponent(e, "currentTurn");
      }
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