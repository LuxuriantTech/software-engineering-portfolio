import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_BASELINE, DEFAULT_CANDIDATE, DEFAULT_RULES, evaluatePair, formatRules, formatTrace, LIMITS, parseRules, parseTrace } from "../public/projects/toolcall-replay/toolcall-replay-engine.js";

const evaluate = (baseline = DEFAULT_BASELINE, candidate = DEFAULT_CANDIDATE, rules = DEFAULT_RULES) => evaluatePair({ rulesText: formatRules(rules), baselineText: formatTrace(baseline), candidateText: formatTrace(candidate) });

test("published examples pass all baseline rules and fail only the three named candidate rules", () => {
  const pair = evaluate();
  assert.equal(pair.baseline.verdict, "PASS");
  assert.deepEqual(pair.baseline.rules.map((rule) => rule.verdict), Array(7).fill("PASS"));
  assert.equal(pair.candidate.verdict, "FAIL");
  assert.deepEqual(pair.candidate.rules.filter((rule) => rule.verdict === "FAIL").map((rule) => rule.rule_id), ["lookup-scope", "no-directory-export", "update-needs-approval"]);
  assert.deepEqual(pair.candidate.rules[4].evidence.violations, [{ step: 4, reason: "missing_reference" }]);
});

test("new input drives new results and canonical equality ignores object key order", () => {
  const candidate = DEFAULT_CANDIDATE.map((event) => ({ ...event }));
  candidate[0] = { ...candidate[0], arguments: { scope: "team:synthetic" } };
  candidate[3] = { ...candidate[3], approval_id: "update-1", arguments: { status: "updated", scope: "team:synthetic" } };
  candidate.splice(1, 1);
  candidate.forEach((event, index) => { event.step = index + 1; });
  assert.equal(evaluate(DEFAULT_BASELINE, candidate).candidate.verdict, "PASS");
  const baseline = DEFAULT_BASELINE.map((event) => ({ ...event }));
  baseline[2] = { ...baseline[2], arguments: { status: "updated", scope: "team:synthetic" } };
  assert.equal(evaluate(baseline).baseline.verdict, "PASS");
});

test("seven rule families compute pass and fail outcomes", () => {
  const cases = [
    [{ rule_id: "presence", type: "call_presence", tool: "request.lookup", min_calls: 1, max_calls: 1 }, "PASS"],
    [{ rule_id: "order", type: "call_order", first_tool: "request.lookup", then_tool: "request.update" }, "PASS"],
    [{ rule_id: "scope", type: "argument_constraint", tool: "request.lookup", argument: "scope", allowed_values: ["team:synthetic"] }, "FAIL"],
    [{ rule_id: "export", type: "forbidden_tool", tool: "directory.export" }, "FAIL"],
    [{ rule_id: "approval", type: "approval_required", tool: "request.update" }, "FAIL"],
    [{ rule_id: "result", type: "expected_result", status: "completed", output: { status: "updated", scope: "team:synthetic" } }, "PASS"],
    [{ rule_id: "budget", type: "step_budget", max_steps: 4 }, "FAIL"],
  ];
  for (const [rule, verdict] of cases) assert.equal(evaluate(DEFAULT_BASELINE, DEFAULT_CANDIDATE, [rule]).candidate.rules[0].verdict, verdict, rule.rule_id);
});

