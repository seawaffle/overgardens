import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette } from "../data";
import { TextWidget } from "./text-widget";
import { indexToLetter } from "../utils";

export class InventoryScreen extends Screen {
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
        text: "Inventory",
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
          Actions.closeInventory(this.game);
        },
      },
    }).setParent(panelWidget);
    const items = this.game.player?.inventory?.items;

    // scroll up button
    new GUI.ButtonWidget({
      origin: { x: this.game.render.viewportWidth - 1, y: 1 },
      initialState: {
        text: "↑",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          if (this.game.screenLineNumber > 0) {
            this.game.screenLineNumber--;
            this.game.updateScreen = true;
          }
        },
      },
    }).setParent(panelWidget);
    // scroll down button
    new GUI.ButtonWidget({
      origin: {
        x: this.game.render.viewportWidth - 1,
        y: this.game.render.viewportHeight - 2,
      },
      initialState: {
        text: "↓",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          if (this.game.screenLineNumber < (items?.length || 0) - 1) {
            this.game.screenLineNumber++;
            this.game.updateScreen = true;
          }
        },
      },
    }).setParent(panelWidget);

    // inventory items
    if (items && items.length > 0) {
      let y = 2;
      for (let i = this.game.screenLineNumber; i < items.length; i++) {
        const item = items[i];
        let itemText = `${indexToLetter(i)}) ${item.name}`;
        if (item.itemProperties!.equipped) {
          itemText += " (Equipped)";
        }
        new TextWidget({
          origin: { x: 2, y },
          initialState: {
            text: itemText,
            onClick: () => {
              Actions.openItemDetails(this.game, item);
            },
          },
        }).setParent(panelWidget);
        y++;
      }
    } else {
      new TextWidget({
        origin: { x: 2, y: 2 },
        initialState: {
          text: "-- Nothing --",
        },
      }).setParent(panelWidget);
    }
    container.setDisabled(true);
    return container;
  }

  notify(state: GameState): void {
    if (state === GameState.Inventory) {
      this.guiContainer.clearMouseContext();
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
    } else {
      this.guiContainer.setDisabled(true);
    }
  }
  render(): void {
    if (this.game.gameState.state === GameState.Inventory) {
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
