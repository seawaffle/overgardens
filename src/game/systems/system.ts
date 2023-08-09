import { Game } from "../game";

export class System {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  update() {}
}
