import { Input } from "malwoden";
import { Manager } from "./manager";
import { Game } from "../game";
import { GameState, StateListener } from "../data";
import {
  AdventureContext,
  InventoryContext,
  MainMenuContext,
  HelpContext,
  EscapeContext,
  ExamineContext,
  GameOverContext,
  AdventureMouseContext,
} from "../input";

export class InputManager extends Manager implements StateListener {
  keyboardHandler: Input.KeyboardHandler;
  mouseContext: Input.MouseContext;
  mouseHandler: Input.MouseHandler;

  constructor(game: Game) {
    super(game);

    this.game.gameState.registerListener(this);

    this.keyboardHandler = new Input.KeyboardHandler();
    this.mouseContext = new Input.MouseContext();
    this.mouseHandler = new Input.MouseHandler().setContext(this.mouseContext);
  }
  notify(state: GameState): void {
    switch (state) {
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
      case GameState.Examine: {
        this.keyboardHandler.setContext(new ExamineContext(this.game));
        break;
      }
      case GameState.GameOver: {
        this.keyboardHandler.setContext(new GameOverContext(this.game));
        break;
      }
      default: {
        this.keyboardHandler.setContext(new AdventureContext(this.game));
        this.mouseHandler.setContext(new AdventureMouseContext(this.game));
      }
    }
  }
}
