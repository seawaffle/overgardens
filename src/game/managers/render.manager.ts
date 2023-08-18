import { Glyph, Terminal, Vector2 } from "malwoden";
import { Game } from "../game";
import { Manager } from "./manager";
import { GameState } from "../data";

export class RenderManager extends Manager {
  terminal: Terminal.RetroTerminal;
  tileWidth = 16;
  tileHeight = 16;
  viewportWidth = 40;
  viewportHeight = 40;
  displayWidth = 60;
  displayHeight = 40;

  constructor(game: Game) {
    super(game);
    this.terminal = this.createTerminal();
  }

  createTerminal(): Terminal.RetroTerminal {
    const mountNode = document.getElementById("app");
    if (!mountNode) throw new Error("mountNode not defined");

    return new Terminal.RetroTerminal({
      width: this.displayWidth,
      height: this.displayHeight,
      imageURL: "font_16.png",
      charWidth: this.tileWidth,
      charHeight: this.tileHeight,
      mountNode,
    });
  }

  clear() {
    this.terminal.clear();
  }

  render() {
    this.terminal.render();
  }

  draw(pos: Vector2, glyph: Glyph) {
    this.terminal.drawGlyph(pos, glyph);
  }

  getViewportCorner(): Vector2 {
    let target: Vector2;
    if (
      this.game.gameState.state === GameState.Examine &&
      this.game.examinePosition
    ) {
      target = this.game.examinePosition;
    } else if (this.game.player) {
      target = this.game.player.position!;
    } else {
      target = { x: 0, y: 0 };
    }
    const x = target.x - this.viewportWidth / 2;
    const y = target.y - this.viewportHeight / 2;
    return { x, y };
  }

  isInViewport(pos: Vector2) {
    const corner = this.getViewportCorner();
    return (
      pos.x >= corner.x &&
      pos.x < corner.x + this.viewportWidth &&
      pos.y >= corner.y &&
      pos.y < corner.y + this.viewportHeight
    );
  }

  convertViewportToAbsolute(pos: Vector2) {
    const corner = this.getViewportCorner();
    return { x: pos.x + corner.x, y: pos.y + corner.y };
  }

  convertAbsoluteToViewport(pos: Vector2) {
    const corner = this.getViewportCorner();
    return { x: pos.x - corner.x, y: pos.y - corner.y };
  }

  convertMouseToMapPosition(pos: Vector2): Vector2 {
    return this.convertViewportToAbsolute(this.terminal.windowToTilePoint(pos));
  }
}
