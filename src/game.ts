import { Color, Glyph } from "malwoden";
import {
  ECSManager,
  GameStateManager,
  InputManager,
  MapManager,
  RenderManager,
} from "./managers";
import { MapIndexingSystem, RenderSystem, VisibilitySystem } from "./systems";
import { Entity } from "./components";

export class Game {
  lastTime = performance.now(); // We add a field to keep track of the last time the loop ran
  ecs: ECSManager;
  gameState: GameStateManager;
  input: InputManager;
  map: MapManager;
  render: RenderManager;
  renderSystem: RenderSystem;
  visibilitySystem: VisibilitySystem;
  mapIndexingSystem: MapIndexingSystem;
  player: Entity;

  constructor() {
    this.ecs = new ECSManager(this);
    this.gameState = new GameStateManager(this);
    this.input = new InputManager(this);
    this.map = new MapManager(this);
    this.render = new RenderManager(this);
    this.renderSystem = new RenderSystem(this);
    this.visibilitySystem = new VisibilitySystem(this);
    this.mapIndexingSystem = new MapIndexingSystem(this);
    this.player = this.ecs.addEntity({
      position: { pos: { x: 40, y: 25 } },
      renderable: { glyph: new Glyph("@", Color.Yellow), renderOrder: 1 },
      player: true,
      viewshed: { range: 7, dirty: true },
    });
  }

  tick(_delta: number, _time: number) {
    // We'll put more code here later
    // For now, let's just write to the terminal every frame
    this.render.clear();
    this.input.update();
    this.updateSystems();
    this.render.render();
  }

  updateSystems() {
    this.mapIndexingSystem.update();
    this.visibilitySystem.update();
    this.renderSystem.update();
  }

  run() {
    const time = performance.now(); // Get the current time
    const delta = time - this.lastTime; // Calculate the difference

    this.tick(delta, this.lastTime); // Run our tick method with the times calculated
    window.requestAnimationFrame(this.run.bind(this));
  }
}
