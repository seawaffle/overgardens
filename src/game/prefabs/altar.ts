import { Entity } from "../components";
import { Palette } from "../data";

export const Altar: Entity = {
  name: "Altar",
  renderable: {
    glyph: {
      character: "Φ",
      fg: Palette.EbonyHex,
    },
    renderOrder: 2,
  },
  blocksTile: true,
  mobile: false,
};
