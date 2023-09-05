import { GUI } from "malwoden";
import { Screen } from "./screen";
import { Game } from "../game";
import { Palette } from "../data";
// import * as Actions from "../actions";
import { TextWidget } from "./text-widget";

export class ActionBarScreen extends Screen {
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
    const y = this.game.render.viewportHeight;
    const panelWidget = new GUI.PanelWidget({
      origin: { x: 0, y },
      initialState: {
        width: this.game.render.displayWidth,
        // height: this.game.render.actionHeight,
        height: 5,
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(container);
    for (let x = 0; x < 10; x++) {
      const buttonPanel = new GUI.PanelWidget({
        origin: { x: x * 6, y: 0 },
        initialState: {
          width: 6,
        // height: this.game.render.actionHeight,
        height: 5,
          backColor: Palette.Ebony,
          foreColor: Palette.GreyNurse,
        },
      }).setParent(panelWidget);
      const display = `${x === 9 ? 0 : x + 1}`;
      new TextWidget({
        origin: { x: 0, y: 0 },
        initialState: {
          text: `  ${display}  poop${x}`,
          wrapAt: 6,
        },
      }).setParent(buttonPanel);
    }
    container.setDisabled(false);
    return container;
  }

  render(): void {
    this.guiContainer.cascadeUpdate();
    this.guiContainer.cascadeDraw();
  }
}
