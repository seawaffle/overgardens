import { GUI } from "malwoden";
import { Palette, GameState } from "../data";
import { Game } from "../game";
import { Screen } from "./screen";
import * as Actions from "../actions";

export class ContextMenuScreen extends Screen {
  static WIDTH = 20;
  static HEIGHT = 10;
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
    const menuX =
      this.game.render.displayWidth / 2 - ContextMenuScreen.WIDTH / 2;
    const menuY =
      this.game.render.displayHeight / 2 - ContextMenuScreen.HEIGHT / 2;
    const panelWidget = new GUI.PanelWidget({
      origin: { x: menuX, y: menuY },
      initialState: {
        width: ContextMenuScreen.WIDTH,
        height: ContextMenuScreen.HEIGHT,
        borderStyle: "single-bar",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(container);
    // close button
    new GUI.ButtonWidget({
      origin: { x: ContextMenuScreen.WIDTH - 1, y: 0 },
      initialState: {
        text: "X",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        onClick: () => {
          Actions.closeContextMenu(this.game);
        },
      },
    }).setParent(panelWidget);
    // inventory
    new GUI.ButtonWidget({
      origin: { x: 2, y: 2 },
      initialState: {
        text: "[I] Inventory",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        onClick: () => {
          Actions.openInventory(this.game);
        },
      },
    }).setParent(panelWidget);
    // full log
    new GUI.ButtonWidget({
      origin: { x: 2, y: 3 },
      initialState: {
        text: "[L] Full Log",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        onClick: () => {
          Actions.openFullLog(this.game);
        },
      },
    }).setParent(panelWidget);
    // help
    new GUI.ButtonWidget({
      origin: { x: 2, y: 4 },
      initialState: {
        text: "[?] Help",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        onClick: () => {
          Actions.openHelp(this.game);
        },
      },
    }).setParent(panelWidget);
    container.setDisabled(true);
    return container;
  }

  notify(state: GameState): void {
    this.guiContainer.setDisabled(state !== GameState.ContextMenu);
  }
  render(): void {
    this.guiContainer.cascadeDraw();
  }
}
