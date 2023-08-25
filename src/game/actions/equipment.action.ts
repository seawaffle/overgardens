import { Game } from "../game";
import { GameState } from "../data/game-state";
import { Entity } from "../components";

export function openEquipment(game: Game) {
  if (game.gameState.state === GameState.Ticking) return;
  game.gameState.setState(GameState.Equipment);
}

export function closeEquipment(game: Game) {
  if (game.gameState.state !== GameState.Equipment) {
    return;
  }

  game.gameState.setState(GameState.AwaitingInput);
}

export function equipItem(_game: Game, me: Entity, item: Entity) {
  if (me.inventory && me.inventory.items.includes(item)) {
  }
}

export function unequipItem(_game: Game, me: Entity, item: Entity) {
  if (
    me.inventory &&
    me.inventory.items.includes(item) &&
    item.itemProperties!.equipped
  ) {
  }
}
