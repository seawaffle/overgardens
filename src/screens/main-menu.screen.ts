import { Color, GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState } from "../data";

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
        width: this.game.render.displayWidth,
        height: this.game.render.displayHeight,
        borderStyle: "double-bar",
      },
    }).setParent(container);
    // title
    const title = "Overgardens of the Ageless";
    const titleX = this.game.render.displayWidth / 2 - title.length / 2;
    new GUI.TextWidget({
      origin: { x: titleX, y: 2 },
      initialState: { text: title },
    }).setParent(panelWidget);
    // new game button
    const newGameText = "[N]ew Game";
    const newGameX = this.game.render.displayWidth / 2 - newGameText.length / 2;
    new GUI.ButtonWidget({
      origin: { x: newGameX, y: 8 },
      initialState: {
        text: newGameText,
        hoverColor: Color.DarkSlateGray,
        onClick: () => {
          Actions.newGame(this.game);
        },
      },
    }).setParent(panelWidget);
    // load game button
    const continueText = "[C]ontinue";
    const continueX  = this.game.render.displayWidth / 2 - continueText.length / 2;
    new GUI.ButtonWidget({
      origin: { x: continueX, y: 10 },
      initialState: {
        text: continueText,
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
