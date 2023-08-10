import { Palette } from ".";

export class Tile {
  constructor(
    public type: string,
    public character: string,
    public color_light: string,
    public color_dark: string,
    public walkable: boolean,
    public transparent: boolean,
  ) {}

  static Nothing = new Tile(
    "nothing",
    " ",
    Palette.Ebony,
    Palette.Ebony,
    false,
    false,
  );
  static Floor = new Tile(
    "floor",
    " ",
    Palette.Submarine,
    Palette.William,
    true,
    true,
  );
  static Wall = new Tile(
    "wall",
    " ",
    Palette.Atomic,
    Palette.Elephant,
    false,
    false,
  );
  static Water = new Tile(
    "water",
    " ",
    Palette.SteelBlue,
    Palette.CatalinaBlue,
    false,
    true,
  );
  static Sky = new Tile(
    "sky",
    " ",
    Palette.FrenchPass,
    Palette.Seagull,
    false,
    true,
  );
}
