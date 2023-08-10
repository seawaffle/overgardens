import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette } from "../data";

export class HelpScreen extends Screen {
  guiContainer: GUI.ContainerWidget;
  helpTexts = [
    "? - This help screen",
    "i - Inventory screen",
    ". - Wait 1 turn",
    "Arrow Keys - Movement",
  ];
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
        width: this.game.render.displayWidth,
        height: this.game.render.displayHeight,
        borderStyle: "double-bar",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(container);
    // title
    new GUI.TextWidget({
      origin: { x: 2, y: 0 },
      initialState: {
        text: "Help",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(panelWidget);
    // close button
    new GUI.ButtonWidget({
      origin: { x: this.game.render.displayWidth - 1, y: 0 },
      initialState: {
        text: "X",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        onClick: () => {
          Actions.closeHelp(this.game);
        },
      },
    }).setParent(panelWidget);
    // help text
    for (let y = 0; y < this.helpTexts.length; y++) {
      new GUI.TextWidget({
        origin: { x: 2, y: y + 2 },
        initialState: {
          text: this.helpTexts[y],
          backColor: Palette.Ebony,
          foreColor: Palette.GreyNurse,
          wrapAt: this.game.render.displayWidth - 4,
        },
      }).setParent(panelWidget);
    }
    container.setDisabled(true);
    return container;
  }

  notify(state: GameState): void {
    this.guiContainer.setDisabled(state !== GameState.HelpScreen);
  }
  render(): void {
    this.guiContainer.cascadeDraw();
  }
}