test("approval failures report exact reasons for denied, mismatched, reused, and late approvals", () => {
  const rule = [{ rule_id: "approval", type: "approval_required", tool: "request.update" }];
  const denied = DEFAULT_BASELINE.map((event) => ({ ...event })); denied[1].status = "denied";
  assert.equal(evaluate(denied, DEFAULT_CANDIDATE, rule).baseline.rules[0].evidence.violations[0].reason, "approval_denied");
  const mismatch = DEFAULT_BASELINE.map((event) => ({ ...event })); mismatch[1].arguments = { status: "wrong" };
  assert.equal(evaluate(mismatch, DEFAULT_CANDIDATE, rule).baseline.rules[0].evidence.violations[0].reason, "arguments_mismatch");
  const reused = DEFAULT_BASELINE.map((event) => ({ ...event }));
  reused.splice(3, 0, { ...reused[2], step: 4 }); reused[4].step = 5; reused[5].step = 6;
  assert.equal(evaluate(reused, DEFAULT_CANDIDATE, rule).baseline.rules[0].evidence.violations[0].reason, "approval_reused");
  const late = [
    { ...DEFAULT_BASELINE[0] },
    { ...DEFAULT_BASELINE[2], step: 2 },
    { ...DEFAULT_BASELINE[1], step: 3 },
    { ...DEFAULT_BASELINE[4], step: 4 },
  ];
  assert.equal(evaluate(late, DEFAULT_CANDIDATE, rule).baseline.rules[0].evidence.violations[0].reason, "approval_not_prior");
});

test("invalid input and unsupported schema shapes stop without partial evaluation", () => {
  assert.throws(() => parseTrace("{"), /TRACE_JSON_INVALID/);
  const extra = DEFAULT_BASELINE.map((event) => ({ ...event })); extra[0].unexpected = true;
  assert.throws(() => parseTrace(formatTrace(extra)), /TRACE_SCHEMA_INVALID/);
  assert.throws(() => parseRules('[{"rule_id":"future","type":"future_rule"}]'), /UNKNOWN_RULE_TYPE/);
  assert.throws(() => parseRules('[{"rule_id":"x","type":"step_budget","max_steps":1,"extra":true}]'), /RULES_SCHEMA_INVALID/);
  const otherCase = DEFAULT_CANDIDATE.map((event) => ({ ...event, case_id: "other-case" }));
  assert.throws(() => evaluate(DEFAULT_BASELINE, otherCase), /case_id values must match/);
});

test("trace count, byte, node, depth, operation, and output bounds reject abuse", () => {
  const tooMany = Array.from({ length: LIMITS.traceEvents + 1 }, (_, i) => ({ ...DEFAULT_BASELINE[0], step: i + 1 }));
  assert.throws(() => parseTrace(formatTrace(tooMany)), /TRACE_EVENT_LIMIT_EXCEEDED/);
  assert.throws(() => parseTrace(" ".repeat(LIMITS.traceBytes + 1)), /TRACE_TOO_LARGE/);
  const manyKeys = { ...DEFAULT_BASELINE[0], arguments: Object.fromEntries(Array.from({ length: LIMITS.traceNodes }, (_, i) => [`k${i}`, 1])) };
  assert.throws(() => parseTrace(formatTrace([manyKeys, ...DEFAULT_BASELINE.slice(1)])), /JSON_NODE_LIMIT_EXCEEDED/);
  let nested = 1; for (let i = 0; i <= LIMITS.traceDepth; i += 1) nested = [nested];
  assert.throws(() => parseTrace(formatTrace([{ ...DEFAULT_BASELINE[0], arguments: { nested } }, ...DEFAULT_BASELINE.slice(1)])), /JSON_DEPTH_LIMIT_EXCEEDED/);
  const broadRule = [{ rule_id: "scope", type: "argument_constraint", tool: "request.lookup", argument: "scope", allowed_values: Array.from({ length: 10_000 }, (_, i) => `value-${i}`) }];
  const manyCalls = Array.from({ length: 101 }, (_, i) => ({ ...DEFAULT_BASELINE[0], step: i + 1 })); manyCalls.push({ ...DEFAULT_BASELINE[4], step: 102 });
  assert.throws(() => evaluate(manyCalls, manyCalls, broadRule), /EVALUATION_BUDGET_EXCEEDED/);
  const outputRule = [{ rule_id: "scope", type: "argument_constraint", tool: "request.lookup", argument: "scope", allowed_values: [null] }];
  const large = [{ ...DEFAULT_BASELINE[0], arguments: { scope: Array.from({ length: 12_000 }, (_, i) => i) } }, ...DEFAULT_BASELINE.slice(1)];
  assert.throws(() => evaluate(large, large, outputRule), /EVALUATION_OUTPUT_LIMIT_EXCEEDED/);
});
