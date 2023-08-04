import { Color, Glyph } from "malwoden";
import {
  DatabaseManager,
  ECSManager,
  GameStateManager,
  InputManager,
  MapManager,
  RenderManager,
} from "./managers";
import { MapIndexingSystem, RenderSystem, VisibilitySystem } from "./systems";
import { Entity } from "./components";
import { GameState } from "./game-state";

export class Game {
  lastTime = performance.now(); // We add a field to keep track of the last time the loop ran
  gameId: string;
  ecs: ECSManager;
  gameState: GameStateManager;
  input: InputManager;
  map: MapManager;
  render: RenderManager;
  database: DatabaseManager;
  renderSystem: RenderSystem;
  visibilitySystem: VisibilitySystem;
  mapIndexingSystem: MapIndexingSystem;
  player: Entity | undefined;

  constructor(id?: string) {
    this.gameId = id || Date.now().toString();
    this.ecs = new ECSManager(this);
    this.gameState = new GameStateManager(this);
    this.input = new InputManager(this);
    this.map = new MapManager(this);
    this.render = new RenderManager(this);
    this.database = new DatabaseManager(this);
    this.renderSystem = new RenderSystem(this);
    this.visibilitySystem = new VisibilitySystem(this);
    this.mapIndexingSystem = new MapIndexingSystem(this);
    this.player = undefined;
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

  createSaveData(): Record<string, any> {
    let data: Record<string, any> = {};
    data.gameId = this.gameId;
    data.player = this.player;
    data.entities = this.ecs.world.entities;
    data.state = this.gameState.state;
    data.map = this.map.map;
    return data;
  }

  loadSaveData(data: Record<string, any>) {
    this.gameId = data.gameId;
    this.ecs.reset(data.entities);
    this.player = this.ecs.world.with("player").first;
    this.map.loadMap(data.map);
    this.gameState.state = GameState.AwaitingInput;
    this.input.update();
    this.mapIndexingSystem = new MapIndexingSystem(this);
    this.visibilitySystem = new VisibilitySystem(this);
    this.renderSystem = new RenderSystem(this);
    this.updateSystems();
    this.render.render();
  }
}
