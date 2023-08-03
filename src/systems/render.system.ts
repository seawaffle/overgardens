import { Color, GUI, Glyph } from "malwoden";
import { System } from "./system";
import { Game } from "../game";
import { Query, With } from "miniplex";
import { Entity } from "../components";
import { GameState } from "../game-state";
import * as Actions from "../actions";

export class RenderSystem extends System {
  renderQuery: Query<With<Entity, "position" | "renderable">>;
  mainMenuGui: GUI.ContainerWidget;
  inventoryGui: GUI.ContainerWidget;
  helpGui: GUI.ContainerWidget;
  escapeGui: GUI.ContainerWidget;

  constructor(game: Game) {
    super(game);

    this.renderQuery = this.game.ecs.world.with("position", "renderable");
    this.inventoryGui = this.constructInventory();
    this.mainMenuGui = this.constructMainMenu();
    this.helpGui = this.constructHelp();
    this.escapeGui = this.constructEscape();
  }

  constructHelp(): GUI.ContainerWidget {
    const container = new GUI.ContainerWidget()
      .setMouseHandler(this.game.input.mouseHandler)
      .registerMouseContext(this.game.input.mouseContext)
      .setTerminal(this.game.render.terminal);
    const panelWidget = new GUI.PanelWidget({
      origin: { x: 0, y: 0 },
      initialState: {
        width: 80,
        height: 50,
        borderStyle: "double-bar",
      },
    }).setParent(container);
    // title
    new GUI.TextWidget({
      origin: { x: 2, y: 0 },
      initialState: { text: "Help" },
    }).setParent(panelWidget);
    // close button
    new GUI.ButtonWidget({
      origin: { x: 79, y: 0 },
      initialState: {
        text: "X",
        hoverColor: Color.DarkSlateGray,
        onClick: () => {
          Actions.closeHelp(this.game);
        },
      },
    }).setParent(panelWidget);
    container.setDisabled(true);
    return container;
  }

  constructEscape(): GUI.ContainerWidget {
    const container = new GUI.ContainerWidget()
      .setMouseHandler(this.game.input.mouseHandler)
      .registerMouseContext(this.game.input.mouseContext)
      .setTerminal(this.game.render.terminal);
    const panelWidget = new GUI.PanelWidget({
      origin: { x: 25, y: 15 },
      initialState: {
        width: 30,
        height: 10,
        borderStyle: "single-bar",
      },
    }).setParent(container);
    // close button
    new GUI.ButtonWidget({
      origin: { x: 29, y: 0 },
      initialState: {
        text: "X",
        hoverColor: Color.DarkSlateGray,
        onClick: () => {
          Actions.closeEscapeMenu(this.game);
        },
      },
    }).setParent(panelWidget);
    // save button
    new GUI.ButtonWidget({
      origin: { x: 2, y: 2 },
      initialState: {
        text: "[S]ave Game",
        hoverColor: Color.DarkSlateGray,
        onClick: () => {
          Actions.newGame(this.game);
        },
      },
    }).setParent(panelWidget);
    // quit button
    new GUI.ButtonWidget({
      origin: { x: 2, y: 4 },
      initialState: {
        text: "[Q]uit",
        hoverColor: Color.DarkSlateGray,
        onClick: () => {
          Actions.newGame(this.game);
        },
      },
    }).setParent(panelWidget);
    container.setDisabled(true);
    return container;
  }

  constructInventory(): GUI.ContainerWidget {
    const container = new GUI.ContainerWidget()
      .setMouseHandler(this.game.input.mouseHandler)
      .registerMouseContext(this.game.input.mouseContext)
      .setTerminal(this.game.render.terminal);
    const panelWidget = new GUI.PanelWidget({
      origin: { x: 0, y: 0 },
      initialState: {
        width: 80,
        height: 50,
        borderStyle: "double-bar",
      },
    }).setParent(container);
    // title
    new GUI.TextWidget({
      origin: { x: 2, y: 0 },
      initialState: { text: "Inventory" },
    }).setParent(panelWidget);
    // close button
    new GUI.ButtonWidget({
      origin: { x: 79, y: 0 },
      initialState: {
        text: "X",
        hoverColor: Color.DarkSlateGray,
        onClick: () => {
          Actions.closeInventory(this.game);
        },
      },
    }).setParent(panelWidget);
    container.setDisabled(true);
    return container;
  }

