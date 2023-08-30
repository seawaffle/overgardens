import { Gift } from ".";

export interface Ageless {
  name: string;
  epithet: string;
  associates: string[];
  enemies: string[];
  currentFavor?: number;
  gifts: Gift[];
}
