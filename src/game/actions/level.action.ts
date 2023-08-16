import { GameState } from "../data";
import { Game } from "../game";

export function changeLevel(game: Game) {
  const player = game.player!;
  const level = game.map.getCurrentLevel()!;
  const tile = level.tiles.get(player.position!)!;
  if (tile.destination) {
    player.destination = {
      area: tile.destination.area,
      level: tile.destination.level,
    };
    game.gameState.setState(GameState.ZoneChange);
  } else {
    game.log.addMessage("You can't do that now!");
  }
}
