import { GUI, Rect } from "malwoden";
import type { TextWidgetState } from "malwoden/dist/types/gui";
import type { MouseHandlerEvent } from "malwoden/dist/types/input";
import { HoverState } from "../data";

export interface TextState extends TextWidgetState {
  onClick?: () => void;
}

export class TextWidget extends GUI.Widget<TextState> {
  onDraw(): void {
    if (!this.terminal) return;

    const origin = this.getAbsoluteOrigin();

    const text = this.text();
    const lines = this.lines(text);

    for (let y = 0; y < lines.length; y++) {
      const line = lines[y];
      this.terminal.writeAt(
        { x: origin.x, y: origin.y + y },
        line,
        this.state.foreColor,
        this.state.backColor,
      );
    }
  }

  truncateText(config: {
    text: string;
    truncateAfter: number;
    addEllipsis: boolean;
  }): string {
    if (config.addEllipsis) {
      return `${config.text.substring(0, config.truncateAfter - 3)}...`;
    } else {
      return config.text.substring(0, config.truncateAfter);
    }
  }

  onMouseClick(event: MouseHandlerEvent): boolean {
    if (!this.terminal || !this.state.onClick) return false;
    const tilePos = this.terminal.windowToTilePoint(event);
    if (this.getBounds().contains(tilePos)) {
      this.state.onClick();
      return true;
    }
    return false;
  }

  wrapText(config: { text: string; wrapAt: number }): string[] {
    const lines: string[] = [];
    const words = config.text.split(" ");
    let current = "";
    while (words.length) {
      const next = words.shift()!;
      const nextWithSpace = ` ${next}`;

      // ensure we always get at least one word
      if (current === "") {
        current += next;
        continue;
      } else if (current.length + nextWithSpace.length > config.wrapAt) {
        // if we need to line break
        lines.push(current);
        current = next;
      } else {
        // otherwise add it on
        current += nextWithSpace;
      }
    }

    if (current.length) {
      lines.push(current);
    }
    return lines;
  }

  getBounds(): Rect {
    return Rect.FromWidthHeight(
      this.absoluteOrigin,
      this.getTextWidth(),
      this.getTextHeight(),
    );
  }

  lines(text: string): string[] {
    if (this.state.wrapAt)
      return this.wrapText({ text, wrapAt: this.state.wrapAt });
    else return [text];
  }

  text(): string {
    if (this.state.truncateAfter === undefined) return this.state.text;

    return this.truncateText({
      text: this.state.text,
      truncateAfter: this.state.truncateAfter,
      addEllipsis: !!this.state.truncateAddEllipsis,
    });
  }

  getTextHeight(): number {
    return this.lines(this.text()).length;
  }

  getTextWidth(): number {
    const lines = this.lines(this.text());
    let width = 0;
    for (const line of lines) {
      if (line.length > width) {
        width = line.length;
      }
    }
    return width;
  }

  getMouseState() {
    const mousePos = this.mouseHandler!.getPos();
    const terminalPos = this.terminal!.windowToTilePoint(mousePos);
    const mouseDown = this.mouseHandler!.isMouseDown();
    if (this.getBounds().contains(terminalPos)) {
      return mouseDown ? HoverState.Down : HoverState.Hover;
    }
    return HoverState.None;
  }
}
