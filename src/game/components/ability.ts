import type { TargetingProperties } from ".";

export interface Ability {
  name: string;
  description: string;
  turnsLeft: number;
  cooldownAmount: number;
  function: string;
  targetingProperties?: TargetingProperties;
  args: string[];
}
