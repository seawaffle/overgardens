import { Entity } from "..//components";
import { GameState } from "../data";
import { Game } from "../game";

export function wait(game: Game, entity: Entity | undefined) {
    if (!entity) {
        return;
    }
    if (entity.player) {
        game.gameState.setState(GameState.Ticking);
    }
}