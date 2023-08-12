import { Manager } from "./manager";

export class LogManager extends Manager {
  logs: string[] = [];
  maxHistory = 50;
  overrideMessage: string[] = [];

  addMessage(...msgs: string[]) {
    this.logs.push(...msgs);
    while (this.logs.length > this.maxHistory) {
      this.logs.shift();
    }
  }

  setOverride(...msg: string[]) {
    this.clearOverride();
    this.overrideMessage.push(...msg);
  }

  clearOverride() {
    this.overrideMessage = [];
  }

  contents(count: number) {
    if (this.overrideMessage.length > 0) {
      return this.overrideMessage;
    }
    return this.getLatestMessages(count);
  }

  getLatestMessages(count: number) {
    return this.logs.slice().reverse().slice(0, count);
  }
}
