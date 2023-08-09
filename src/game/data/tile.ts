export class Tile {
  constructor(
    public type: string,
    public character: string,
    public color_light: string,
    public color_dark: string,
    public walkable: boolean,
    public transparent: boolean,
  ) {}

  static Nothing = new Tile("nothing", " ", "black", "black", false, false);
  static Floor = new Tile("floor", ".", "lightgray", "dimgray", true, true);
  static Wall = new Tile("wall", "#", "green", "darkgray", false, false);
  static Water = new Tile("water", "~", "lightblue", "dimgray", false, true);
  static Sky = new Tile("sky", "-", "skyblue", "deepskyblue", false, true);
}
