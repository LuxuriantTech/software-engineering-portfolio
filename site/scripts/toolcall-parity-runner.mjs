import fs from "node:fs";
import { evaluatePair, formatRules, formatTrace } from "../public/projects/toolcall-replay/toolcall-replay-engine.js";

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) throw new Error("Usage: node toolcall-parity-runner.mjs INPUT.json OUTPUT.json");
const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const pair = evaluatePair({
  rulesText: formatRules(input.rules),
  baselineText: formatTrace(input.baseline),
  candidateText: formatTrace(input.candidate),
});
fs.writeFileSync(outputPath, JSON.stringify({ baseline: pair.baseline, candidate: pair.candidate }));
