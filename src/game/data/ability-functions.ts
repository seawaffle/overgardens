import { GameState } from ".";
import type { Entity } from "../components";
import type { Game } from "../game";
import { Statuses } from "../prefabs";
import { deepCopy, initializeStatuses } from "../utils";

export class AbilityFunctions {
  returnFunction(name: any) {
    const func: keyof AbilityFunctions = name;
    return this[func];
  }

  shadowMerge(game: Game, entity: Entity, _args: string[]) {
    initializeStatuses(game.ecs.world, entity);
    entity.statuses!.push(deepCopy(Statuses.get("shadowMerge")));
  }

  puppeteer(game: Game, entity: Entity, _args: string[]) {
    const level = game.map.getCurrentLevel()!;
    const targetContent = level.getTileContent(game.targetPosition);
    const targetEntity = targetContent.find((c) => c.body);
    if (targetEntity) {
      game.ecs.world.addComponent(targetEntity, "player", true);
      targetEntity.abilities = entity.abilities;
      targetEntity.renderable!.glyph.fg = "yellow";
      targetEntity.viewshed = {
        range: entity.viewshed!.range,
        dirty: true,
      };
      targetEntity.faction = entity.faction;
      targetEntity.name = entity.name;
      targetEntity.inventory = { items: [] };
      game.player = targetEntity;
      game.ecs.world.removeComponent(entity, "player");
      game.ecs.world.addComponent(entity, "dying", true);
      // additional gamestate change here because now the current entity isn't the player anymore
      game.gameState.setState(GameState.Ticking);
    }
  }
}
