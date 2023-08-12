import { inflictDamage } from ".";
import { Entity } from "../components";
import { GameState } from "../data";
import { Game } from "../game";

export function meleeCombat(game: Game, attacker: Entity, defender: Entity) {
  const attackerStats = attacker.body;
  const defenderStats = defender.body;
  if (!attackerStats) throw new Error("no attacker stats");
  if (!defenderStats) throw new Error("no defender stats");

  const damage = Math.max(0, attackerStats.strength);
  if (damage === 0) {
    console.log("unable to do damage");
  } else {
    console.log(`${attacker.name}:${attacker.id} hit ${defender.name}:${defender.id} for ${damage}`);
    inflictDamage(game, defender, damage);
    if (attacker.player) {
      game.gameState.setState(GameState.Ticking);
    }

  }
}
