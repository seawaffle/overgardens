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
    const slots = me
      .body!.slots!.filter((s) => s.type === item.itemProperties!.slotType)
      .filter((s) => s.ableToEquipItems);
    if (item.itemProperties!.twoHanded) {
      if (slots.length >= 2) {
        let openSlots = slots.filter(
          (s) => !s.equippedItem || s.equippedItem.itemProperties!.natural,
        );
        if (openSlots.length >= 2) {
          let slotAmount = 2;
          if (chosenSlot) {
            chosenSlot.equippedItem = item;
            item.itemProperties!.equipped = true;
            slotAmount--;
            openSlots = openSlots.filter(
              (s) => !s.equippedItem || s.equippedItem.itemProperties!.natural,
            );
          }
          while (slotAmount > 0) {
            const slot = openSlots[slotAmount - 1];
            slot.equippedItem = item;
            item.itemProperties!.equipped = true;
            slotAmount--;
          }
          applyEquipmentStats(me);
          return;
        }
      }
      if (log) {
        game.log.addMessage(
          `${me.name} doesn't have enough empty slots to equip ${item.name}`,
        );
      }
    } else {
      for (const slot of slots) {
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

export function unequipAll(game: Game, me: Entity) {
  if (me.body && me.body.slots) {
    for (const slot of me.body.slots) {
      if (slot.equippedItem) {
        unequipItem(game, me, slot.equippedItem);
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
    let slotAmount = item.itemProperties!.twoHanded ? 2 : 1;
    for (const slot of me.body!.slots!) {
      if (slot.equippedItem === item) {
        slot.equippedItem = undefined;
        item.itemProperties!.equipped = undefined;
        slotAmount--;
        if (slot.type === SlotType.Hand) {
          slot.equippedItem = deepCopy(Prefabs.Weapons.get("fist"));
        }
        if (slotAmount === 0) {
          applyEquipmentStats(me);
          if (log) {
            game.log.addMessage(`${me.name} removed ${item.name}`);
          }
          return;
        }
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
