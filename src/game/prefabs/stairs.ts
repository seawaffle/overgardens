import { Entity } from "../components";
import { Palette } from "../data";

export const DownStairs: Entity = {
  name: "Stairs Downward",
  renderable: {
    glyph: {
      character: ">",
      fg: Palette.EbonyHex,
    },
    renderOrder: 2,
  },
  mobile: false,
};

export const UpStairs: Entity = {
  name: "Stairs Upward",
  renderable: {
    glyph: {
      character: "<",
      fg: Palette.EbonyHex,
    },
    renderOrder: 2,
  },
  mobile: false,
};
