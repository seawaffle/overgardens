import type { Attribute, Entity, Body, Status } from "../components";
import { Game } from "../game";
import { populateBodyStats } from "../mechanics";
import { Statuses } from "../prefabs";
import { deepCopy } from "../utils";

export class GiftFunctions {
  returnFunction(name: any) {
    const func: keyof GiftFunctions = name;
    return this[func];
  }

  nothing(_game: Game, _entity: Entity, _args: any[]) {
    // you get nothiiiiing
  }

  increaseAttr(game: Game, entity: Entity, args: any[]) {
    const attrName: keyof Body = args[0];
    const minAmount = parseInt(args[1]);
    const maxAmount = parseInt(args[2]);
    const amount = game.rng.nextInt(minAmount, maxAmount + 1);
    const body = entity.body!;
    const attr: Attribute = body[attrName]! as Attribute;
    attr.base += amount;
    populateBodyStats(entity);
  }

  perfectedAppendage(_game: Game, _entity: Entity, _args: any[]) {}

  shadowSlip(_game: Game, _entity: Entity, _args: any[]) {}

  hunger(game: Game, entity: Entity, _args: any[]) {
    if (!entity.statuses) {
      game.ecs.world.addComponent(entity, "statuses", []);
    }
    const hunger: Status = deepCopy(Statuses.get("hunger"));
    const hungerArgs = hunger.args;
    const timeTillHunger = game.rng.nextInt(
      parseInt(hungerArgs[1]),
      parseInt(hungerArgs[2]),
    );
    hunger.args = [timeTillHunger.toString(), hungerArgs[1], hungerArgs[2]];
    entity.statuses!.push(hunger);
  }

  tendrils(_game: Game, _entity: Entity, _args: any[]) {}

  puppeteer(_game: Game, _entity: Entity, _args: any[]) {}
}
