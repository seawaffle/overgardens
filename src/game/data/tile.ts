import { CharCode, Color } from "malwoden";
import { Palette } from ".";

export class Tile {
  constructor(
    public type: string,
    public character: CharCode,
    public fg_color_light: Color,
    public fg_color_dark: Color,
    public bg_color_light: Color,
    public bg_color_dark: Color,
    public walkable: boolean,
    public transparent: boolean,
  ) {}

  static Nothing = new Tile(
    "nothing",
    CharCode.space,
    Palette.Ebony,
    Palette.Ebony,
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
    Palette.Atomic,
    Palette.Elephant,
    false,
    false,
  );
  static Water = new Tile(
    "water",
    CharCode.space,
    Palette.Matisse,
    Palette.CatalinaBlue,
    Palette.Matisse,
    Palette.CatalinaBlue,
    false,
    true,
  );
  static Sky = new Tile(
    "sky",
    CharCode.space,
    Palette.Seagull,
    Palette.SteelBlue,
    Palette.Seagull,
    Palette.SteelBlue,
    false,
    true,
  );
  static Cloud = new Tile(
    "cloud",
    CharCode.lightShade,
    Palette.GreyNurse,
    Palette.Submarine,
    Palette.Seagull,
    Palette.SteelBlue,
    false,
    true,
  );
  static Ground = new Tile(
    "ground",
    CharCode.space,
    Palette.Fallow,
    Palette.SantaFe,
    Palette.Fallow,
    Palette.SantaFe,
    true,
    true,
  );
  static Grass = new Tile(
    "grass",
    CharCode.space,
    Palette.JapaneseLaurel,
    Palette.KaitokeGreen,
    Palette.JapaneseLaurel,
    Palette.KaitokeGreen,
    true,
    true,
  );
  static Tree = new Tile(
    "tree",
    CharCode.blackSpadeSuit,
    Palette.KaitokeGreen,
    Palette.CardinGreen,
    Palette.JapaneseLaurel,
    Palette.KaitokeGreen,
    false,
    false,
  );
}
