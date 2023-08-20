import { GUI } from "malwoden";
import { Screen } from "./screen";
import { Game } from "../game";
import { Palette } from "../data";
import * as Actions from "../actions";

export class HUDScreen extends Screen {
  static HUD_HEIGHT = 10;
  static HUD_Y = 0;
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
    const hudWidth =
      this.game.render.displayWidth - this.game.render.viewportWidth;
    const hudX = this.game.render.viewportWidth;
    const panelWidget = new GUI.PanelWidget({
      origin: { x: hudX, y: HUDScreen.HUD_Y },
      initialState: {
        width: hudWidth,
        height: HUDScreen.HUD_HEIGHT,
        borderStyle: "single-bar",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(container);
    // name
    new GUI.TextWidget({
      origin: { x: 1, y: 0 },
      initialState: {
        text: "",
      },
    })
      .setUpdateFunc(() => {
        let text = "";
        if (this.game.player) {
          text = this.game.player.name;
        }
        return { text };
      })
      .setParent(panelWidget);
    // menu button
    new GUI.ButtonWidget({
      origin: { x: hudWidth - 2, y: 0 },
      initialState: {
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
        hoverColor: Palette.Atomic,
        onClick: () => {
          Actions.openContextMenu(this.game);
        },
        text: "≡",
      }
    }).setParent(panelWidget);
    // hp
    new GUI.TextWidget({
      origin: { x: 1, y: 2 },
      initialState: {
        text: "",
      },
    })
      .setUpdateFunc(() => {
        let text = "";
        if (this.game.player) {
          text = `HP: ${this.game.player.body!.hp} / ${
            this.game.player.body!.maxHp
          }`;
        }
        return { text };
      })
      .setParent(panelWidget);
    container.setDisabled(false);
    return container;
  }

  render(): void {
    this.guiContainer.cascadeUpdate();
    this.guiContainer.cascadeDraw();
  }
}
