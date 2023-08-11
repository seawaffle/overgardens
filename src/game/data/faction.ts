export enum Reaction {
  Ignore = 0,
  Attack,
  Flee,
}

export interface Faction {
  name: string;
  views: Map<string, Reaction>;
}
