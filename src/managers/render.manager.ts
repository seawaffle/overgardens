import { Glyph, Terminal, Vector2 } from "malwoden";
import { Game } from "../game";
import { Manager } from "./manager";

export class RenderManager extends Manager {
  terminal: Terminal.RetroTerminal;
  tileWidth = 12;
  tileHeight = 12;
  displayWidth = 80;
  displayHeigth = 50;

  constructor(game: Game) {
    super(game);
    this.terminal = this.createTerminal();
  }

  createTerminal(): Terminal.RetroTerminal {
    const mountNode = document.getElementById("app");
    if (!mountNode) throw new Error("mountNode not defined");

    return new Terminal.RetroTerminal({
      width: this.displayWidth,
      height: this.displayHeigth,
      imageURL: "/cheep_12.png",
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
}
