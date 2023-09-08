import { GUI } from "malwoden";
import { Screen } from "./screen";
import { Game } from "../game";
import { Palette } from "../data";
import { ButtonPanelWidget } from "./button-panel-widget";
import type { Ability } from "../components";

export class AbilityBarScreen extends Screen {
  guiContainer: GUI.ContainerWidget;
  firstPage = true;

  constructor(game: Game) {
    super(game);

    this.guiContainer = this.constructGui();
  }

  constructGui() {
    const container = new GUI.ContainerWidget();
    const y = this.game.render.viewportHeight;
    const panelWidget = new GUI.PanelWidget({
      origin: { x: 0, y },
      initialState: {
        width: this.game.render.displayWidth,
        height: this.game.render.actionHeight,
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(container);
    // page toggle
    const toggleText = this.firstPage ? "↑" : "↓";
    new ButtonPanelWidget({
      origin: { x: 0, y: 0 },
      initialState: {
        width: 2,
        height: this.game.render.actionHeight,
        title: toggleText,
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          this.firstPage = !this.firstPage;
          this.game.updateScreen = true;
        },
      },
    }).setParent(panelWidget);
    // ability buttons
    const numberOfButtons = 5;
    const buttonWidth = Math.floor(
      (this.game.render.displayWidth - 4) / numberOfButtons,
    );
    const start = this.firstPage ? 0 : numberOfButtons;
    for (let x = start; x < start + numberOfButtons; x++) {
      const number = x === 9 ? 0 : x + 1;
      const keycode = x === 9 ? 48 : 48 + x;
      const abilityIndex = this.game.abilityBar.inputToIndex(keycode);
      let ability: Ability | undefined = undefined;
      if (abilityIndex) {
        ability = this.game.player!.abilities![abilityIndex];
      }
      new ButtonPanelWidget({
        origin: { x: (x - start) * buttonWidth + 2, y: 0 },
        initialState: {
          width: buttonWidth,
          height: this.game.render.actionHeight,
          title: number.toString(),
          backColor: Palette.Ebony,
          foreColor: Palette.GreyNurse,
          hoverColor: Palette.Atomic,
          downColor: Palette.William,
          onClick: () => {
            console.log(`${number} ${ability ? ability.name : ""}`);
          },
        },
      }).setParent(panelWidget);
    }
    // settings button
    new ButtonPanelWidget({
      origin: { x: this.game.render.displayWidth - 2, y: 0 },
      initialState: {
        width: 2,
        height: this.game.render.actionHeight,
        title: "*",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          console.log("bar settings");
        },
      },
    }).setParent(panelWidget);

    container.setDisabled(false);
    container
      .setMouseHandler(this.game.input.mouseHandler)
      .registerMouseContext(this.game.input.mouseContext)
      .setTerminal(this.game.render.terminal);

    return container;
  }

  render(): void {
    if (this.game.updateScreen) {
      this.guiContainer.setMouseHandler(undefined);
      this.guiContainer.clearMouseContext();
      this.guiContainer.setDisabled(true);
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
      this.game.updateScreen = false;
    }
    this.guiContainer.cascadeDraw();
  }
}
