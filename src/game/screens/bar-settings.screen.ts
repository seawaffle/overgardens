import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette } from "../data";
import { TextWidget } from "./text-widget";
import type { Ability } from "../components";

export class BarSettingsScreen extends Screen {
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
        text: "Ability Bar Settings",
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
        downColor: Palette.William,
        onClick: () => {
          Actions.closeBarSettings(this.game);
        },
      },
    }).setParent(panelWidget);

    let spacer = 0;
    for (let y = 0; y < 10; y++) {
      const number = y === 9 ? 0 : y + 1;
      const keycode = y === 9 ? 48 : 48 + number;
      const abilityIndex = this.game.abilityBar.inputToIndex(keycode);
      let ability: Ability | undefined = undefined;
      if (abilityIndex !== undefined) {
        ability = this.game.player!.abilities![abilityIndex];
      }
      const text = `${number} -  ${ability ? ability.name : "Not assigned"}`;
      new TextWidget({
        origin: { x: 2, y: y + 2 + spacer },
        initialState: {
          text,
          backColor: Palette.Ebony,
          foreColor: Palette.GreyNurse,
          onClick: () => {
            this.game.abilityBar.keyToSet = keycode;
          },
        },
      }).setParent(panelWidget);
      spacer++;
    }

    container.setDisabled(true);
    return container;
  }

  notify(state: GameState): void {
    if (state === GameState.BarSettings) {
      this.guiContainer.clearMouseContext();
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
    } else {
      this.guiContainer.setDisabled(true);
    }
  }
  render(): void {
    if (this.game.gameState.state === GameState.BarSettings) {
      this.game.log.clearOverride();
      if (this.game.updateScreen) {
        this.guiContainer.clearMouseContext();
        this.guiContainer = this.constructGui();
        this.guiContainer.setDisabled(false);
        this.game.updateScreen = false;
      }
    }
    this.guiContainer.cascadeDraw();
  }
}
