import type { Status } from "../components";

export const Statuses = new Map<string, Status>();
Statuses.set("hunger", {
  name: "Hunger",
  duration: Infinity,
  function: "hunger",
  args: ["0", "50", "100"],
});
Statuses.set("shadowMerge", {
  name: "Shadow Merge",
  duration: 10,
  function: "shadowMerge",
  args: [],
});
