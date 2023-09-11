import { GUI } from "malwoden";
import { Palette, GameState } from "../data";
import { Game } from "../game";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { TextWidget } from "./text-widget";
import { indexToLetter } from "../utils";

export class PickupScreen extends Screen {
  readonly WIDTH = 30;
  readonly HEIGHT = 20;
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
          Actions.closePickup(this.game);
        },
      },
    }).setParent(panelWidget);
    const level = this.game.map.getCurrentLevel();
    if (level) {
      const tileContent = level
        .getTileContent(this.game.player!.position!)
        .filter((e) => e.itemProperties);
      if (!this.game.toBePickedUp) {
        this.game.toBePickedUp = new Array<boolean>(tileContent.length);
      }
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
            Actions.scrollDownScreen(this.game, tileContent.length);
          },
        },
      }).setParent(panelWidget);
      let y = 2;

      if (tileContent.length === 0) {
        new TextWidget({
          origin: { x: 2, y },
          initialState: {
            backColor: Palette.Ebony,
            foreColor: Palette.GreyNurse,
            text: "No items",
            wrapAt: this.WIDTH - 4,
          },
        }).setParent(panelWidget);
      } else {
        for (let i = this.game.screenLineNumber; i < tileContent.length; i++) {
          if (y >= this.HEIGHT - 1) {
            break;
          }
          const item = tileContent[i];
          new TextWidget({
            origin: { x: 1, y },
            initialState: {
              backColor: Palette.Ebony,
              foreColor: Palette.GreyNurse,
              text: `${this.game.toBePickedUp![i] ? "* " : ""}${indexToLetter(
                i,
              )}) ${item.name}`,
              onClick: () => {
                this.game.toBePickedUp![i] = !this.game.toBePickedUp![i];
                this.game.updateScreen = true;
              },
            },
          }).setParent(panelWidget);

          y++;
        }
      }
      new GUI.ButtonWidget({
        origin: {
          x: 1,
          y: this.HEIGHT - 1,
        },
        initialState: {
          text: "Enter to pick up",
          backColor: Palette.Ebony,
          foreColor: Palette.GreyNurse,
          hoverColor: Palette.Atomic,
          downColor: Palette.William,
          onClick: () => {
            Actions.pickUpMultiple(this.game, this.game.player!);
            Actions.closePickup(this.game);
          },
        },
      }).setParent(panelWidget);
    }
    container.setDisabled(true);
    return container;
  }

  notify(state: GameState): void {
    if (state === GameState.Pickup) {
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
    } else {
      this.game.toBePickedUp = undefined;
      this.guiContainer.setDisabled(true);
    }
    this.guiContainer.setDisabled(state !== GameState.Pickup);
  }
  render(): void {
    if (this.game.updateScreen) {
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
      this.game.updateScreen = false;
    }
    this.guiContainer.cascadeDraw();
  }
}
