import { Vector2 } from "malwoden";
import {
  Renderable,
  Body,
  Viewshed,
  Destination,
  OutOfLevel,
  Inventory,
  ItemProperties,
  AltarProperties,
  Status,
  Action,
} from ".";
import { Goal } from "../ai/goals";
import { IncomingDamage } from "./incoming-damage";
import { Gift } from "../data";

export interface Entity {
  id?: string;
  name: string;
  position?: Vector2;
  outOfLevel?: OutOfLevel;
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
  incomingDamage?: IncomingDamage;
  destination?: Destination;
  inventory?: Inventory;
  itemProperties?: ItemProperties;
  dying?: true;
  gainedExperience?: number;
  altarProperties?: AltarProperties;
  receivedGifts?: Gift[];
  statuses?: Status[];
  actions?: Action[];
}
