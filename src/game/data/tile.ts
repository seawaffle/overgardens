import { CharCode, Color } from "malwoden";
import { Palette } from ".";

export class Tile {
  constructor(
    public type: string,
    public character: CharCode,
    public color_light: Color,
    public color_dark: Color,
    public walkable: boolean,
    public transparent: boolean,
  ) {}

  static Nothing = new Tile(
    "nothing",
    CharCode.space,
    Palette.Ebony,
    Palette.Ebony,
    false,
    false,
  );
  static Floor = new Tile(
    "floor",
    CharCode.space,
    Palette.Submarine,
    Palette.William,
    true,
    true,
  );
  static Wall = new Tile(
    "wall",
    CharCode.space,
    Palette.Atomic,
    Palette.Elephant,
    false,
    false,
  );
  static Water = new Tile(
    "water",
    CharCode.space,
    Palette.SteelBlue,
    Palette.CatalinaBlue,    
    false,
    true,
  );
  static Sky = new Tile(
    "sky",
    CharCode.space,
    Palette.FrenchPass,
    Palette.Seagull,
    false,
    true,
  );
}
