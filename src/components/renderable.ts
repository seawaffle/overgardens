export interface Renderable {
  glyph: {
    character: string;
    fg?: string;
    bg?: string;
  };
  renderOrder: number;
}
