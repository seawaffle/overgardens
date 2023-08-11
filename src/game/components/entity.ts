import { Position, Renderable, Body, Viewshed } from ".";

export interface Entity {
  id?: string;
  name: string;
  position?: Position;
  renderable?: Renderable;
  player?: true;
  viewshed?: Viewshed;
  blocksTile?: true;
  body?: Body;
  faction?: string[];
  mobile: true;
  initiative: number;
  currentTurn?: true;
}
