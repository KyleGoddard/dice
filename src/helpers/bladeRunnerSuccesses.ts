import { Dice, isDice } from "../types/Dice";
import { Die, isDie } from "../types/Die";
import { DiceRoll } from "../types/DiceRoll";

export interface BladeRunnerResult {
  successes: number;
  /** True if any die showed 10 or more (double success). */
  isCritical: boolean;
  /** True if any die showed 1 (push hazard). */
  hasOne: boolean;
}

/** Returns 0, 1, or 2 successes for a single die face value. */
export function calculateDieSuccesses(value: number): number {
  if (value >= 10) return 2;
  if (value >= 6) return 1;
  return 0;
}

/**
 * Resolve which raw die values "count" for a group, respecting
 * HIGHEST/LOWEST combination (advantage/disadvantage).
 * For SUM/NONE/undefined all child values are included.
 */
function getEffectiveValues(
  diceOrDie: Die | Dice,
  rollValues: Record<string, number>
): number[] {
  if (isDie(diceOrDie)) {
    const value = rollValues[diceOrDie.id];
    return value !== undefined ? [value] : [];
  }

  const childGroups = diceOrDie.dice.map((child) =>
    getEffectiveValues(child, rollValues)
  );

  if (
    diceOrDie.combination === "HIGHEST" ||
    diceOrDie.combination === "LOWEST"
  ) {
    // Only the winning child group's values contribute to successes.
    const groupSums = childGroups.map((g) => g.reduce((a, b) => a + b, 0));
    const winnerIdx =
      diceOrDie.combination === "HIGHEST"
        ? groupSums.indexOf(Math.max(...groupSums))
        : groupSums.indexOf(Math.min(...groupSums));
    return childGroups[winnerIdx] ?? [];
  }

  return childGroups.flat();
}

/** Returns true when every die in the roll uses the BLADE_RUNNER style. */
export function isBladeRunnerRoll(diceRoll: Dice | DiceRoll): boolean {
  function check(d: Die | Dice): boolean {
    if (isDie(d)) return d.style === "BLADE_RUNNER";
    return d.dice.some(check);
  }
  return diceRoll.dice.length > 0 && diceRoll.dice.some(check);
}

/** Aggregate Blade Runner successes across the entire roll structure. */
export function getBladeRunnerResult(
  diceRoll: Dice | DiceRoll,
  rollValues: Record<string, number>
): BladeRunnerResult {
  const values: number[] = [];
  for (const d of diceRoll.dice) {
    values.push(...getEffectiveValues(d, rollValues));
  }

  let successes = 0;
  let isCritical = false;
  let hasOne = false;

  for (const value of values) {
    if (value === 1) hasOne = true;
    if (value >= 10) {
      successes += 2;
      isCritical = true;
    } else if (value >= 6) {
      successes += 1;
    }
  }

  return { successes, isCritical, hasOne };
}
