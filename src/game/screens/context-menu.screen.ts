import { GUI } from "malwoden";
import { Palette, GameState } from "../data";
import { Game } from "../game";
import { Screen } from "./screen";
import * as Actions from "../actions";

export class ContextMenuScreen extends Screen {
  static WIDTH = 20;
  static HEIGHT = 20;
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
      this.game.render.displayWidth / 2 - ContextMenuScreen.WIDTH / 2,
    );
    const menuY = Math.round(
      this.game.render.displayHeight / 2 - ContextMenuScreen.HEIGHT / 2,
    );
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
        downColor: Palette.William,
        onClick: () => {
          Actions.closeContextMenu(this.game);
        },
      },
    }).setParent(panelWidget);
    // character
    new GUI.ButtonWidget({
      origin: { x: 2, y: 2 },
      initialState: {
        text: "[C] Character",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          Actions.openCharacterSheet(this.game);
        },
      },
    }).setParent(panelWidget);
    // equipment
    new GUI.ButtonWidget({
      origin: { x: 2, y: 3 },
      initialState: {
        text: "[E] Equipment",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          Actions.openEquipment(this.game);
        },
      },
    }).setParent(panelWidget);
    // inventory
    new GUI.ButtonWidget({
      origin: { x: 2, y: 4 },
      initialState: {
        text: "[I] Inventory",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          Actions.openInventory(this.game);
        },
      },
    }).setParent(panelWidget);
    // full log
    new GUI.ButtonWidget({
      origin: { x: 2, y: 5 },
      initialState: {
        text: "[L] Full Log",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          Actions.openFullLog(this.game);
        },
      },
    }).setParent(panelWidget);
    // help
    new GUI.ButtonWidget({
      origin: { x: 2, y: 6 },
      initialState: {
        text: "[?] Help",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          Actions.openHelp(this.game);
        },
      },
    }).setParent(panelWidget);
    // abilities
    new GUI.ButtonWidget({
      origin: { x: 2, y: 7 },
      initialState: {
        text: "[A] Abilities",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        downColor: Palette.William,
        onClick: () => {
          Actions.openAbilities(this.game);
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
