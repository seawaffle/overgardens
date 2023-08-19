import { GameState } from "../data";
import { System } from "./system";

export class ExtendedActionSystem extends System {
    action: Function | undefined = undefined;
    data: any[] = [];

    setAction(action: Function, data: any[]) {
        this.action = action;
        this.data = data;
    }

    endAction() {
        this.action = undefined;
        this.data = [];
    }

    hasAction(): boolean {
        return this.action !== undefined;
    }

    update(): void {
        if (this.game.gameState.state === GameState.AwaitingInput) {
            if (this.action) {
                this.action(...this.data)
            }
        }
    }
}