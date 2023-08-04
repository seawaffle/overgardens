import { Position, Renderable, Viewshed } from ".";

export interface Entity {
  position?: Position;
  renderable?: Renderable;
  player?: true;
  viewshed?: Viewshed;
  blocksTile?: true;
}
