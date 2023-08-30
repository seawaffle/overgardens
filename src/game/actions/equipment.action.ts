import { Game } from "../game";
import { GameState } from "../data/game-state";
import { Entity, Slot, SlotType } from "../components";
import { applyEquipmentStats } from "../mechanics";
import { deepCopy } from "../utils";
import * as Prefabs from "../prefabs";

export function openEquipment(game: Game) {
  if (game.gameState.state === GameState.Ticking) return;
  game.gameState.setState(GameState.Equipment);
}

export function closeEquipment(game: Game) {
  if (game.gameState.state !== GameState.Equipment) {
    return;
  }

  game.screenLineNumber = 0;
  game.gameState.setState(GameState.AwaitingInput);
}

export function equipItem(
  game: Game,
  me: Entity,
  item: Entity,
  chosenSlot?: Slot,
) {
  if (me.inventory && me.inventory.items.includes(item)) {
    for (const slot of me.body!.slots!) {
      if (slot.type === item.itemProperties!.slotType) {
        if (
          slot.ableToEquipItems &&
          (!slot.equippedItem || slot.equippedItem.itemProperties!.natural)
        ) {
          if (chosenSlot) {
            if (slot === chosenSlot) {
              slot.equippedItem = item;
              item.itemProperties!.equipped = true;
              applyEquipmentStats(me);
              game.log.addMessage(`${me.name} equipped ${item.name}`);
              return;
            }
          } else {
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
        if (slot.type === SlotType.Hand) {
          slot.equippedItem = deepCopy(Prefabs.Weapons.get("fist"));
        }
        applyEquipmentStats(me);
        game.log.addMessage(`${me.name} removed ${item.name}`);
        return;
      }
    }
  }
}

export function openItemPicker(game: Game, slot: Slot) {
  game.slotToEquip = slot;
}

export function closeItemPicker(game: Game) {
  game.slotToEquip = undefined;
}
