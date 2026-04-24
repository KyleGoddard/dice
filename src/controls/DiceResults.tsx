import { useMemo } from "react";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Grow from "@mui/material/Grow";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { getCombinedDiceValue } from "../helpers/getCombinedDiceValue";
import {
  BladeRunnerResult,
  getBladeRunnerResult,
  isBladeRunnerRoll,
} from "../helpers/bladeRunnerSuccesses";
import { DiceRoll } from "../types/DiceRoll";
import { Die, isDie } from "../types/Die";
import { Dice, isDice } from "../types/Dice";
import { DicePreview } from "../previews/DicePreview";

export function DiceResults({
  diceRoll,
  rollValues,
  expanded,
  onExpand,
}: {
  diceRoll: DiceRoll;
  rollValues: Record<string, number>;
  expanded: boolean;
  onExpand: (expand: boolean) => void;
}) {
  const isBladeRunner = useMemo(
    () => isBladeRunnerRoll(diceRoll),
    [diceRoll]
  );

  const finalValue = useMemo(() => {
    if (isBladeRunner) return null;
    return getCombinedDiceValue(diceRoll, rollValues);
  }, [diceRoll, rollValues, isBladeRunner]);

  const brResult = useMemo(() => {
    if (!isBladeRunner) return null;
    return getBladeRunnerResult(diceRoll, rollValues);
  }, [diceRoll, rollValues, isBladeRunner]);

  return (
    <Stack alignItems="center" maxHeight="calc(100vh - 100px)">
      <Tooltip
        title={expanded ? "Hide Breakdown" : "Show Breakdown"}
        disableInteractive
      >
        <Button
          sx={{ pointerEvents: "all", padding: 0.5, minWidth: "40px" }}
          onClick={() => onExpand(!expanded)}
          color="inherit"
        >
          {brResult ? (
            <BladeRunnerSummary result={brResult} />
          ) : (
            <Typography variant="h4" color="white">
              {finalValue}
            </Typography>
          )}
        </Button>
      </Tooltip>
      <Grow
        in={expanded}
        mountOnEnter
        unmountOnExit
        style={{ transformOrigin: "50% 0 0" }}
      >
        <Stack overflow="auto" sx={{ pointerEvents: "all" }}>
          <DiceResultsExpanded diceRoll={diceRoll} rollValues={rollValues} />
        </Stack>
      </Grow>
    </Stack>
  );
}

function BladeRunnerSummary({ result }: { result: BladeRunnerResult }) {
  const successColor =
    result.successes > 0 ? "success.main" : "error.main";
  return (
    <Stack alignItems="center" gap={0.25}>
      <Typography variant="h4" color={successColor} fontFamily="monospace">
        {result.successes}
      </Typography>
      <Typography variant="caption" color="white" lineHeight={1}>
        {result.successes === 1 ? "success" : "successes"}
      </Typography>
      {result.isCritical && (
        <Typography variant="caption" sx={{ color: "gold", lineHeight: 1 }}>
          CRITICAL
        </Typography>
      )}
      {result.hasOne && (
        <Typography variant="caption" sx={{ color: "#ff9966", lineHeight: 1 }}>
          HAZARD
        </Typography>
      )}
    </Stack>
  );
}

function combination(dice: Dice) {
  if (dice.combination === "HIGHEST") {
    return ">";
  } else if (dice.combination === "LOWEST") {
    return "<";
  } else if (dice.combination === "NONE") {
    return ",";
  } else {
    return "+";
  }
}

function sortDice(
  die: Die[],
  rollValues: Record<string, number>,
  combination: "HIGHEST" | "LOWEST" | "SUM" | "NONE" | undefined
) {
  return die.sort((a, b) => {
    const aValue = rollValues[a.id];
    const bValue = rollValues[b.id];
    if (combination === "HIGHEST") {
      return bValue - aValue;
    } else if (combination === "LOWEST") {
      return aValue - bValue;
    } else {
      return 0;
    }
  });
}

function DiceResultsExpanded({
  diceRoll,
  rollValues,
}: {
  diceRoll: DiceRoll;
  rollValues: Record<string, number>;
}) {
  const die = useMemo(
    () =>
      sortDice(diceRoll.dice.filter(isDie), rollValues, diceRoll.combination),
    [diceRoll, rollValues]
  );
  const dice = useMemo(() => diceRoll.dice.filter(isDice), [diceRoll]);

  return (
    <Stack divider={<Divider />} gap={1}>
      <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
        {die.map((d, i) => (
          <Stack direction="row" key={d.id} gap={1}>
            <DicePreview diceStyle={d.style} diceType={d.type} size="small" />
            <Typography lineHeight="28px" color="white">
              {rollValues[d.id]}
            </Typography>
            {i < die.length - 1 && (
              <Typography lineHeight="28px" color="white">
                {combination(diceRoll)}
              </Typography>
            )}
          </Stack>
        ))}
        {die.length > 0 && (
          <>
            <Typography lineHeight="28px" color="white">
              =
            </Typography>
            <Typography lineHeight="28px" color="white">
              {getCombinedDiceValue(
                { dice: die, combination: diceRoll.combination },
                rollValues
              )}
            </Typography>
          </>
        )}
      </Stack>
      {dice.map((d, i) => (
        <DiceResultsExpanded key={i} diceRoll={d} rollValues={rollValues} />
      ))}
      {diceRoll.bonus && (
        <Typography textAlign="center" lineHeight="28px" color="white">
          {diceRoll.bonus > 0 && "+"}
          {diceRoll.bonus}
        </Typography>
      )}
    </Stack>
  );
}
