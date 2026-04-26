import { DiceSet } from "../types/DiceSet";
import { DiceStyle } from "../types/DiceStyle";
import { Die } from "../types/Die";

import * as bladeRunnerPreviews from "../previews/blade-runner";
import * as glassPreviews from "../previews/glass";

import allPreview from "../previews/all.png";

type StandardDiceStyle = DiceStyle;

const standardPreviews: Record<StandardDiceStyle, string> = {
  BLADE_RUNNER: glassPreviews.D12,
  GLASS: glassPreviews.D12,
};

function createStandardSet(style: StandardDiceStyle): DiceSet {
  const id = `${style}_STANDARD`;
  return {
    id,
    name: `${style.toLowerCase()} dice`,
    dice: [
      { id: `${id}_D6`, type: "D6", style },
      { id: `${id}_D8`, type: "D8", style },
      { id: `${id}_D10`, type: "D10", style },
      { id: `${id}_D12`, type: "D12", style },
    ],
    previewImage: standardPreviews[style],
  };
}

const standardSets = [
  createStandardSet("GLASS"),
];

const allSet: DiceSet = {
  id: "all",
  name: "all",
  dice: standardSets.reduce(
    (prev, curr) => [...prev, ...curr.dice],
    [] as Die[]
  ),
  previewImage: allPreview,
};

// Blade Runner RPG: D6=D (Feeble), D8=C (Average), D10=B (Superior), D12=A (Extraordinary)
const bladeRunnerSet: DiceSet = {
  id: "blade-runner",
  name: "Blade Runner RPG",
  dice: [
    { id: "BLADE_RUNNER_D6", type: "D6", style: "BLADE_RUNNER" },
    { id: "BLADE_RUNNER_D8", type: "D8", style: "BLADE_RUNNER" },
    { id: "BLADE_RUNNER_D10", type: "D10", style: "BLADE_RUNNER" },
    { id: "BLADE_RUNNER_D12", type: "D12", style: "BLADE_RUNNER" },
  ],
  previewImage: bladeRunnerPreviews.D12,
};

export const diceSets: DiceSet[] = [bladeRunnerSet, ...standardSets, allSet];
