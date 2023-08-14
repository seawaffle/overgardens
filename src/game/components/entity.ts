import { Position, Renderable, Body, Viewshed, Destination } from ".";
import { Goal } from "../ai/goals";

export interface Entity {
  id?: string;
  name: string;
  position?: Position;
  renderable?: Renderable;
  player?: true;
  viewshed?: Viewshed;
  blocksTile?: true;
  body?: Body;
  faction?: string;
  mobile: boolean;
  initiative?: number;
  currentTurn?: true;
  goal?: Goal;
  incomingDamage?: number;
  travelable?: Destination;
}
