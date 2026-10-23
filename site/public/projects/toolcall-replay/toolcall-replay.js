import {
  DEFAULT_BASELINE,
  DEFAULT_CANDIDATE,
  DEFAULT_RULES,
  createReplaySession,
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
const session = createReplaySession();

rulesInput.value = formatRules(DEFAULT_RULES);
baselineInput.value = formatTrace(DEFAULT_BASELINE);
candidateInput.value = formatTrace(DEFAULT_CANDIDATE);

function el(name, className, value) {
  const node = document.createElement(name);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
}

function evidenceBlock(label, value) {
  const block = el("pre", "toolcall-evidence", JSON.stringify(value, null, 2));
  block.tabIndex = 0;
  block.setAttribute("role", "region");
  block.setAttribute("aria-label", label);
  return block;
}

function renderEvaluation(label, evaluation) {
  const section = el("section", "toolcall-result");
  const heading = el("h3", "", label);
  const badge = el("p", `toolcall-verdict ${evaluation.verdict.toLowerCase()}`, `${evaluation.verdict} · ${evaluation.rules.filter((item) => item.verdict === "PASS").length}/${evaluation.rules.length} rules passed`);
  const failedRules = evaluation.rules.filter((rule) => rule.verdict === "FAIL");
  const failureSummary = el("div", "toolcall-failed-summary");
  if (failedRules.length) {
    failureSummary.append(el("h4", "", `Failed rules (${failedRules.length})`));
    const failures = el("ul", "toolcall-failed-list");
    for (const rule of failedRules) failures.append(el("li", "", `${rule.rule_id} · ${rule.message}`));
    failureSummary.append(failures);
  } else {
    failureSummary.append(el("p", "toolcall-no-failures", "No rules failed."));
  }
  const list = el("ol", "toolcall-rule-list");
  for (const rule of evaluation.rules) {
    const item = el("li", `toolcall-rule ${rule.verdict.toLowerCase()}`);
    const details = el("details", "toolcall-rule-details");
    if (rule.verdict === "FAIL") details.open = true;
    const summary = el("summary", "", `${rule.verdict} · ${rule.rule_id} · ${rule.message}`);
    details.append(summary, el("p", "", rule.message), evidenceBlock(`Evidence for ${rule.verdict.toLowerCase()} rule ${rule.rule_id}`, rule.evidence));
    item.append(details);
    list.append(item);
  }
  section.append(heading, badge, failureSummary, list);
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
    const details = el("details", "toolcall-event-details");
    details.append(
      el("summary", "", `Step ${event.step} · ${event.kind}${event.tool ? ` · ${event.tool}` : ""}`),
      evidenceBlock(`Event JSON for step ${event.step}, ${event.kind}${event.tool ? `, ${event.tool}` : ""}`, event),
    );
    row.append(details);
    list.append(row);
  }
  section.append(visible.length ? list : el("p", "toolcall-empty", "No events match this filter. Clear the filter or try another term."));
  return section;
}

function renderResult(filter = "") {
  output.replaceChildren();
  const result = session.current();
  const events = session.filterEvents(filter);
  if (!result || !events) return;
  output.append(
    renderEvaluation("Baseline", result.baseline),
    renderEvaluation("Candidate", result.candidate),
    renderEvents("Baseline", events.baseline, ""),
    renderEvents("Candidate", events.candidate, ""),
  );
  const count = events.baseline.length + events.candidate.length;
  live.textContent = `Evaluation complete. Baseline ${result.baseline.verdict}; candidate ${result.candidate.verdict}; ${count} matching events shown.`;
}

function invalidateResults() {
  session.invalidate();
  error.hidden = true;
  error.textContent = "";
  output.replaceChildren();
  live.textContent = "Inputs changed. Current results cleared. Run evaluation to see updated results.";
}

function run() {
  error.hidden = true;
  error.textContent = "";
  output.replaceChildren();
  try {
    const outcome = session.evaluate({ rulesText: rulesInput.value, baselineText: baselineInput.value, candidateText: candidateInput.value });
    if (!outcome.ok) throw outcome.error;
    renderResult(byId("event-filter").value);
  } catch (cause) {
    session.invalidate();
    error.textContent = cause instanceof Error ? cause.message : "Evaluation failed. Correct the input and run it again.";
    error.hidden = false;
    live.textContent = "Evaluation stopped. No partial result is shown.";
  }
}

byId("toolcall-run").addEventListener("click", run);
byId("event-filter").addEventListener("input", () => {
  if (!session.current()) { output.replaceChildren(); return; }
  renderResult(byId("event-filter").value);
});
[rulesInput, baselineInput, candidateInput].forEach((input) => input.addEventListener("input", invalidateResults));
byId("toolcall-reset").addEventListener("click", () => {
  rulesInput.value = formatRules(DEFAULT_RULES);
  baselineInput.value = formatTrace(DEFAULT_BASELINE);
  candidateInput.value = formatTrace(DEFAULT_CANDIDATE);
  invalidateResults();
  rulesInput.focus();
});
run();
