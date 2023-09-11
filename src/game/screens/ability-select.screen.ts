import { GUI } from "malwoden";
import { Screen } from "./screen";
import { Game } from "../game";
import * as Actions from "../actions";
import { Palette } from "../data";
import { TextWidget } from "./text-widget";
import { indexToLetter } from "../utils";

export class AbilitySelectScreen extends Screen {
  readonly WIDTH = 20;
  readonly HEIGHT = 10;
  guiContainer: GUI.ContainerWidget;
  slotSet = false;

  constructor(game: Game) {
    super(game);

    this.guiContainer = this.constructGui();
  }

  constructGui() {
    const container = new GUI.ContainerWidget()
      .setMouseHandler(this.game.input.mouseHandler)
      .registerMouseContext(this.game.input.mouseContext)
      .setTerminal(this.game.render.terminal);
    const menuX = Math.round(
      this.game.render.displayWidth / 2 - this.WIDTH / 2,
    );
    const menuY = Math.round(
      this.game.render.displayHeight / 2 - this.HEIGHT / 2,
    );
    const panelWidget = new GUI.PanelWidget({
      origin: { x: menuX, y: menuY },
      initialState: {
        width: this.WIDTH,
        height: this.HEIGHT,
        borderStyle: "single-bar",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(container);
    // close button
    new GUI.ButtonWidget({
      origin: { x: this.WIDTH - 1, y: 0 },
      initialState: {
        text: "X",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          this.game.abilityBar.keyToSet = undefined;
          this.game.screenLineNumber = 0;
        },
      },
    }).setParent(panelWidget);
    const abilities = this.game.player?.abilities;

    // scroll up button
    new GUI.ButtonWidget({
      origin: { x: this.WIDTH - 1, y: 1 },
      initialState: {
        text: "↑",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          Actions.scrollUpScreen(this.game);
        },
      },
    }).setParent(panelWidget);
    // scroll down button
    new GUI.ButtonWidget({
      origin: {
        x: this.WIDTH - 1,
        y: this.HEIGHT - 2,
      },
      initialState: {
        text: "↓",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          Actions.scrollDownScreen(this.game, abilities?.length || 0);
        },
      },
    }).setParent(panelWidget);

    if (this.game.abilityBar.keyToSet) {
      const key = this.game.abilityBar.keyToSet;
      let y = 2;
      if (!abilities || abilities.length === 0) {
        new TextWidget({
          origin: { x: 2, y },
          initialState: {
            backColor: Palette.Ebony,
            foreColor: Palette.GreyNurse,
            text: "No abilities",
            wrapAt: this.WIDTH - 4,
          },
        }).setParent(panelWidget);
      } else {
        for (let i = this.game.screenLineNumber; i < abilities.length; i++) {
          if (y >= this.HEIGHT - 1) {
            break;
          }
          const ability = abilities[i];
          new TextWidget({
            origin: { x: 2, y },
            initialState: {
              backColor: Palette.Ebony,
              foreColor: Palette.GreyNurse,
              text: `${indexToLetter(i)}) ${ability.name}`,
              onClick: () => {
                this.game.abilityBar.setAbility(key, i);
                this.game.updateScreen = true;
              },
            },
          }).setParent(panelWidget);

          y++;
        }
      }
    }
    container.setDisabled(true);
    return container;
  }

  render(): void {
    if (this.game.abilityBar.keyToSet) {
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
      this.guiContainer.cascadeDraw();
    } else {
      this.guiContainer.setDisabled(true);
    }
  }
}
