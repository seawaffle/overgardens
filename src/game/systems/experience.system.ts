import { Query, type With } from "miniplex";
import type { Entity } from "../components";
import { System } from "./system";
import { Game } from "../game";
import { determineMaxExperienceByLevel, hpPerLevel } from "../mechanics";

export class ExperienceSystem extends System {
  experienceQuery: Query<With<Entity, "gainedExperience">>;

  constructor(game: Game) {
    super(game);
    this.experienceQuery = this.game.ecs.world.with("gainedExperience");
  }

  update(): void {
    for (const entity of this.experienceQuery) {
      // add gained xp to current xp
      if (entity.body) {
        if (entity.body.xp) {
          entity.body.xp.current += entity.gainedExperience;
        } else {
          entity.body.xp = {
            current: entity.gainedExperience,
            max: determineMaxExperienceByLevel(entity),
          };
        }
        this.game.ecs.world.removeComponent(entity, "gainedExperience");
        // if over max xp, add level
        while (entity.body.xp!.current >= entity.body.xp!.max) {
          if (entity.body.level) {
            if (entity.body.level.current === entity.body.level.max) {
              // stop at level cap
              break;
            }
            entity.body.level.current += 1;
          } else {
            entity.body.level = { current: 1, max: 100 };
          }
          entity.body.xp = {
            current: (entity.body.xp!.current -= entity.body.xp!.max),
            max: determineMaxExperienceByLevel(entity),
          };
          // allocate extra hp
          if (entity.body.hp) {
            const newHp = hpPerLevel(
              entity.body.stability ? entity.body.stability.base : 10,
              entity.player,
            );
            entity.body.hp.current += newHp;
            entity.body.hp.max += newHp;
          }
        }
      }
    }
  }
}
