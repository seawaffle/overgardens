import type { Entity } from "../components";
import { Palette } from "../data";

export const Altar: Entity = {
  id: "",
  name: "Altar",
  renderable: {
    glyph: {
      character: "Φ",
      fg: Palette.EbonyHex,
    },
    renderOrder: 1,
  },
  blocksTile: true,
  mobile: false,
};
