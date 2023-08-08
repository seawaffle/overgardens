import { Color, GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState } from "../data";

export class EscapeScreen extends Screen {
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
    const escapeWidth = 20;
    const escapeHeight = 10;
    const escapeX = this.game.render.displayWidth / 2 - escapeWidth / 2;
    const escapeY = this.game.render.displayHeight / 2 - escapeHeight / 2;
    const panelWidget = new GUI.PanelWidget({
      origin: { x: escapeX, y: escapeY },
      initialState: {
        width: escapeWidth,
        height: escapeHeight,
        borderStyle: "single-bar",
      },
    }).setParent(container);
    // close button
    new GUI.ButtonWidget({
      origin: { x: escapeWidth - 1, y: 0 },
      initialState: {
        text: "X",
        hoverColor: Color.DarkSlateGray,
        onClick: () => {
          Actions.closeEscapeMenu(this.game);
        },
      },
    }).setParent(panelWidget);
    // save button
    new GUI.ButtonWidget({
      origin: { x: 2, y: 2 },
      initialState: {
        text: "[S]ave Game",
        hoverColor: Color.DarkSlateGray,
        onClick: () => {
          Actions.saveGame(this.game);
        },
      },
    }).setParent(panelWidget);
    // quit button
    new GUI.ButtonWidget({
      origin: { x: 2, y: 4 },
      initialState: {
        text: "[Q]uit",
        hoverColor: Color.DarkSlateGray,
        onClick: () => {
          Actions.quitToMainMenu(this.game);
        },
      },
    }).setParent(panelWidget);
    container.setDisabled(true);
    return container;
  }

  notify(state: GameState): void {
    this.guiContainer.setDisabled(state !== GameState.EscapeMenu);
  }
  render(): void {
    this.guiContainer.cascadeDraw();
  }
}
