import { Position, Renderable, Stats, Viewshed } from ".";

export interface Entity {
  id?: string;
  name: string;
  position?: Position;
  renderable?: Renderable;
  player?: true;
  viewshed?: Viewshed;
  blocksTile?: true;
  stats?: Stats;
  faction?: string[];
  mobile: true;
  initiative: number;
  currentTurn?: true;
}
