import { GUI } from "malwoden";
import { Screen } from "./screen";
import { Game } from "../game";
import { GameState, Palette } from "../data";
import * as Actions from "../actions";
import { Sacrifice } from "../managers/pantheon.manager";

export class CommunionScreen extends Screen {
  guiContainer: GUI.ContainerWidget;

  constructor(game: Game) {
    super(game);

    this.guiContainer = this.constructGui();
  }

  constructGui(): GUI.ContainerWidget {
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
        text: "Communion",
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
          Actions.closeCommunion(this.game);
        },
      },
    }).setParent(panelWidget);
    const altar = this.game.pantheon.altar;
    const ageless = this.game.pantheon.getAgelessForAltar();
    if (altar && ageless) {
      let text = `You kneel before an altar to ${ageless.name} ${ageless.epithet}.`;
      if (altar.altarProperties!.visited) {
        // already visited
        text += " It lies silent.";
        new GUI.TextWidget({
          origin: { x: 2, y: 2 },
          initialState: {
            text,
            wrapAt: this.game.render.viewportWidth - 4,
            backColor: Palette.Ebony,
            foreColor: Palette.GreyNurse,
          },
        }).setParent(panelWidget);
        const buttonText = "Leave";
        new GUI.ButtonWidget({
          origin: {
            x:
              Math.round(this.game.render.viewportWidth / 2) -
              Math.round(buttonText.length / 2),
            y: 8,
          },
          initialState: {
            text: buttonText,
            backColor: Palette.Ebony,
            foreColor: Palette.GreyNurse,
            hoverColor: Palette.Atomic,
            downColor: Palette.William,
            padding: 1,
            borderStyle: "single-bar",
            onClick: () => {
              Actions.closeCommunion(this.game);
            },
          },
        }).setParent(panelWidget);
      } else if (this.game.pantheon.sacrificed) {
        // reward
        text = `${ageless.name} is momentarily satisfied. They offer a gift. Will you accept?`;
        new GUI.TextWidget({
          origin: { x: 2, y: 2 },
          initialState: {
            text,
            wrapAt: this.game.render.viewportWidth - 4,
            backColor: Palette.Ebony,
            foreColor: Palette.GreyNurse,
          },
        }).setParent(panelWidget);
        let y = 8;
        for (const gift of this.game.pantheon.offeredGifts) {
          new GUI.ButtonWidget({
            origin: {
              x:
                Math.round(this.game.render.viewportWidth / 2) -
                Math.round(gift.name.length / 2),
              y,
            },
            initialState: {
              text: gift.name,
              backColor: Palette.Ebony,
              foreColor: Palette.GreyNurse,
              hoverColor: Palette.Atomic,
              downColor: Palette.William,
              padding: 1,
              borderStyle: "single-bar",
              onClick: () => {
                this.game.pantheon.acceptGift(this.game.player!, gift);
                Actions.closeCommunion(this.game);
              },
            },
          }).setParent(panelWidget);
          y += 4;
        }
      } else {
        // sacrifice
        text +=
          " You can feel their hunger for a sacrifice. What will you give?";
        new GUI.TextWidget({
          origin: { x: 2, y: 2 },
          initialState: {
            text,
            wrapAt: this.game.render.viewportWidth - 4,
            backColor: Palette.Ebony,
            foreColor: Palette.GreyNurse,
          },
        }).setParent(panelWidget);
        let buttonText = "Sacrifice Self";
        new GUI.ButtonWidget({
          origin: {
            x:
              Math.round(this.game.render.viewportWidth / 2) -
              Math.round(buttonText.length / 2),
            y: 8,
          },
          initialState: {
            text: buttonText,
            backColor: Palette.Ebony,
            foreColor: Palette.GreyNurse,
            hoverColor: Palette.Atomic,
            downColor: Palette.William,
            padding: 1,
            borderStyle: "single-bar",
            onClick: () => {
              this.game.pantheon.sacrifice(Sacrifice.Self);
              this.game.updateScreen = true;
            },
          },
        }).setParent(panelWidget);
        buttonText = "Sacrifice Vigor";
        new GUI.ButtonWidget({
          origin: {
            x:
              Math.round(this.game.render.viewportWidth / 2) -
              Math.round(buttonText.length / 2),
            y: 12,
          },
          initialState: {
            text: buttonText,
            backColor: Palette.Ebony,
            foreColor: Palette.GreyNurse,
            hoverColor: Palette.Atomic,
            downColor: Palette.William,
            padding: 1,
            borderStyle: "single-bar",
            onClick: () => {
              this.game.pantheon.sacrifice(Sacrifice.Vigor);
              this.game.updateScreen = true;
            },
          },
        }).setParent(panelWidget);
        if (this.game.player!.inventory!.items.length > 0) {
          buttonText = "Sacrifice Possessions";
          new GUI.ButtonWidget({
            origin: {
              x:
                Math.round(this.game.render.viewportWidth / 2) -
                Math.round(buttonText.length / 2),
              y: 16,
            },
            initialState: {
              text: buttonText,
              backColor: Palette.Ebony,
              foreColor: Palette.GreyNurse,
              hoverColor: Palette.Atomic,
              downColor: Palette.William,
              padding: 1,
              borderStyle: "single-bar",
              onClick: () => {
                this.game.pantheon.sacrifice(Sacrifice.Possessions);
                this.game.updateScreen = true;
              },
            },
          }).setParent(panelWidget);
        }
      }
    }
    container.setDisabled(true);
    return container;
  }

  notify(state: GameState): void {
    if (state === GameState.Communion) {
      this.guiContainer.clearMouseContext();
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
    } else {
      this.guiContainer.setDisabled(true);
    }
  }
  render(): void {
    if (this.game.gameState.state === GameState.Communion) {
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
