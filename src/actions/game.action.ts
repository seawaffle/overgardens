import { Color } from "malwoden";
import { Game } from "../game";
import { GameState } from "../game-state";

export function newGame(game: Game) {
  if (game.gameState.state !== GameState.MainMenu) {
    return;
  }

  game.gameId = Date.now.toString();
  game.map.generateMap();
  game.ecs.world.clear();
  game.player = game.ecs.addEntity({
    position: { pos: { x: 40, y: 25 } },
    renderable: { glyph: { character: "@", fg: Color.Yellow }, renderOrder: 1 },
    player: true,
    viewshed: { range: 7, dirty: true },
  });

  game.gameState.state = GameState.AwaitingInput;
}

export function loadGame(game: Game) {
  game.database.loadGame();
}

export function saveGame(game: Game) {
  game.database.saveGame();
}
