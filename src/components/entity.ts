import { Position, Renderable } from ".";

export interface Entity {
  position?: Position;
  renderable?: Renderable;
  player?: true;
}