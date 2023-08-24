import { Entity } from "../components";
import { Game } from "../game";

export function pickUp(game: Game, me: Entity) {
    const position = me.position!;
    const items = game.map.getCurrentLevel()?.getTileContent(position).filter((e) => e.itemProperties);
    if (items) {
        if (items.length > 1) {
            // open pick up menu
            return;
        }
        // add item to inventory
        addToInventory(me, items[0]);
    }
    // no items to pick up
    game.log.addMessage("Nothing to pick up");
}

export function addToInventory(_me: Entity, _item: Entity) {

}