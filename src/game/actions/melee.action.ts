import { inflictDamage } from ".";
import { Entity } from "../components";
import { GameState } from "../data";
import { Game } from "../game";
import { roll } from "../mechanics";

export function meleeCombat(
  game: Game,
  attacker: Entity,
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
    attackerRoll + attacker.body!.might!.bonus + attacker.body!.might!.modifier;
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
    inflictDamage(game, defender, damage);
    if (attacker.player) {
      game.gameState.setState(GameState.Ticking);
    }
  }
}