  constructMainMenu(): GUI.ContainerWidget {
    const container = new GUI.ContainerWidget()
      .setMouseHandler(this.game.input.mouseHandler)
      .registerMouseContext(this.game.input.mouseContext)
      .setTerminal(this.game.render.terminal);
    const panelWidget = new GUI.PanelWidget({
      origin: { x: 0, y: 0 },
      initialState: {
        width: 80,
        height: 50,
        borderStyle: "double-bar",
      },
    }).setParent(container);
    // title
    new GUI.TextWidget({
      origin: { x: 25, y: 2 },
      initialState: { text: "Overgardens of the Ageless" },
    }).setParent(panelWidget);
    // new game button
    new GUI.ButtonWidget({
      origin: { x: 30, y: 8 },
      initialState: {
        text: "[N]ew Game",
        hoverColor: Color.DarkSlateGray,
        // padding: 1,
        // borderStyle: "single-bar",
        onClick: () => {
          Actions.newGame(this.game);
        },
      },
    }).setParent(panelWidget);
    // load game button
    new GUI.ButtonWidget({
      origin: { x: 30, y: 10 },
      initialState: {
        text: "[L]oad Game",
        hoverColor: Color.DarkSlateGray,
        // padding: 1,
        // borderStyle: "single-bar",
        onClick: () => {
          Actions.loadGame(this.game);
        },
      },
    }).setParent(panelWidget);
    container.setDisabled(true);
    return container;
  }

  update(): void {
    switch (this.game.gameState.state) {
      case GameState.Inventory: {
        this.renderInventory();
        break;
      }
      case GameState.MainMenu: {
        this.renderMainMenu();
        break;
      }
      case GameState.HelpScreen: {
        this.renderHelpMenu();
        break;
      }
      default: {
        this.renderWorld();
        if (this.game.gameState.state === GameState.EscapeMenu) {
          this.renderEscapeMenu();
        }
      }
    }
  }

  renderMainMenu(): void {
    if (this.mainMenuGui.isDisabled()) {
      this.mainMenuGui.setDisabled(false);
      this.inventoryGui.setDisabled(true);
      this.helpGui.setDisabled(true);
      this.escapeGui.setDisabled(true);
    }
    this.mainMenuGui.cascadeDraw();
  }

  renderHelpMenu(): void {
    if (this.helpGui.isDisabled()) {
      this.helpGui.setDisabled(false);
      this.mainMenuGui.setDisabled(true);
      this.inventoryGui.setDisabled(true);
      this.escapeGui.setDisabled(true);
    }
    this.helpGui.cascadeDraw();
  }

  renderEscapeMenu(): void {
    if (this.escapeGui.isDisabled()) {
      this.escapeGui.setDisabled(false);
      this.helpGui.setDisabled(true);
      this.mainMenuGui.setDisabled(true);
      this.inventoryGui.setDisabled(true);
    }
    this.escapeGui.cascadeDraw();
  }

  renderInventory(): void {
    if (this.inventoryGui.isDisabled()) {
      this.inventoryGui.setDisabled(false);
      this.mainMenuGui.setDisabled(true);
      this.helpGui.setDisabled(true);
      this.escapeGui.setDisabled(true);
    }
    this.inventoryGui.cascadeDraw();
  }

  renderWorld(): void {
    const level = this.game.map.getCurrentLevel();
    for (let x = 0; x < level.tiles.width; x++) {
      for (let y = 0; y < level.tiles.height; y++) {
        const v = { x, y };
        const explored = level.exploredTiles.get(v)!;
        const visible = level.visibleTiles.get(v)!;
        const tile = level.tiles.get(v)!;
        if (visible) {
          this.game.render.draw(v, new Glyph(tile.character, tile.color_light));
        } else if (explored) {
          this.game.render.draw(v, new Glyph(tile.character, tile.color_dark));
        }
      }
    }
    for (const { position, renderable } of this.renderQuery) {
      this.game.render.draw(position.pos, renderable.glyph);
    }
  }
}
