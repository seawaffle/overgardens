export class ActionFunctions {
  returnFunction(name: any) {
    const func: keyof ActionFunctions = name;
    return this[func];
  }
}
