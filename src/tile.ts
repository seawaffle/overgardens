import { Color } from "malwoden";

export class Tile {
  constructor(
    public type: string,
    public color_light: Color,
    public color_dark: Color,
    public walkable: boolean,
    public transparent: boolean,
  ) {}
}

export const FLOOR = new Tile("floor", Color.Black, Color.Black, true, true);
export const WALL = new Tile("wall", Color.LightGray, Color.DarkGray, false, false);
export const WATER = new Tile("water", Color.LightBlue, Color.DimGray, false, true);
export const SKY = new Tile("sky", Color.SkyBlue, Color.DeepSkyBlue, false, true);
