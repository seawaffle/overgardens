import { Game } from "../game";
import { GameState } from "../data/game-state";
import { Entity } from "../components";
import { applyEquipmentStats } from "../mechanics";

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

export function equipItem(game: Game, me: Entity, item: Entity) {
  if (me.inventory && me.inventory.items.includes(item)) {
    for (const slot of me.body!.slots!) {
      if (slot.type === item.itemProperties!.slotType) {
        if (
          slot.ableToEquipItems &&
          (!slot.equippedItem || slot.equippedItem.itemProperties!.natural)
        ) {
          slot.equippedItem = item;
          item.itemProperties!.equipped = true;
          applyEquipmentStats(me);
          game.log.addMessage(`${me.name} equipped ${item.name}`);
          return;
        }
      }
    }
  }
}

export function unequipItem(game: Game, me: Entity, item: Entity) {
  if (
    me.inventory &&
    me.inventory.items.includes(item) &&
    item.itemProperties!.equipped
  ) {
    for (const slot of me.body!.slots!) {
      if (slot.equippedItem === item) {
        slot.equippedItem = undefined;
        item.itemProperties!.equipped = undefined;
        applyEquipmentStats(me);
        game.log.addMessage(`${me.name} removed ${item.name}`);
        return;
      }
    }
  }
}
