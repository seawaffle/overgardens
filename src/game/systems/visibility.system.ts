import { Query, With } from "miniplex";
import { System } from "./system";
import { Entity } from "../components";
import { Game } from "../game";
import { FOV } from "malwoden";
import { Reaction } from "../data/faction";

export class VisibilitySystem extends System {
  viewersQuery: Query<With<Entity, "position" | "viewshed">>;
  fov: FOV.PreciseShadowcasting;

  constructor(game: Game) {
    super(game);

    this.viewersQuery = this.game.ecs.world.with("position", "viewshed");
    this.fov = new FOV.PreciseShadowcasting({
      topology: "eight",
      lightPasses: (v) =>
        this.game.map.getCurrentLevel()?.tiles.get(v)?.transparent ?? false,
    });
  }

  update(): void {
    const level = this.game.map.getCurrentLevel();
    if (level) {
      for (const e of this.viewersQuery) {
        if (!e.viewshed.dirty) {
          continue;
        } else {
          e.viewshed.dirty = false;
        }

        const visibility = this.fov.calculateArray(
          e.position,
          e.viewshed.range,
        );
        e.viewshed.visibleTiles = visibility
          .map((x) => x.pos)
          .filter(
            (v) =>
              v.x >= 0 && v.x < level.width && v.y >= 0 && v.y < level.height,
          );
        if (e.player) {
          level.visibleTiles.fill(false);
          e.viewshed.visibleTiles.forEach((v) => {
            level.visibleTiles.set(v, true);
            level.exploredTiles.set(v, true);
            if (this.game.extendedActionSystem.hasAction()) {
              for (const c of level.getTileContent(v)) {
                if (
                  c.body &&
                  this.game.faction.getReaction(c, e) === Reaction.Attack
                ) {
                  this.game.extendedActionSystem.endAction();
                  this.game.log.addMessage(`Spotted hostile ${c.name}`);
                }
              }
            }
          });
        }
      }
    }
  }
}
