import { Color, GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState } from "../game-state";

export class HelpScreen extends Screen {
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
        width: 80,
        height: 50,
        borderStyle: "double-bar",
      },
    }).setParent(container);
    // title
    new GUI.TextWidget({
      origin: { x: 2, y: 0 },
      initialState: { text: "Help" },
    }).setParent(panelWidget);
    // close button
    new GUI.ButtonWidget({
      origin: { x: 79, y: 0 },
      initialState: {
        text: "X",
        hoverColor: Color.DarkSlateGray,
        onClick: () => {
          Actions.closeHelp(this.game);
        },
      },
    }).setParent(panelWidget);
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
