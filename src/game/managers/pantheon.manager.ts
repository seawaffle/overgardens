import { Ageless } from "../data";
import { Manager } from "./manager";
import * as Prefabs from "../prefabs";
import { deepCopy } from "../utils";
import { Entity } from "../components";

export enum Sacrifice {
  Self,
  Vigor,
  Possessions,
}

export class PantheonManager extends Manager {
  readonly MAX_PANTHEON_SIZE = 3;
  pantheon: Ageless[] = [];
  // inCommunion?: Ageless = undefined;
  altar?: Entity = undefined;
  sacrificed = false;

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
        case Sacrifice.Self: {
          break;
        }
        case Sacrifice.Vigor: {
          const divide = this.game.rng.nextItem([2, 3, 4])!;
          player.body!.hp!.max = Math.round(player.body!.hp!.max / divide);
          if (player.body!.hp!.current > player.body!.hp!.max) {
            player.body!.hp!.current = player.body!.hp!.max;
          }
          break;
        }
        case Sacrifice.Possessions: {
        }
      }
      this.sacrificed = true;
    }
  }

  // beginCommunion(name: string) {
  //     const ageless = this.findAgeless(name);
  //     if (ageless) {
  //         this.inCommunion = ageless;
  //     }
  // }

  // endCommunion() {
  //     this.inCommunion = undefined;
  // }

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
