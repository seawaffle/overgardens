import { inflictDamage } from ".";
import type { Attribute, Entity } from "../components";
import { GameState } from "../data";
import { Game } from "../game";
import { roll } from "../mechanics";
import { wieldingRangedWeapon } from "../utils";

export function attack(
  game: Game,
  attacker: Entity,
  hitAttribute: Attribute,
  weapon: Entity,
  defender: Entity,
) {
  const attackerStats = attacker.body;
  const defenderStats = defender.body;
  if (!attackerStats) throw new Error("no attacker stats");
  if (!defenderStats) throw new Error("no defender stats");

  // attack roll
  const attackerRoll = roll(game.rng, "1d20");
  const rollCalculation =
    attackerRoll + hitAttribute.bonus + hitAttribute.modifier;
  const toHit = defender.body!.dodgeValue || 10;
  if (attackerRoll <= 1 || rollCalculation < toHit) {
    game.log.addMessage(`${attacker.name} misses ${defender.name}`);
    return;
  }
  // damage
  const damageRoll =
    roll(game.rng, weapon.itemProperties!.damage!) +
    attacker.body!.might!.bonus +
    attacker.body!.might!.modifier;
  const damage = damageRoll - (defender.body!.damageReduction || 0);
  if (damage <= 0) {
    game.log.addMessage(
      `${attacker.name} hit ${defender.name}, but did no damage`,
    );
  } else {
    game.log.addMessage(`${attacker.name} hit ${defender.name} for ${damage}`);
    inflictDamage(game, attacker, defender, damage);
    if (attacker.player) {
      game.gameState.setState(GameState.Ticking);
    }
  }
}

export function meleeAttack(game: Game, attacker: Entity, defender: Entity) {
  if (attacker.body && attacker.body.slots) {
    let firstAttack = true;
    const usedWeapons: string[] = [];
    for (const slot of attacker.body.slots) {
      const weapon = slot.equippedItem;
      if (weapon && weapon.itemProperties && weapon.itemProperties.melee) {
        if (usedWeapons.includes(weapon.id)) continue;
        if (firstAttack || game.rng.nextBoolean()) {
          attack(game, attacker, attacker.body.might!, weapon, defender);
          firstAttack = false;
          usedWeapons.push(weapon.id);
        }
      }
    }
  }
}

export function rangedAttack(game: Game, attacker: Entity, defender: Entity) {
  if (attacker.id === defender.id) return;
  if (attacker.body && attacker.body.slots) {
    const rangedWeapon = wieldingRangedWeapon(attacker);
    if (rangedWeapon) {
      attack(game, attacker, attacker.body.agility!, rangedWeapon, defender);
    }
  }
}
