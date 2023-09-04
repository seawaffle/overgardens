export enum SlotType {
  Head,
  Body,
  Feet,
  Gloves,
  Hand,
}

export enum Reaction {
  Ignore = 0,
  Attack,
  Flee,
}

export enum GameState {
  Init = 1,
  AwaitingInput,
  Ticking,
  MainMenu,
  Inventory,
  EscapeMenu,
  HelpScreen,
  Examine,
  GameOver,
  ZoneChange,
  ContextMenu,
  FullLog,
  Equipment,
  Character,
  Communion,
}

export enum Sacrifice {
  Self,
  Vigor,
  Possessions,
}

export enum HoverState {
  None = 0,
  Hover = 1,
  Down = 2,
}
