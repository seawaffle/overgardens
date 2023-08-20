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
  ExamineMouseContext,
  ContextMenuContext,
} from "../input";

export class InputManager extends Manager implements StateListener {
  keyboardHandler: Input.KeyboardHandler;
  mouseContext: Input.MouseContext;
  mouseHandler: Input.MouseHandler;
  standardMouseContext: Input.MouseContext;
  adventureMouseContext: AdventureMouseContext;
  examineMouseContext: ExamineMouseContext;

  constructor(game: Game) {
    super(game);

    this.game.gameState.registerListener(this);

    this.keyboardHandler = new Input.KeyboardHandler();
    this.mouseContext = this.standardMouseContext = new Input.MouseContext();
    this.mouseHandler = new Input.MouseHandler().setContext(this.mouseContext);
    this.adventureMouseContext = new AdventureMouseContext(this.game);
    this.examineMouseContext = new ExamineMouseContext(this.game);
  }
  notify(state: GameState): void {
    switch (state) {
      case GameState.MainMenu: {
        this.keyboardHandler.setContext(new MainMenuContext(this.game));
        this.mouseContext = this.standardMouseContext;
        this.mouseHandler.setContext(this.mouseContext);
        break;
      }
      case GameState.Inventory: {
        this.keyboardHandler.setContext(new InventoryContext(this.game));
        this.mouseContext = this.standardMouseContext;
        this.mouseHandler.setContext(this.mouseContext);
        break;
      }
      case GameState.HelpScreen: {
        this.keyboardHandler.setContext(new HelpContext(this.game));
        this.mouseContext = this.standardMouseContext;
        this.mouseHandler.setContext(this.mouseContext);
        break;
      }
      case GameState.EscapeMenu: {
        this.keyboardHandler.setContext(new EscapeContext(this.game));
        this.mouseContext = this.standardMouseContext;
        this.mouseHandler.setContext(this.mouseContext);
        break;
      }
      case GameState.Examine: {
        this.keyboardHandler.setContext(new ExamineContext(this.game));
        this.mouseContext = this.examineMouseContext;
        this.mouseHandler.setContext(this.mouseContext);
        break;
      }
      case GameState.GameOver: {
        this.keyboardHandler.setContext(new GameOverContext(this.game));
        this.mouseContext = this.standardMouseContext;
        this.mouseHandler.setContext(this.mouseContext);
        break;
      }
      case GameState.ContextMenu: {
        this.keyboardHandler.setContext(new ContextMenuContext(this.game));
        this.mouseContext = this.standardMouseContext;
        this.mouseHandler.setContext(this.mouseContext);
        break;
      }
      default: {
        this.keyboardHandler.setContext(new AdventureContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        this.mouseHandler.setContext(this.mouseContext);
      }
    }
  }
}
