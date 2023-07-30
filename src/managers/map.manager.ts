import { Color, Terminal } from "malwoden";
import { Game } from "../game";
import { Map } from "../map";
import { Manager } from "./manager";
import { TileTypes } from "../tile-types";

export class MapManager extends Manager {
  map: Map;
  areaWidth = 80;
  areaHeight = 50;

  constructor(game: Game) {
    super(game);

    this.map = Map.generateMap(this.areaWidth, this.areaHeight);
  }

  render() {
    let floorGlyph = new Terminal.Glyph('.', Color.Gray);
    let wallGlyph = new Terminal.Glyph('#', Color.Green);
    const area = this.map.areas[this.map.currentArea];
    const level = area.levels[area.currentLevel];
    for (let x = 0; x < level.width; x++) {
      for (let y = 0; y < level.height; y++) {
        let pos = { x, y };
        let tile = level.tiles.get(pos);
        if (tile === TileTypes.Floor) {
          this.game.render.draw(pos, floorGlyph);
        } else {
          this.game.render.draw(pos, wallGlyph);
        }
      }
    }
  }
}