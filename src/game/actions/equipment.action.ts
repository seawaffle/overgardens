import { Game } from "../game";
import { GameState, SlotType } from "../data";
import { type Entity, type Slot } from "../components";
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
  log = true,
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
              if (log) {
                game.log.addMessage(`${me.name} equipped ${item.name}`);
              }
              return;
            }
          } else {
            slot.equippedItem = item;
            item.itemProperties!.equipped = true;
            applyEquipmentStats(me);
            if (log) {
              game.log.addMessage(`${me.name} equipped ${item.name}`);
            }
            return;
          }
        }
      }
    }
  }
}

export function unequipItem(game: Game, me: Entity, item: Entity, log = true) {
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
        if (log) {
          game.log.addMessage(`${me.name} removed ${item.name}`);
        }
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
