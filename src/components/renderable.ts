import { Glyph } from "malwoden";

export interface Renderable {
  glyph: Glyph;
  renderOrder: number;
}