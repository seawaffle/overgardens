import { Palette } from "../data";
import { Game } from "../game";
import { Manager } from "./manager";
import { Display } from "rot-js";

export class RenderManager extends Manager {
  display: Display;
  tileWidth = 12;
  tileHeight = 12;
  displayWidth = 60;
  displayHeight = 40;

  constructor(game: Game) {
    super(game);
    this.display = this.createDisplay();
  }

  createDisplay(): Display {
    const display = new Display({
      width: this.displayWidth,
      height: this.displayHeight,
      fg: Palette.GreyNurse,
      bg: Palette.Ebony,
      forceSquareRatio: true,
    });
    const container = display.getContainer()!;
    document.body.appendChild(container);
    return display;
  }

  clear() {
    this.display.clear();
  }

  draw(x: number, y: number, char: string, fg: string | null, bg: string | null, overwrite = false) {
    if (overwrite) {
      this.display.draw(x, y, char, fg, bg);
    } else {
      this.display.drawOver(x, y, char, fg, bg);
    }
  }
}
