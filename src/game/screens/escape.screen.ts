import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette } from "../data";

export class EscapeScreen extends Screen {
  static ESCAPE_WIDTH = 20;
  static ESCAPE_HEIGHT = 10;
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
    const escapeX = Math.round(
      this.game.render.displayWidth / 2 - EscapeScreen.ESCAPE_WIDTH / 2,
    );
    const escapeY = Math.round(
      this.game.render.displayHeight / 2 - EscapeScreen.ESCAPE_HEIGHT / 2,
    );
    const panelWidget = new GUI.PanelWidget({
      origin: { x: escapeX, y: escapeY },
      initialState: {
        width: EscapeScreen.ESCAPE_WIDTH,
        height: EscapeScreen.ESCAPE_HEIGHT,
        borderStyle: "single-bar",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(container);
    // close button
    new GUI.ButtonWidget({
      origin: { x: EscapeScreen.ESCAPE_WIDTH - 1, y: 0 },
      initialState: {
        text: "X",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
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
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
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
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
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
