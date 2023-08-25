import { Game } from "../game";
import { GameState } from "../data/game-state";
import { Entity } from "../components";

export function openInventory(game: Game) {
  if (game.gameState.state === GameState.Ticking) return;
  game.gameState.setState(GameState.Inventory);
}

export function closeInventory(game: Game) {
  if (game.gameState.state !== GameState.Inventory) {
    return;
  }

  game.gameState.setState(GameState.AwaitingInput);
}

export function pickUp(game: Game, me: Entity) {
  const position = me.position!;
  const items = game.map
    .getCurrentLevel()
    ?.getTileContent(position)
    .filter((e) => e.itemProperties);
  if (items) {
    if (items.length > 1) {
      // open pick up menu
      return;
    }
    // add item to inventory
    addToInventory(game, me, items[0]);
    game.log.addMessage(`${me.name} picked up ${items[0].name}`);
    return;
  }
  // no items to pick up
  game.log.addMessage("Nothing to pick up");
}

export function addToInventory(game: Game, me: Entity, item: Entity) {
  if (!me.inventory) {
    game.ecs.world.addComponent(me, "inventory", { items: [] });
  }
  game.ecs.world.removeComponent(item, "position");
  me.inventory!.items.push(item);
}

export function dropItem(game: Game, me: Entity, item: Entity) {
  if (me.inventory && me.inventory.items.includes(item)) {
    me.inventory.items = me.inventory.items.filter((i) => i.id! !== item.id);
    game.ecs.world.addComponent(item, "position", me.position!);
    game.log.addMessage(`${me.name} dropped ${item.name}`);
  }
}

export function openItemDetails(game: Game, item: Entity) {
  game.itemToDescribe = item;
}

export function closeItemDetails(game: Game) {
  game.itemToDescribe = undefined;
}
