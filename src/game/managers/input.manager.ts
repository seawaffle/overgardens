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
  FullLogContext,
  CharacterContext,
  EquipmentContext,
  CommunionContext,
  AbilityContext,
  TargetingMouseContext,
  TargetingContext,
  BarSettingsContext,
} from "../input";

export class InputManager extends Manager implements StateListener {
  keyboardHandler: Input.KeyboardHandler;
  mouseContext: Input.MouseContext;
  mouseHandler: Input.MouseHandler;
  adventureMouseContext: AdventureMouseContext;

  constructor(game: Game) {
    super(game);

    this.game.gameState.registerListener(this);

    this.keyboardHandler = new Input.KeyboardHandler();
    this.adventureMouseContext = new AdventureMouseContext(this.game);
    this.mouseContext = this.adventureMouseContext;
    this.mouseHandler = new Input.MouseHandler().setContext(this.mouseContext);
  }
  notify(state: GameState): void {
    switch (state) {
      case GameState.MainMenu: {
        this.keyboardHandler.setContext(new MainMenuContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        break;
      }
      case GameState.Inventory: {
        this.keyboardHandler.setContext(new InventoryContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        break;
      }
      case GameState.Character: {
        this.keyboardHandler.setContext(new CharacterContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        break;
      }
      case GameState.Equipment: {
        this.keyboardHandler.setContext(new EquipmentContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        break;
      }
      case GameState.HelpScreen: {
        this.keyboardHandler.setContext(new HelpContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        break;
      }
      case GameState.EscapeMenu: {
        this.keyboardHandler.setContext(new EscapeContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        break;
      }
      case GameState.Examine: {
        this.keyboardHandler.setContext(new ExamineContext(this.game));
        this.mouseContext = new ExamineMouseContext(this.game);
        break;
      }
      case GameState.GameOver: {
        this.keyboardHandler.setContext(new GameOverContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        break;
      }
      case GameState.ContextMenu: {
        this.keyboardHandler.setContext(new ContextMenuContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        break;
      }
      case GameState.FullLog: {
        this.keyboardHandler.setContext(new FullLogContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        break;
      }
      case GameState.Communion: {
        this.keyboardHandler.setContext(new CommunionContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        break;
      }
      case GameState.Abilities: {
        this.keyboardHandler.setContext(new AbilityContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        break;
      }
      case GameState.Targeting: {
        this.keyboardHandler.setContext(new TargetingContext(this.game));
        this.mouseContext = new TargetingMouseContext(this.game);
        break;
      }
      case GameState.BarSettings: {
        this.keyboardHandler.setContext(new BarSettingsContext(this.game));
        this.mouseContext = this.adventureMouseContext;
        break;
      }
      default: {
        this.keyboardHandler.setContext(new AdventureContext(this.game));
        this.mouseContext = this.adventureMouseContext;
      }
    }
    this.mouseHandler.setContext(this.mouseContext);
  }
}
