import { GUI } from "malwoden";
import { Screen } from "./screen";
import { Game } from "../game";
import { Palette } from "../data";
import { HUDScreen } from ".";

export class LogScreen extends Screen {
  static HUD_HEIGHT = 10;
  static HUD_Y = 10;
  guiContainer: GUI.ContainerWidget;

  constructor(game: Game) {
    super(game);

    this.guiContainer = this.constructGui();
  }

  constructGui() {
    const container = new GUI.ContainerWidget()
      .setMouseHandler(this.game.input.mouseHandler)
      .registerMouseContext(this.game.input.mouseContext)
      .setTerminal(this.game.render.terminal);
    const logWidth =
      this.game.render.displayWidth - this.game.render.viewportWidth;
    const logHeight = this.game.render.displayHeight - HUDScreen.HUD_HEIGHT;
    const logX = this.game.render.viewportWidth;
    const logY = HUDScreen.HUD_HEIGHT;
    // const panelWidget = new GUI.PanelWidget({
    new GUI.PanelWidget({
      origin: { x: logX, y: logY },
      initialState: {
        width: logWidth,
        height: logHeight,
        borderStyle: "single-bar",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(container);
    container.setDisabled(false);
    return container;
  }

  render(): void {
    this.guiContainer.cascadeDraw();
  }
}
