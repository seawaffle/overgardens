import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette } from "../data";

export class GameOverScreen extends Screen {
  guiContainer: GUI.ContainerWidget;
  static readonly WIDTH = 40;
  static readonly HEIGHT = 20;

  constructor(game: Game) {
    super(game);

    this.guiContainer = this.constructGui();
  }

  constructGui(): GUI.ContainerWidget {
    const container = new GUI.ContainerWidget()
      .setMouseHandler(this.game.input.mouseHandler)
      .registerMouseContext(this.game.input.mouseContext)
      .setTerminal(this.game.render.terminal);
    const xPos = this.game.render.displayWidth / 2 - GameOverScreen.WIDTH / 2;
    const yPos = this.game.render.displayHeight / 2 - GameOverScreen.HEIGHT / 2;
    const panelWidget = new GUI.PanelWidget({
      origin: { x: xPos, y: yPos },
      initialState: {
        width: GameOverScreen.WIDTH,
        height: GameOverScreen.HEIGHT,
        borderStyle: "single-bar",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(container);
    // close button
    new GUI.ButtonWidget({
      origin: { x: GameOverScreen.WIDTH - 1, y: 0 },
      initialState: {
        text: "X",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          Actions.gameOver(this.game);
        },
      },
    }).setParent(panelWidget);
    let gameOverText = "Game Over";
    if (this.game.player) {
      gameOverText = `So ends the story of ${this.game.player!.name}...`;
    }
    const textX = GameOverScreen.WIDTH / 2 - gameOverText.length / 2;
    new GUI.TextWidget({
      origin: { x: textX, y: 4 },
      initialState: {
        text: gameOverText,
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(panelWidget);
    const buttonText = "[Q]uit to Main Menu";
    const buttonX = Math.round(
      GameOverScreen.WIDTH / 2 - buttonText.length / 2,
    );
    new GUI.ButtonWidget({
      origin: { x: buttonX, y: 8 },
      initialState: {
        text: buttonText,
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          Actions.gameOver(this.game);
        },
      },
    }).setParent(panelWidget);
    container.setDisabled(true);
    return container;
  }

  notify(state: GameState): void {
    this.guiContainer.setDisabled(state !== GameState.GameOver);
  }
  render(): void {
    this.guiContainer.cascadeDraw();
  }
}
