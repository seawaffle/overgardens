import { Input } from "malwoden";
import { Manager } from "./manager";
import { Game } from "../game";
import { GameState } from "../data";
import {
  AdventureContext,
  InventoryContext,
  MainMenuContext,
  HelpContext,
  EscapeContext,
} from "../input";

export class InputManager extends Manager {
  keyboardHandler: Input.KeyboardHandler;
  mouseContext: Input.MouseContext;
  mouseHandler: Input.MouseHandler;
  currentState: GameState;

  constructor(game: Game) {
    super(game);

    this.keyboardHandler = new Input.KeyboardHandler();
    this.mouseContext = new Input.MouseContext();
    this.mouseHandler = new Input.MouseHandler().setContext(this.mouseContext);
    this.currentState = GameState.Init;
  }

  update() {
    const newState = this.game.gameState.state;
    if (newState === this.currentState) {
      return;
    }
    switch (newState) {
      case GameState.MainMenu: {
        this.keyboardHandler.setContext(new MainMenuContext(this.game));
        break;
      }
      case GameState.Inventory: {
        this.keyboardHandler.setContext(new InventoryContext(this.game));
        break;
      }
      case GameState.HelpScreen: {
        this.keyboardHandler.setContext(new HelpContext(this.game));
        break;
      }
      case GameState.EscapeMenu: {
        this.keyboardHandler.setContext(new EscapeContext(this.game));
        break;
      }
      default: {
        this.keyboardHandler.setContext(new AdventureContext(this.game));
      }
    }
    this.currentState = newState;
  }
}
