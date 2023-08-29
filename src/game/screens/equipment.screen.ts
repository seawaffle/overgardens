import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette } from "../data";
import { Entity } from "../components";
import { TextWidget } from "./text-widget";
import { indexToLetter } from "../utils";

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
    if (this.game.player) {
      const slots = this.game.player.body!.slots!;
      let y = 2;
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        const equipment = this.createItemText(slot.equippedItem);
        new TextWidget({
          origin: { x: 2, y },
          initialState: {
            backColor: Palette.Ebony,
            foreColor: Palette.GreyNurse,
            text: `${indexToLetter(i)}) ${slot.name}${equipment}`,
            onClick: () => {
              if (
                slot.equippedItem &&
                !slot.equippedItem!.itemProperties!.natural
              ) {
                Actions.openItemDetails(this.game, slot.equippedItem);
              } else {
                Actions.openItemPicker(this.game, slot);
              }
            },
          },
        }).setParent(panelWidget);
        y++;
      }
    }
    container.setDisabled(true);
    return container;
  }

  createItemText(entity: Entity | undefined): string {
    let text = " -- Nothing --";
    if (entity) {
      const props = entity.itemProperties!;
      text = ` - ${entity.name}`;
      if (props.dodgeValue) {
        text += ` ${props.dodgeValue}DV`;
      }
      if (props.damageReduction) {
        text += ` ${props.damageReduction}DR`;
      }
      if (props.damage) {
        text += ` ${props.damage}`;
      }
    }
    return text;
  }

  notify(state: GameState): void {
    if (state === GameState.Equipment) {
      this.guiContainer.clearMouseContext();
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
    } else {
      this.guiContainer.setDisabled(true);
    }
  }
  render(): void {
    if (
      this.game.updateScreen &&
      this.game.gameState.state === GameState.Equipment
    ) {
      this.guiContainer.clearMouseContext();
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
      this.game.updateScreen = false;
    }
    this.guiContainer.cascadeDraw();
  }
}
