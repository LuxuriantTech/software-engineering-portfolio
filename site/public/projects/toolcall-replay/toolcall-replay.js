import {
  DEFAULT_BASELINE,
  DEFAULT_CANDIDATE,
  DEFAULT_RULES,
  evaluatePair,
  formatRules,
  formatTrace,
} from "./toolcall-replay-engine.js";

const byId = (id) => document.getElementById(id);
const rulesInput = byId("rules-input");
const baselineInput = byId("baseline-input");
const candidateInput = byId("candidate-input");
const output = byId("tool-output");
const error = byId("tool-error");
const live = byId("tool-live");

rulesInput.value = formatRules(DEFAULT_RULES);
baselineInput.value = formatTrace(DEFAULT_BASELINE);
candidateInput.value = formatTrace(DEFAULT_CANDIDATE);

function el(name, className, value) {
  const node = document.createElement(name);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
}

function renderEvaluation(label, evaluation) {
  const section = el("section", "toolcall-result");
  const heading = el("h3", "", label);
  const badge = el("p", `toolcall-verdict ${evaluation.verdict.toLowerCase()}`, `${evaluation.verdict} · ${evaluation.rules.filter((item) => item.verdict === "PASS").length}/${evaluation.rules.length} rules passed`);
  const list = el("ol", "toolcall-rule-list");
  for (const rule of evaluation.rules) {
    const item = el("li", `toolcall-rule ${rule.verdict.toLowerCase()}`);
    item.append(el("strong", "", `${rule.verdict} · ${rule.rule_id}`), el("p", "", rule.message), el("pre", "toolcall-evidence", JSON.stringify(rule.evidence, null, 2)));
    list.append(item);
  }
  section.append(heading, badge, list);
  return section;
}

function renderEvents(label, events, filter) {
  const section = el("section", "toolcall-result toolcall-trace");
  section.append(el("h3", "", `${label} events`));
  const list = el("ol", "toolcall-event-list");
  const needle = filter.trim().toLocaleLowerCase();
  const visible = events.filter((event) => !needle || JSON.stringify(event).toLocaleLowerCase().includes(needle));
  for (const event of visible) {
    const row = el("li", "toolcall-event");
    row.append(el("strong", "", `Step ${event.step} · ${event.kind}${event.tool ? ` · ${event.tool}` : ""}`), el("pre", "toolcall-evidence", JSON.stringify(event, null, 2)));
    list.append(row);
  }
  section.append(visible.length ? list : el("p", "toolcall-empty", "No events match this filter. Clear the filter or try another term."));
  return section;
}

function run() {
  error.hidden = true;
  error.textContent = "";
  output.replaceChildren();
  try {
    const result = evaluatePair({ rulesText: rulesInput.value, baselineText: baselineInput.value, candidateText: candidateInput.value });
    const filter = byId("event-filter").value;
    output.append(renderEvaluation("Baseline", result.baseline), renderEvaluation("Candidate", result.candidate), renderEvents("Baseline", result.baselineEvents, filter), renderEvents("Candidate", result.candidateEvents, filter));
    const needle = filter.trim().toLocaleLowerCase();
    const count = [...result.baselineEvents, ...result.candidateEvents].filter((event) => !needle || JSON.stringify(event).toLocaleLowerCase().includes(needle)).length;
    live.textContent = `Evaluation complete. Baseline ${result.baseline.verdict}; candidate ${result.candidate.verdict}; ${count} matching events shown.`;
  } catch (cause) {
    error.textContent = cause instanceof Error ? cause.message : "Evaluation failed. Correct the input and run it again.";
    error.hidden = false;
    live.textContent = "Evaluation stopped. No partial result is shown.";
  }
}

byId("toolcall-run").addEventListener("click", run);
byId("event-filter").addEventListener("input", run);
byId("toolcall-reset").addEventListener("click", () => {
  rulesInput.value = formatRules(DEFAULT_RULES);
  baselineInput.value = formatTrace(DEFAULT_BASELINE);
  candidateInput.value = formatTrace(DEFAULT_CANDIDATE);
  run();
  rulesInput.focus();
});
run();
