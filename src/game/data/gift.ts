import { Attribute, Entity, Body } from "../components";
import { Game } from "../game";
import { populateBodyStats } from "../mechanics";

export interface Gift {
  name: string;
  minFavor: number;
  maxFavor: number;
  description: string;
  function: string;
  args: string[];
  canHaveMultiple: boolean;
}

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

  hunger(_game: Game, _entity: Entity, _args: any[]) {}

  tendrils(_game: Game, _entity: Entity, _args: any[]) {}

  puppeteer(_game: Game, _entity: Entity, _args: any[]) {}
}
