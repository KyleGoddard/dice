import { DiceStyle } from "../types/DiceStyle";
import { BladeRunnerMaterial } from "./blade-runner/BladeRunnerMaterial";
import { GlassMaterial } from "./glass/GlassMaterial";


export function DiceMaterial({ diceStyle }: { diceStyle: DiceStyle }) {
  switch (diceStyle) {
    case "BLADE_RUNNER":
      return <BladeRunnerMaterial />;
    case "GLASS":
      return <GlassMaterial />;
    default:
      throw Error(`Dice style ${diceStyle} error: not implemented`);
  }
}
