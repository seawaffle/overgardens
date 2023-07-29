import { ECSManager, GameStateManager, InputManager, MapManager, RenderManager } from "./managers";

export class Game {
  lastTime = performance.now(); // We add a field to keep track of the last time the loop ran
  ecs: ECSManager;
  gameState: GameStateManager;
  input: InputManager;
  map: MapManager;
  render: RenderManager;
  
  constructor() {
    this.ecs = new ECSManager(this);
    this.gameState = new GameStateManager(this);
    this.input = new InputManager(this);
    this.map = new MapManager(this);
    this.render = new RenderManager(this);
  }

  start() {
    window.requestAnimationFrame(this.run.bind(this));
  }

  tick(delta: number, time: number) {
    // We'll put more code here later
    // For now, let's just write to the terminal every frame
    this.render.clear();
    this.render.render();
  }

  run() {
    const time = performance.now(); // Get the current time
    const delta = time - this.lastTime; // Calculate the difference

    this.tick(delta, this.lastTime); // Run our tick method with the times calculated
  }
}
