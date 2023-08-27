import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette } from "../data";
import { TextWidget } from "./text-widget";

export class ItemPickerScreen extends Screen {
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
          Actions.closeItemPicker(this.game);
        },
      },
    }).setParent(panelWidget);
    if (this.game.slotToEquip) {
      this.slotSet = true;
      const slot = this.game.slotToEquip;
      const items = this.game
        .player!.inventory!.items.filter(
          (item) => item.itemProperties?.slotType === slot.type,
        )
        .filter((item) => item.itemProperties?.equippable)
        .filter((item) => !item.itemProperties?.equipped);
      let y = 2;
      if (items.length === 0) {
        new TextWidget({
          origin: { x: 2, y },
          initialState: {
            backColor: Palette.Ebony,
            foreColor: Palette.GreyNurse,
            text: "No equippable items",
            wrapAt: this.WIDTH - 4,
          },
        }).setParent(panelWidget);
      } else {
        for (const item of items) {
          new TextWidget({
            origin: { x: 2, y },
            initialState: {
              backColor: Palette.Ebony,
              foreColor: Palette.GreyNurse,
              text: item.name,
              onClick: () => {
                Actions.equipItem(this.game, this.game.player!, item, slot);
                this.game.updateScreen = true;
                Actions.closeItemPicker(this.game);
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

  notify(_state: GameState): void {
    // this.guiContainer.setDisabled(state !== GameState.EscapeMenu);
  }
  render(): void {
    if (this.game.slotToEquip) {
      if (!this.slotSet) {
        this.guiContainer = this.constructGui();
      }
      this.guiContainer.setDisabled(false);
      this.guiContainer.cascadeDraw();
    } else {
      this.slotSet = false;
      this.guiContainer.setDisabled(true);
    }
  }
}
