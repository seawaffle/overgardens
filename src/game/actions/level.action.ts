import { GameState } from "../data";
import { Game } from "../game";

export function changeLevel(game: Game) {
  const player = game.player!;
  const area = game.map.getCurrentArea()!;
  const level = game.map.getCurrentLevel()!;
  const tile = level.tiles.get(player.position!)!;
  if (tile.destination) {
    player.destination = {
      area: tile.destination.area,
      level: tile.destination.level,
    };
    game.gameState.setState(GameState.ZoneChange);
    if (tile.destination.area !== area.id) {
      if (game.map.map!.areas.length === tile.destination.area) {
        game.map.generateArea(tile.destination.area);
      }
    }
  } else {
    game.log.addMessage("You can't do that now!");
  }
}
