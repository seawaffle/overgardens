import { GUI } from "malwoden";
import { Palette, GameState } from "../data";
import { Game } from "../game";
import { Screen } from ".";
import * as Actions from "../actions";

export class FullLogScreen extends Screen {
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
    const panelWidget = new GUI.PanelWidget({
      origin: { x: 0, y: 0 },
      initialState: {
        width: this.game.render.viewportWidth,
        height: this.game.render.viewportHeight,
        borderStyle: "double-bar",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(container);
    // title
    new GUI.TextWidget({
      origin: { x: 2, y: 0 },
      initialState: {
        text: "Full Log",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(panelWidget);
    // close button
    new GUI.ButtonWidget({
      origin: { x: this.game.render.viewportWidth - 1, y: 0 },
      initialState: {
        text: "X",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        onClick: () => {
          Actions.closeFullLog(this.game);
        },
      },
    }).setParent(panelWidget);
    const logTextWidth = this.game.render.viewportWidth - 2;
    new GUI.TextWidget({
      origin: { x: 1, y: 1 },
      initialState: {
        text: "Test",
        wrapAt: this.game.render.viewportWidth - 2,
      },
    })
      .setUpdateFunc(() => {
        const logs = this.game.log.contents(this.game.log.maxHistory);
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
          if (lines > this.game.render.viewportHeight - 1) {
            break;
          }
          text += l.padEnd(length + padAmount, " ");
        }
        return { text };
      })
      .setParent(panelWidget);

    container.setDisabled(true);
    return container;
  }

  notify(state: GameState): void {
    this.guiContainer.setDisabled(state !== GameState.FullLog);
  }
  render(): void {
    this.guiContainer.cascadeUpdate();
    this.guiContainer.cascadeDraw();
  }
}
