export interface Gift {
  name: string;
  minFavor: number;
  maxFavor: number;
  description: string;
  function: string;
  args: string[];
  canHaveMultiple: boolean;
}
