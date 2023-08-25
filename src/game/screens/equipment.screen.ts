import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette } from "../data";
import { Entity, SlotType } from "../components";
import { TextWidget } from "./text-widget";

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
      // head slots
      let y = 2;
      const headSlots = slots.filter((slot) => slot.type === SlotType.Head);
      for (const slot of headSlots) {
        let equipment = this.createItemText(slot.equippedItem);
        new TextWidget({
          origin: { x: 2, y },
          initialState: {
            text: `${slot.name}${equipment}`,
          },
        }).setParent(panelWidget);
        y++;
      }
      // body slots
      const bodySlots = slots.filter((slot) => slot.type === SlotType.Body);
      for (const slot of bodySlots) {
        let equipment = this.createItemText(slot.equippedItem);
        new TextWidget({
          origin: { x: 2, y },
          initialState: {
            text: `${slot.name}${equipment}`,
          },
        }).setParent(panelWidget);
        y++;
      }
      // hand slots
      const handSlots = slots.filter((slot) => slot.type === SlotType.Hand);
      for (const slot of handSlots) {
        let equipment = this.createItemText(slot.equippedItem);
        new TextWidget({
          origin: { x: 2, y },
          initialState: {
            text: `${slot.name}${equipment}`,
          },
        }).setParent(panelWidget);
        y++;
      }
      // glove slots
      const gloveSlots = slots.filter((slot) => slot.type === SlotType.Gloves);
      for (const slot of gloveSlots) {
        let equipment = this.createItemText(slot.equippedItem);
        new TextWidget({
          origin: { x: 2, y },
          initialState: {
            text: `${slot.name}${equipment}`,
          },
        }).setParent(panelWidget);
        y++;
      }
      // feet slots
      const feetSlots = slots.filter((slot) => slot.type === SlotType.Feet);
      for (const slot of feetSlots) {
        let equipment = this.createItemText(slot.equippedItem);
        new TextWidget({
          origin: { x: 2, y },
          initialState: {
            text: `${slot.name}${equipment}`,
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
      if (props.armorReduction) {
        text += ` ${props.armorReduction}AR`;
      }
      if (props.damage) {
        text += ` ${props.damage}`;
      }
    }
    return text;
  }

  notify(state: GameState): void {
    if (state === GameState.Equipment) {
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
    } else {
      this.guiContainer.setDisabled(true);
    }
  }
  render(): void {
    if (this.game.updateScreen && this.game.gameState.state === GameState.Equipment) {
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
      this.game.updateScreen = false;
    }
    this.guiContainer.cascadeDraw();
  }
}
