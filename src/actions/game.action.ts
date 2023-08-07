import { Color } from "malwoden";
import { Game } from "../game";
import { GameState } from "../data/game-state";
import { findOpenGround } from "../utils";

export function newGame(game: Game) {
  if (game.gameState.state !== GameState.MainMenu) {
    return;
  }

  game.gameId = Date.now.toString();
  game.map.generateMap();
  game.mapIndexingSystem.update();
  game.ecs.world.clear();
  game.player = game.ecs.addEntity({
    position: { pos: findOpenGround(game.map.map!, "south") },
    renderable: { glyph: { character: "@", fg: Color.Yellow }, renderOrder: 1 },
    player: true,
    viewshed: { range: 7, dirty: true },
  });

  game.gameState.setState(GameState.AwaitingInput);
}

export function loadGame(game: Game) {
  game.database.loadGame();
}

export function saveGame(game: Game) {
  game.database.saveGame();
}
