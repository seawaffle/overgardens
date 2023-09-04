import { GUI } from "malwoden";
import { Screen } from "./screen";
import * as Actions from "../actions";
import { Game } from "../game";
import { GameState, Palette, HoverState } from "../data";
import { TextWidget } from "./text-widget";

export class CharacterScreen extends Screen {
  guiContainer: GUI.ContainerWidget;
  might: TextWidget | undefined = undefined;
  agility: TextWidget | undefined = undefined;
  stability: TextWidget | undefined = undefined;
  intellect: TextWidget | undefined = undefined;

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
        text: "Character Sheet",
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
          Actions.closeCharacterSheet(this.game);
        },
      },
    }).setParent(panelWidget);
    // might
    this.might = new TextWidget({
      origin: { x: 2, y: 2 },
      initialState: {
        text: "Might:",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    })
      .setUpdateFunc(() => {
        let text = "";
        if (this.game.player) {
          const value =
            this.game.player.body!.might!.base +
            this.game.player.body!.might!.modifier;
          const bonus = this.game.player.body!.might!.bonus;
          text = `Might: ${value} (${bonus > 0 ? "+" + bonus : bonus})`;
        }
        if (this.might && this.might.getMouseState() !== HoverState.None) {
          const message = [
            "Might",
            "Determines ability to hit and damage when using melee weapons.",
            `Base: ${this.game.player!.body!.might!.base}`,
            `Modifier: ${this.game.player!.body!.might!.modifier}`,
            `Bonus: ${
              this.game.player!.body!.might!.bonus > 0
                ? "+" + this.game.player!.body!.might!.bonus
                : this.game.player!.body!.might!.bonus
            }`,
          ];
          this.game.log.setOverride(...message);
        }
        return { text };
      })
      .setParent(panelWidget);
    // agility
    this.agility = new TextWidget({
      origin: { x: 2, y: 3 },
      initialState: {
        text: "Agility:",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    })
      .setUpdateFunc(() => {
        let text = "";
        if (this.game.player) {
          const value =
            this.game.player.body!.agility!.base +
            this.game.player.body!.agility!.modifier;
          const bonus = this.game.player.body!.agility!.bonus;
          text = `Agility: ${value} (${bonus > 0 ? "+" + bonus : bonus})`;
        }
        if (this.agility && this.agility.getMouseState() !== HoverState.None) {
          const message = [
            "Agility",
            "Determines speed and ability to dodge.",
            "Also determines to hit and damage when using ranged weapons.",
            `Base: ${this.game.player!.body!.agility!.base}`,
            `Modifier: ${this.game.player!.body!.agility!.modifier}`,
            `Bonus: ${
              this.game.player!.body!.agility!.bonus > 0
                ? "+" + this.game.player!.body!.agility!.bonus
                : this.game.player!.body!.agility!.bonus
            }`,
          ];
          this.game.log.setOverride(...message);
        }
        return { text };
      })
      .setParent(panelWidget);
    // stability
    this.stability = new TextWidget({
      origin: { x: 2, y: 4 },
      initialState: {
        text: "Stability:",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    })
      .setUpdateFunc(() => {
        let text = "";
        if (this.game.player) {
          const value =
            this.game.player.body!.stability!.base +
            this.game.player.body!.stability!.modifier;
          const bonus = this.game.player.body!.stability!.bonus;
          text = `Stability: ${value} (${bonus > 0 ? "+" + bonus : bonus})`;
        }
        if (
          this.stability &&
          this.stability.getMouseState() !== HoverState.None
        ) {
          const message = [
            "Stability",
            "Determines hit points and ability to endure mutation.",
            `Base: ${this.game.player!.body!.stability!.base}`,
            `Modifier: ${this.game.player!.body!.stability!.modifier}`,
            `Bonus: ${
              this.game.player!.body!.stability!.bonus > 0
                ? "+" + this.game.player!.body!.stability!.bonus
                : this.game.player!.body!.stability!.bonus
            }`,
          ];
          this.game.log.setOverride(...message);
        }
        return { text };
      })
      .setParent(panelWidget);
    // intellect
    this.intellect = new TextWidget({
      origin: { x: 2, y: 5 },
      initialState: {
        text: "Intellect:",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    })
      .setUpdateFunc(() => {
        let text = "";
        if (this.game.player) {
          const value =
            this.game.player.body!.intellect!.base +
            this.game.player.body!.intellect!.modifier;
          const bonus = this.game.player.body!.intellect!.bonus;
          text = `Intellect: ${value} (${bonus > 0 ? "+" + bonus : bonus})`;
        }
        if (
          this.intellect &&
          this.intellect.getMouseState() !== HoverState.None
        ) {
          const message = [
            "Intellect",
            "Determines how often special abilities can be used.",
            `Base: ${this.game.player!.body!.intellect!.base}`,
            `Modifier: ${this.game.player!.body!.intellect!.modifier}`,
            `Bonus: ${
              this.game.player!.body!.intellect!.bonus > 0
                ? "+" + this.game.player!.body!.intellect!.bonus
                : this.game.player!.body!.intellect!.bonus
            }`,
          ];
          this.game.log.setOverride(...message);
        }
        return { text };
      })
      .setParent(panelWidget);
    // level
    new GUI.TextWidget({
      origin: { x: 2, y: 7 },
      initialState: {
        text: "Level:",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    })
      .setUpdateFunc(() => {
        let text = "";
        if (this.game.player) {
          const value = this.game.player.body!.level!.current;
          text = `Level: ${value}`;
        }
        return { text };
      })
      .setParent(panelWidget);
    // hp
    new GUI.TextWidget({
      origin: { x: 2, y: 8 },
      initialState: {
        text: "HP:",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    })
      .setUpdateFunc(() => {
        let text = "";
        if (this.game.player) {
          const value = this.game.player.body!.hp!.current;
          const max = this.game.player.body!.hp!.max;
          text = `HP: ${value} / ${max}`;
        }
        return { text };
      })
      .setParent(panelWidget);
    // xp
    new GUI.TextWidget({
      origin: { x: 2, y: 9 },
      initialState: {
        text: "XP:",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    })
      .setUpdateFunc(() => {
        let text = "";
        if (this.game.player) {
          const value = this.game.player.body!.xp!.current;
          const max = this.game.player.body!.xp!.max;
          text = `XP: ${value} / ${max} to next level`;
        }
        return { text };
      })
      .setParent(panelWidget);
    // dr
    new GUI.TextWidget({
      origin: { x: 2, y: 11 },
      initialState: {
        text: "DR:",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    })
      .setUpdateFunc(() => {
        let text = "";
        if (this.game.player) {
          const value = this.game.player.body!.damageReduction!;
          text = `DR: ${value}`;
        }
        return { text };
      })
      .setParent(panelWidget);

    // dv
    new GUI.TextWidget({
      origin: { x: 2, y: 12 },
      initialState: {
        text: "DV:",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    })
      .setUpdateFunc(() => {
        let text = "";
        if (this.game.player) {
          const value = this.game.player.body!.dodgeValue!;
          text = `DV: ${value}`;
        }
        return { text };
      })
      .setParent(panelWidget);
    new GUI.TextWidget({
      origin: { x: 2, y: 14 },
      initialState: {
        text: "Gifts:",
        backColor: Palette.Ebony,
        foreColor: Palette.GreyNurse,
      },
    }).setParent(panelWidget);
    if (this.game.player?.receivedGifts) {
      let y = 15;
      for (const gift of this.game.player!.receivedGifts) {
        new GUI.TextWidget({
          origin: { x: 2, y },
          initialState: {
            text: gift.name,
            backColor: Palette.Ebony,
            foreColor: Palette.GreyNurse,
          },
        }).setParent(panelWidget);
        y++;
      }
    }
    container.setDisabled(true);
    return container;
  }

  // notify(state: GameState): void {
  //   if (state !== GameState.Character) {
  //     // not sure about this
  //     this.game.log.clearOverride();
  //   }
  //   this.guiContainer.setDisabled(state !== GameState.Character);
  // }
  // render(): void {
  //   if (!this.guiContainer.isDisabled()) {
  //     this.game.log.clearOverride();
  //     this.guiContainer.cascadeUpdate();
  //     this.guiContainer.cascadeDraw();
  //   }
  // }

  notify(state: GameState): void {
    if (state === GameState.Character) {
      this.guiContainer.clearMouseContext();
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
    } else {
      this.game.log.clearOverride();
      this.guiContainer.setDisabled(true);
    }
  }
  render(): void {
    if (
      this.game.updateScreen &&
      this.game.gameState.state === GameState.Character
    ) {
      this.game.log.clearOverride();
      this.guiContainer.clearMouseContext();
      this.guiContainer = this.constructGui();
      this.guiContainer.setDisabled(false);
      this.game.updateScreen = false;
    }
    this.guiContainer.cascadeUpdate();
    this.guiContainer.cascadeDraw();
  }
}
