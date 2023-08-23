import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette } from "../data";

export class EquipmentScreen extends Screen {
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
        text: "Equipment",
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
          Actions.closeEquipment(this.game);
        },
      },
    }).setParent(panelWidget);
    // inventory items
    new GUI.TextWidget({
      origin: { x: 1, y: 1 },
      initialState: {
        text: "-- Nothing --",
      },
    }).setParent(panelWidget);
    container.setDisabled(true);
    return container;
  }

  notify(state: GameState): void {
    this.guiContainer.setDisabled(state !== GameState.Equipment);
  }
  render(): void {
    this.guiContainer.cascadeDraw();
  }
}
