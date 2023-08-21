import { GUI } from "malwoden";
import { Screen } from "./screen";
import { Game } from "../game";
import { Palette } from "../data";
import { HUDScreen } from ".";
import * as Actions from "../actions";

export class LogScreen extends Screen {
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
    const panelWidget = new GUI.PanelWidget({
      origin: { x: logX, y: logY },
      initialState: {
        width: logWidth,
        height: logHeight,
        borderStyle: "single-bar",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(container);
    // expand to open full log
    new GUI.ButtonWidget({
      origin: { x: logWidth - 2, y: 0 },
      initialState: {
        text: "‼",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          Actions.openFullLog(this.game);
        },
      },
    }).setParent(panelWidget);
    const logTextWidth = logWidth - 2;
    new GUI.TextWidget({
      origin: { x: 1, y: 1 },
      initialState: {
        text: "Test",
        wrapAt: logWidth - 2,
      },
    })
      .setUpdateFunc(() => {
        const logs = this.game.log.contents(30);
        let text = "";
        let lines = 0;
        for (const l of logs) {
          const length = l.length;
          let padAmount = 0;
          if (length > logTextWidth) {
            padAmount = length - (length % logTextWidth) + 1;
          } else {
            padAmount = logTextWidth - length + 1;
          }
          lines += (length + padAmount) / logTextWidth;
          if (lines > logHeight - 1) {
            break;
          }
          text += l.padEnd(length + padAmount, " ");
        }
        return { text };
      })
      .setParent(panelWidget);
    container.setDisabled(false);
    return container;
  }

  render(): void {
    this.guiContainer.cascadeUpdate();
    this.guiContainer.cascadeDraw();
  }
}
