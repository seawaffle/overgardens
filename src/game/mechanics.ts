import { Rand } from "malwoden";
import { Entity } from "./components";

export function attributeBonus(value: number) {
  return ~~((value - 10) / 2);
}

export function hpPerLevel(stability: number, player = false) {
  if (player) {
    return 15 + attributeBonus(stability);
  }
  return 10 + attributeBonus(stability);
}

export function hpAtLevel(level: number, stability: number, player = false) {
  return hpPerLevel(stability, player) * level;
}

export function populateBodyStats(entity: Entity) {
  const player = entity.player || false;
  if (entity.mobile && !entity.body) {
    entity.body = {};
  }
  if (entity.body) {
    if (entity.body.might) {
      entity.body.might.bonus = attributeBonus(entity.body.might.base);
    } else {
      entity.body.might = { base: 10, modifier: 0, bonus: 0 };
    }
    if (entity.body.agility) {
      entity.body.agility.bonus = attributeBonus(entity.body.agility.base);
    } else {
      entity.body.agility = { base: 10, modifier: 0, bonus: 0 };
    }
    if (entity.body.stability) {
      entity.body.stability.bonus = attributeBonus(entity.body.stability.base);
    } else {
      entity.body.stability = { base: 10, modifier: 0, bonus: 0 };
    }
    if (entity.body.intellect) {
      entity.body.intellect.bonus = attributeBonus(entity.body.intellect.base);
    } else {
      entity.body.intellect = { base: 10, modifier: 0, bonus: 0 };
    }
    if (!entity.body.hp) {
      const hp = hpAtLevel(
        entity.body.level ? entity.body.level.current : 1,
        entity.body.stability.base,
        player,
      );
      entity.body.hp = { current: hp, max: hp };
    }
    entity.body.dodgeValue =
      entity.body.dodgeValue ||
      10 + entity.body.agility.bonus + entity.body.agility.modifier;
    entity.body.damageReduction = entity.body.damageReduction || 0;
  }
}

export function rollDie(rng: Rand.AleaRNG, sides: number) {
  return rng.nextInt(0, sides) + 1;
}

export function roll(rng: Rand.AleaRNG, die: string) {
  const dieRegex = /(\d)d(\d+)(.*)/;
  const match = die.match(dieRegex);
  if (match) {
    const amount = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const mod = parseInt(match[3]) || 0;
    let rollAmount = 0;
    for (let i = 0; i < amount; i++) {
      rollAmount += rollDie(rng, sides);
    }
    rollAmount += mod;
    return rollAmount;
  }
  console.log("could not parse: " + die);
  return 0;
}

export function applyEquipmentStats(me: Entity) {
  // initialize stats
  me.body!.dodgeValue = 10;
  me.body!.damageReduction = 0;
  for (const slot of me.body!.slots!) {
    if (slot.equippedItem) {
      const equipment = slot.equippedItem;
      // damage reduction
      if (equipment.itemProperties!.damageReduction) {
        me.body!.damageReduction += equipment.itemProperties!.damageReduction;
      }
      // dodge value
      if (equipment.itemProperties!.dodgeValue) {
        me.body!.dodgeValue += equipment.itemProperties!.dodgeValue;
      }
      // stats
    }
  }
  me.body!.dodgeValue += me.body!.agility!.bonus + me.body!.agility!.modifier;
}
