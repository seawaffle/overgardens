import { GameState } from "../data";
import { Game } from "../game";

export function changeLevel(game: Game) {
  const player = game.player!;
  const level = game.map.getCurrentLevel()!;
  const tileContent = level.getTileContent(player.position!)!;
  let travelableEntity = undefined;
  for (const c of tileContent) {
    if (c.travelable) {
      travelableEntity = c;
    }
  }
  if (travelableEntity) {
    player.travelable = { destArea: travelableEntity.travelable!.destArea, destLevel: travelableEntity.travelable!.destLevel };
    game.gameState.setState(GameState.ZoneChange);
  } else {
    game.log.addMessage("You can't do that now!")
  }
}
