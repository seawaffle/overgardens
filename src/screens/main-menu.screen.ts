import { Color, GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState } from "../game-state";

export class MainMenuScreen extends Screen {
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
      origin: { x: 25, y: 2 },
      initialState: { text: "Overgardens of the Ageless" },
    }).setParent(panelWidget);
    // new game button
    new GUI.ButtonWidget({
      origin: { x: 30, y: 8 },
      initialState: {
        text: "[N]ew Game",
        hoverColor: Color.DarkSlateGray,
        onClick: () => {
          Actions.newGame(this.game);
        },
      },
    }).setParent(panelWidget);
    // load game button
    new GUI.ButtonWidget({
      origin: { x: 30, y: 10 },
      initialState: {
        text: "[C]ontinue",
        hoverColor: Color.DarkSlateGray,
        onClick: () => {
          Actions.loadGame(this.game);
        },
      },
    }).setParent(panelWidget);
    container.setDisabled(true);
    return container;
  }

  notify(state: GameState) {
    this.guiContainer.setDisabled(state !== GameState.MainMenu);
  }

  render(): void {
    this.guiContainer.cascadeDraw();
  }
}
