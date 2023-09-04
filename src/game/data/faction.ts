import { Reaction } from ".";

export interface Faction {
  name: string;
  views: Map<string, Reaction>;
}
