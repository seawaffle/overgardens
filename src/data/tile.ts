import { Color } from "malwoden";

export class Tile {
  constructor(
    public type: string,
    public character: string,
    public color_light: Color,
    public color_dark: Color,
    public walkable: boolean,
    public transparent: boolean,
  ) {}

  static Nothing = new Tile(
    "nothing",
    " ",
    Color.Black,
    Color.Black,
    false,
    false,
  );
  static Floor = new Tile(
    "floor",
    ".",
    Color.DarkGray,
    Color.Black,
    true,
    true,
  );
  static Wall = new Tile(
    "wall",
    "#",
    Color.Green,
    Color.DarkGray,
    false,
    false,
  );
  static Water = new Tile(
    "water",
    "~",
    Color.LightBlue,
    Color.DimGray,
    false,
    true,
  );
  static Sky = new Tile(
    "sky",
    "-",
    Color.SkyBlue,
    Color.DeepSkyBlue,
    false,
    true,
  );
}
