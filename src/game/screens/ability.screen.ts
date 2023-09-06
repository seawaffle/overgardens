import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette } from "../data";
import { TextWidget } from "./text-widget";
import { indexToLetter } from "../utils";

export class AbilityScreen extends Screen {
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
        text: "Abilities",
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
          Actions.closeAbilities(this.game);
        },
      },
    }).setParent(panelWidget);
    const abilities = this.game.player?.abilities;

    // inventory items
    if (abilities && abilities.length > 0) {
      let y = 2;
      for (let i = this.game.screenLineNumber; i < abilities.length; i++) {
        const ability = abilities[i];
        const coolDown = `CD: ${ability.cooldownAmount}`;
        let turnsLeft = "<Ready>";
        let foreColor = Palette.GreyNurse;
        if (ability.turnsLeft !== 0) {
          turnsLeft = `<${ability.turnsLeft} to go>`;
          foreColor = Palette.Edward;
        }
        const abilityText = `${indexToLetter(i)}) ${
          ability.name
        } - ${turnsLeft} - ${coolDown}`;
        new TextWidget({
          origin: { x: 2, y },
          initialState: {
            backColor: Palette.Ebony,
            foreColor: foreColor,
            text: abilityText,
            onClick: () => {
              //todo
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
    if (state === GameState.Abilities) {
      this.guiContainer.clearMouseContext();
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
    } else {
      this.guiContainer.setDisabled(true);
    }
  }
  render(): void {
    if (this.game.gameState.state === GameState.Abilities) {
      this.game.log.clearOverride();
      if (this.game.updateScreen) {
        this.guiContainer.clearMouseContext();
        this.guiContainer = this.constructGui();
        this.guiContainer.setDisabled(false);
        this.game.updateScreen = false;
      }
    }
    this.guiContainer.cascadeDraw();
  }
}
