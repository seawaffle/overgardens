import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette } from "../data";
import { TextWidget } from "./text-widget";

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
    // inventory items
    const items = this.game.player?.inventory?.items;
    if (items && items.length > 0) {
      let y = 2;
      for (const item of items) {
        new TextWidget({
          origin: { x: 2, y },
          initialState: {
            text: item.name,
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
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
    } else {
      this.guiContainer.setDisabled(true);
    }
  }
  render(): void {
    this.guiContainer.cascadeDraw();
  }
}
