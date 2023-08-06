import { Color } from "malwoden";
import { Game } from "../game";
import { GameState } from "../game-state";

export function newGame(game: Game) {
  console.log("new game action");
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

  game.gameState.setState(GameState.AwaitingInput);
}

export function loadGame(game: Game) {
  console.log("load game action");
  game.database.loadGame();
}

export function saveGame(game: Game) {
  console.log("save game action");
  game.database.saveGame();
}
