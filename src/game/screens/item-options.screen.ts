import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette } from "../data";

export class ItemOptionsScreen extends Screen {
  readonly WIDTH = 20;
  readonly HEIGHT = 10;
  guiContainer: GUI.ContainerWidget;
  itemSet = false;

  constructor(game: Game) {
    super(game);

    this.guiContainer = this.constructGui();
  }

  constructGui() {
    const container = new GUI.ContainerWidget()
      .setMouseHandler(this.game.input.mouseHandler)
      .registerMouseContext(this.game.input.mouseContext)
      .setTerminal(this.game.render.terminal);
    const menuX = this.game.render.displayWidth / 2 - this.WIDTH / 2;
    const menuY = this.game.render.displayHeight / 2 - this.HEIGHT / 2;
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
          Actions.closeItemDetails(this.game);
        },
      },
    }).setParent(panelWidget);
    if (this.game.itemToDescribe) {
      this.itemSet = true;
      const item = this.game.itemToDescribe;
      // name
      const nameX = Math.round(this.WIDTH / 2 - item.name.length / 2);
      new GUI.TextWidget({
        origin: { x: nameX, y: 2 },
        initialState: {
          text: item.name,
        },
      }).setParent(panelWidget);
      // equip/unequip
      if (item.itemProperties?.equippable) {
        const equipped = item.itemProperties!.equipped;
        const equipText = equipped ? "Unequip" : "Equip";
        new GUI.ButtonWidget({
          origin: { x: 2, y: 4 },
          initialState: {
            text: equipText,
            backColor: Palette.Ebony,
            foreColor: Palette.GreyNurse,
            hoverColor: Palette.Atomic,
            downColor: Palette.William,
            onClick: () => {
              if (equipped) {
                Actions.unequipItem(this.game, this.game.player!, item);
              } else {
                Actions.equipItem(this.game, this.game.player!, item);
              }
              this.game.updateScreen = true;
              Actions.closeItemDetails(this.game);
            },
          },
        }).setParent(panelWidget);
      }
      // drop
      new GUI.ButtonWidget({
        origin: { x: 2, y: 5 },
        initialState: {
          text: "Drop",
          backColor: Palette.Ebony,
          foreColor: Palette.GreyNurse,
          hoverColor: Palette.Atomic,
          downColor: Palette.William,
          onClick: () => {
            Actions.dropItem(this.game, this.game.player!, item);
            this.game.updateScreen = true;
            Actions.closeItemDetails(this.game);
          },
        },
      }).setParent(panelWidget);
    }
    container.setDisabled(true);
    return container;
  }

  notify(_state: GameState): void {
    // this.guiContainer.setDisabled(state !== GameState.EscapeMenu);
  }
  render(): void {
    if (this.game.itemToDescribe) {
      if (!this.itemSet) {
        this.guiContainer = this.constructGui();
      }
      this.guiContainer.setDisabled(false);
      this.guiContainer.cascadeDraw();
    } else {
      this.itemSet = false;
      this.guiContainer.setDisabled(true);
    }
  }
}
