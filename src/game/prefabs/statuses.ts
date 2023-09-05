import type { Status } from "../components";

export const Statuses = new Map<string, Status>();
Statuses.set("hunger", {
  name: "Hunger",
  duration: Infinity,
  function: "hunger",
  args: ["0", "50", "100"],
});
