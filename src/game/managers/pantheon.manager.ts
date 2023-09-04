import { type Ageless, type Gift, GiftFunctions } from "../data";
import { Manager } from "./manager";
import * as Prefabs from "../prefabs";
import * as Actions from "../actions";
import { deepCopy } from "../utils";
import type { Entity } from "../components";
import { populateBodyStats } from "../mechanics";

export enum Sacrifice {
  Self,
  Vigor,
  Possessions,
}

export class PantheonManager extends Manager {
  readonly MAX_PANTHEON_SIZE = 3;
  pantheon: Ageless[] = [];
  altar?: Entity = undefined;
  sacrificed = false;
  offeredGift?: Gift = undefined;
  giftFunctions = new GiftFunctions();

  establishPantheon() {
    this.pantheon = [];
    for (let i = 0; i < this.MAX_PANTHEON_SIZE; i++) {
      const ageless = this.game.rng.nextItem(Prefabs.Pantheon);
      if (ageless && !this.pantheon.find((a) => a.name === ageless.name)) {
        this.pantheon.push(deepCopy(ageless));
      }
    }
  }

  pickRandomAgeless() {
    return this.game.rng.nextItem(this.pantheon)!;
  }

  findAgeless(name: string): Ageless | undefined {
    return this.pantheon.find((n) => n.name === name);
  }

  setAltar(a: Entity) {
    if (a.altarProperties) {
      this.altar = a;
    }
  }

  getAgelessForAltar(): Ageless | undefined {
    let ageless = undefined;
    if (this.altar) {
      ageless = this.findAgeless(this.altar.altarProperties!.ageless);
    }
    return ageless;
  }

  removeAltar(used: boolean) {
    if (this.altar) {
      if (used) {
        this.altar.altarProperties!.visited = true;
        this.altar = undefined;
        this.sacrificed = false;
      }
    }
  }

  sacrifice(sacrifice: Sacrifice) {
    if (!this.sacrificed) {
      const player = this.game.player!;
      switch (sacrifice) {
        // remove player stats
        case Sacrifice.Self: {
          const attr = this.game.rng.nextItem([
            player.body!.might,
            player.body!.agility,
            player.body!.stability,
            player.body!.intellect,
          ])!;
          const amount = this.game.rng.nextItem([2, 3, 4])!;
          attr.base -= amount;
          populateBodyStats(player);
          this.changeRelations(
            amount * 10,
            this.altar!.altarProperties!.ageless,
          );
          this.game.log.addMessage(
            `${player.name} feels a piece of themselves slip away.`,
          );
          break;
        }
        // cut player's max hp
        case Sacrifice.Vigor: {
          const divide = this.game.rng.nextItem([2, 3, 4])!;
          player.body!.hp!.max = Math.round(player.body!.hp!.max / divide);
          if (player.body!.hp!.current > player.body!.hp!.max) {
            player.body!.hp!.current = player.body!.hp!.max;
          }
          this.changeRelations(
            divide * 7,
            this.altar!.altarProperties!.ageless,
          );
          this.game.log.addMessage(`${player.name} feels weakened.`);
          break;
        }
        // remove player's items
        case Sacrifice.Possessions: {
          const amount = this.game.rng.nextItem([1, 2, 3, 4])!;
          let actualAmount = 0;
          for (let i = 0; i < amount; i++) {
            const itemIndex = this.game.rng.nextInt(
              0,
              player.inventory!.items.length,
            );
            const item = player.inventory!.items[itemIndex];
            if (item) {
              if (item.itemProperties!.equipped) {
                Actions.unequipItem(this.game, player, item, false);
              }
              player.inventory!.items = player.inventory!.items.filter(
                (i) => i.id !== item.id,
              );
              this.game.ecs.world.remove(item);
              actualAmount++;
            }
          }
          this.changeRelations(
            actualAmount * 5,
            this.altar!.altarProperties!.ageless,
          );
          this.game.log.addMessage(`${player.name}'s pack feels lighter.`);
          break;
        }
      }
      this.sacrificed = true;
      this.offeredGift = this.determineGift(player, this.getAgelessForAltar()!);
      this.acceptGift(player, this.offeredGift);
    }
  }

  determineGift(entity: Entity, ageless: Ageless): Gift {
    const gifts = [];
    const currentFavor = ageless.currentFavor || 0;
    // get list of gifts for current favor
    for (const gift of ageless.gifts) {
      if (gift.maxFavor >= currentFavor && gift.minFavor <= currentFavor) {
        gifts.push(gift);
      }
    }
    // pick random gift from list
    const gift = this.game.rng.nextItem(gifts)!;
    if (!entity.receivedGifts) {
      entity.receivedGifts = [];
    }
    if (entity.receivedGifts.find((g) => g.name === gift.name)) {
      if (!gift.canHaveMultiple) {
        return this.determineGift(entity, ageless);
      }
    }
    return gift;
  }

  acceptGift(entity: Entity, gift: Gift) {
    const func = this.giftFunctions.returnFunction(gift.function);
    func(this.game, entity, gift.args);
    if (gift.name !== "Nothing") {
      entity.receivedGifts!.push(gift);
    }
  }

  changeRelations(amount: number, name: string) {
    // find ageless
    const ageless = this.findAgeless(name);
    if (ageless) {
      // change relationship
      this.modifyRelation(amount, ageless);
      // modify associates
      const otherAmount = Math.round(amount / 2);
      for (const a of ageless.associates) {
        const associate = this.findAgeless(a);
        if (associate) {
          this.modifyRelation(otherAmount, associate);
        }
      }
      // modify enemies
      for (const e of ageless.enemies) {
        const enemy = this.findAgeless(e);
        if (enemy) {
          this.modifyRelation(otherAmount * -1, enemy);
        }
      }
    }
  }

  modifyRelation(amount: number, ageless: Ageless) {
    ageless.currentFavor = ageless.currentFavor
      ? ageless.currentFavor + amount
      : amount;
  }
}
