export interface Renderable {
  glyph: {
    character: string;
    fg?: {
      r: number;
      g: number;
      b: number;
    };
    bg?: {
      r: number;
      g: number;
      b: number;
    };
  };
  renderOrder: number;
}
