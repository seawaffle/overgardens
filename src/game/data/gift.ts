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
}

export class GiftFunctions {
  returnFunction(name: any) {
    const func: keyof GiftFunctions = name;
    return this[func];
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
}
