import { Player } from "./player";

export interface FormationState {
  [position: string]: Player | null;
}