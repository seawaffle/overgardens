import { Input } from "malwoden";
import { Manager } from "./manager";
import { Game } from "../game";
import { GameState } from "../game-state";
import { AdventureContext, InventoryContext, MainMenuContext } from "../input";

export class InputManager extends Manager {
  handler: Input.KeyboardHandler;
  currentState: GameState;

  constructor(game: Game) {
    super(game);

    this.handler = new Input.KeyboardHandler();
    this.currentState = GameState.Init;
  }

  update() {
    let newState = this.game.gameState.state;
    if (newState === this.currentState) {
      return;
    }
    switch (newState) {
      case GameState.MainMenu: {
        this.handler.setContext(new MainMenuContext(this.game));
        break;
      }
      case GameState.Inventory: {
        this.handler.setContext(new InventoryContext(this.game));
        break;
      }
      default: {
        this.handler.setContext(new AdventureContext(this.game));
      }
    }
    this.currentState = newState;
  }
}
