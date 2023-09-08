import { CharCode, Color, GUI, Glyph, Rect, type Vector2 } from "malwoden";
import type { PanelWidgetState, WidgetConfig } from "malwoden/dist/types/gui";
import { HoverState } from "../data";
import type { MouseHandlerEvent } from "malwoden/dist/types/input";
// import { MouseHandlerEvent } from "malwoden/dist/types/input";

export interface ButtonPanelState extends PanelWidgetState {
  onClick?: () => void;
  hoverColor?: Color;
  downColor?: Color;
  title?: string;
}

export class ButtonPanelWidget extends GUI.Widget<ButtonPanelState> {
  constructor(config: WidgetConfig<ButtonPanelState>) {
    super(config);
    this.state = {
      foreColor: Color.White,
      backColor: Color.Black,
      hoverColor: Color.Black,
      downColor: Color.Black,
      ...config.initialState,
    };
  }

  getAbsTopLeft(): Vector2 {
    return this.getAbsoluteOrigin();
  }

  getAbsBottomRight(): Vector2 {
    const o = this.getAbsoluteOrigin();
    return {
      x: o.x + this.state.width - 1,
      y: o.y + this.state.height - 1,
    };
  }

  getBackColor(mouseState: HoverState): Color | undefined {
    if (mouseState === HoverState.None) {
      return this.state.backColor;
    }

    if (mouseState === HoverState.Hover) {
      return this.state.hoverColor;
    }

    if (mouseState === HoverState.Down) {
      return this.state.downColor;
    }
  }

  onMouseClick(event: MouseHandlerEvent): boolean {
    if (!this.terminal || !this.state.onClick) return false;
    if (event.type === "mouseup") return false;
    const tilePos = this.terminal.windowToTilePoint(event);
    if (this.getBounds().contains(tilePos)) {
      this.state.onClick();
      return true;
    }
    return false;
  }

  getBounds(): Rect {
    return Rect.FromWidthHeight(
      this.getAbsoluteOrigin(),
      this.state.width,
      this.state.height,
    );
  }

  getMouseState(): HoverState {
    const mousePos = this.mouseHandler!.getPos();
    const terminalPos = this.terminal!.windowToTilePoint(mousePos);
    const mouseDown = this.mouseHandler!.isMouseDown();
    if (this.getBounds().contains(terminalPos)) {
      return mouseDown ? HoverState.Down : HoverState.Hover;
    }
    return HoverState.None;
  }

  onDraw(): void {
    if (!this.terminal) return;

    const bounds = this.getBounds();

    const hoverState = this.getMouseState();
    const backColor = this.getBackColor(hoverState);

    const g = Glyph.fromCharCode(
      CharCode.space,
      this.state.foreColor,
      backColor,
    );

    for (let y = bounds.v1.y; y <= bounds.v2.y; y++) {
      for (let x = bounds.v1.x; x <= bounds.v2.x; x++) {
        this.terminal.drawGlyph({ x, y }, g);
      }
    }
    const origin = this.getAbsoluteOrigin();

    if (this.state.title) {
      const title = this.padToWidth(this.state.title, this.state.width);
      this.terminal.writeAt(
        { x: origin.x, y: origin.y },
        title,
        this.state.foreColor,
        backColor,
      );
    }
  }

  padToWidth(text: string, length: number) {
    if (text.length >= length) {
      return text;
    } else {
      return text.padStart((text.length + length) / 2, " ").padEnd(length, " ");
    }
  }

  //   truncateText(config: {
  //     text: string;
  //     truncateAfter: number;
  //     addEllipsis: boolean;
  //   }): string {
  //     if (config.addEllipsis) {
  //       return `${config.text.substring(0, config.truncateAfter - 3)}...`;
  //     } else {
  //       return config.text.substring(0, config.truncateAfter);
  //     }
  //   }

  //   onMouseClick(event: MouseHandlerEvent): boolean {
  //     if (!this.terminal || !this.state.onClick) return false;
  //     const tilePos = this.terminal.windowToTilePoint(event);
  //     if (this.getBounds().contains(tilePos)) {
  //       this.state.onClick();
  //       return true;
  //     }
  //     return false;
  //   }

  //   wrapText(config: { text: string; wrapAt: number }): string[] {
  //     const lines: string[] = [];
  //     const words = config.text.split(" ");
  //     let current = "";
  //     while (words.length) {
  //       const next = words.shift()!;
  //       const nextWithSpace = ` ${next}`;

  //       // ensure we always get at least one word
  //       if (current === "") {
  //         current += next;
  //         continue;
  //       } else if (current.length + nextWithSpace.length > config.wrapAt) {
  //         // if we need to line break
  //         lines.push(current);
  //         current = next;
  //       } else {
  //         // otherwise add it on
  //         current += nextWithSpace;
  //       }
  //     }

  //     if (current.length) {
  //       lines.push(current);
  //     }
  //     return lines;
  //   }

  //   getBounds(): Rect {
  //     return Rect.FromWidthHeight(
  //       this.absoluteOrigin,
  //       this.getTextWidth(),
  //       this.getTextHeight(),
  //     );
  //   }

  //   lines(text: string): string[] {
  //     if (this.state.wrapAt)
  //       return this.wrapText({ text, wrapAt: this.state.wrapAt });
  //     else return [text];
  //   }

  //   text(): string {
  //     if (this.state.truncateAfter === undefined) return this.state.text;

  //     return this.truncateText({
  //       text: this.state.text,
  //       truncateAfter: this.state.truncateAfter,
  //       addEllipsis: !!this.state.truncateAddEllipsis,
  //     });
  //   }

  //   getTextHeight(): number {
  //     return this.lines(this.text()).length;
  //   }

  //   getTextWidth(): number {
  //     const lines = this.lines(this.text());
  //     let width = 0;
  //     for (const line of lines) {
  //       if (line.length > width) {
  //         width = line.length;
  //       }
  //     }
  //     return width;
  //   }

  //   getMouseState() {
  //     const mousePos = this.mouseHandler!.getPos();
  //     const terminalPos = this.terminal!.windowToTilePoint(mousePos);
  //     const mouseDown = this.mouseHandler!.isMouseDown();
  //     if (this.getBounds().contains(terminalPos)) {
  //       return mouseDown ? HoverState.Down : HoverState.Hover;
  //     }
  //     return HoverState.None;
  //   }
  // }
}

// constructor(config: WidgetConfig<PanelWidgetState>) {
//     super(config);

//     this.state = {
//       foreColor: Color.White,
//       backColor: Color.Black,
//       ...config.initialState,
//     };
//   }

//   private getAbsTopLeft(): Vector2 {
//     return this.getAbsoluteOrigin();
//   }

//   private getAbsBottomRight(): Vector2 {
//     const o = this.getAbsoluteOrigin();
//     return {
//       x: o.x + this.state.width - 1,
//       y: o.y + this.state.height - 1,
//     };
//   }

//   onDraw(): void {
//     if (!this.terminal) return;

//     const { backColor, foreColor } = this.state;

//     const bgGlyph = new Glyph(" ", foreColor, backColor);
//     const tl = this.getAbsTopLeft();
//     const br = this.getAbsBottomRight();
//     this.terminal.fill(tl, br, bgGlyph);

//     if (this.state.borderStyle) {
//       drawBorder({
//         terminal: this.terminal,
//         foreColor,
//         backColor,
//         style: this.state.borderStyle,
//         bounds: new Rect(this.getAbsTopLeft(), this.getAbsBottomRight()),
//       });
//     }
//   }
// }
