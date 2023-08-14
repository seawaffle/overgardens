import { Vector2 } from "malwoden";
import { IsBlockedCallback } from "malwoden/dist/types/pathfinding/pathfinding-common";

interface DijkstraConfig {
  isBlockedCallback?: IsBlockedCallback;
  topology: "four" | "eight";
  flee?: boolean;
  start: Vector2;
}

interface DjikstraTile {
    pos: Vector2;
    cost: number;
    target: boolean;
}

export class DijkstraMap {
    start: Vector2;
  readonly topology: "four" | "eight";
  private readonly _isBlocked: IsBlockedCallback = () => false;
  computed: Map<string, DjikstraTile>;
  todo: DjikstraTile[];
  flee: boolean;

  constructor(config: DijkstraConfig) {
    this.computed = new Map<string, DjikstraTile>();
    this.todo = [];

    this.topology = config.topology;
    this.start = config.start
    if (config.isBlockedCallback) {
      this._isBlocked = config.isBlockedCallback;
    }
    this.flee = config.flee || false; 
  }

  private getNeighbors(pos: Vector2): Vector2[] {
    const neighbors = this.getRing4(pos.x, pos.y, 1);

    if (this.topology === "eight") {
      neighbors.push({ x: pos.x + 1, y: pos.y - 1 });
      neighbors.push({ x: pos.x - 1, y: pos.y - 1 });
      neighbors.push({ x: pos.x - 1, y: pos.y + 1 });
      neighbors.push({ x: pos.x + 1, y: pos.y + 1 });
    }
    const neighborsPruned = [];
    for (const n of neighbors) {
        if (!this._isBlocked(n)) {
            neighborsPruned.push(n);
        }
    }

    return neighborsPruned;
  }

  add(pos: Vector2, cost: number = 0, target = true) {
    const tile: DjikstraTile = {pos, cost, target};
    this.computed.set(`${pos.x},${pos.y}`, tile);
    this.todo.push(tile)
  }

  compute(): Vector2 | undefined {
    if (this.todo.length === 0) {
        return;
    }
    this.calc();
    if (this.flee) {
        for (const key of this.computed.keys()) {
            const tile = this.computed.get(key)!;
            tile.cost *= -1.4;
            this.todo.push(tile);
            this.calc();
        }
    } 
    
    let next = this.start;
    let cost = this.computed.get(`${this.start.x},${this.start.y}`)!.cost;
    const neighbors = this.getNeighbors(this.start);
    let first = true;
    for (const n of neighbors) {
        const key = `${n.x},${n.y}`
        if (this.computed.has(key)) {
            const tile = this.computed.get(key)!;
            const compare = this.flee ? tile.cost > cost : tile.cost < cost;
            if (compare || first) {
                first = false;
                cost = tile.cost
                next = tile.pos
            }
        }
    }
    return next;
  }

  calc() {
    while (this.todo.length > 0) {
        const item = this.todo.shift()!;
        const neighbors = this.getNeighbors(item.pos);
        for (const neighbor of neighbors) {
            const id = `${neighbor.x},${neighbor.y}`;
            if (this.computed.has(id)) {
                const tile = this.computed.get(id)!;
                if (!tile.target && tile.cost > item.cost + 1) {
                    this.add(neighbor, item.cost + 1, false);
                    continue;
                }
                if (!item.target && tile.cost + 1 < item.cost) {
                    this.add(item.pos, tile.cost + 1, false);
                    break
                }
            } else {
                this.add(neighbor, item.cost + 1, false);
            }
        }
    }
  }

  private getRing4(
    originX: number,
    originY: number,
    range: number
  ): Vector2[] {
    if (range === 0) {
      return [
        {
          x: originX,
          y: originY,
        },
      ];
    }
    const ring: Vector2[] = [];
  
    const maxX = originX + range;
    const minX = originX - range;
    const maxY = originY + range;
    const minY = originY - range;
  
    // Top right arc
    for (let x = maxX, y = originY; x > originX; x--, y--) {
      ring.push({ x, y });
    }
  
    // Top left arc
    for (let x = originX, y = minY; x > minX; x--, y++) {
      ring.push({ x, y });
    }
  
    // Bottom left arc
    for (let x = minX, y = originY; x < originX; x++, y++) {
      ring.push({ x, y });
    }
  
    // Bottom right arc
    for (let x = originX, y = maxY; x < maxX; x++, y--) {
      ring.push({ x, y });
    }
  
    return ring;
  }
}