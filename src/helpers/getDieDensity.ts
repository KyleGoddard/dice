import { Die } from "../types/Die";

/** Get the density multiplier for a die */
export function getDieDensity(die: Die): number {
  if (die.style === "GLASS") {
    return 1.5;
  } else {
    return 1;
  }
}
