import {
  ECSManager,
  GameStateManager,
  InputManager,
  MapManager,
  RenderManager,
} from "./managers";
import { RenderSystem } from "./systems";

export class Game {
  lastTime = performance.now(); // We add a field to keep track of the last time the loop ran
  ecs: ECSManager;
  gameState: GameStateManager;
  input: InputManager;
  map: MapManager;
  render: RenderManager;
  renderSystem: RenderSystem;

  constructor() {
    this.ecs = new ECSManager(this);
    this.gameState = new GameStateManager(this);
    this.input = new InputManager(this);
    this.map = new MapManager(this);
    this.render = new RenderManager(this);
    this.renderSystem = new RenderSystem(this);
  }

  start() {
    window.requestAnimationFrame(this.run.bind(this));
  }

  tick(delta: number, time: number) {
    // We'll put more code here later
    // For now, let's just write to the terminal every frame
    this.render.clear();
    this.updateSystems();
    this.render.render();
  }

  updateSystems() {
    this.renderSystem.update();
  }

  run() {
    const time = performance.now(); // Get the current time
    const delta = time - this.lastTime; // Calculate the difference

    this.tick(delta, this.lastTime); // Run our tick method with the times calculated
  }
}
