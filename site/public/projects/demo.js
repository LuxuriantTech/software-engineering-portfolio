"use strict";

const byId = (id) => document.getElementById(id);
const text = (node, value) => { node.textContent = value; return node; };
const element = (name, className, value) => {
  const node = document.createElement(name);
  if (className) node.className = className;
  if (value !== undefined) text(node, value);
  return node;
};
const reset = (ids) => ids.forEach((id) => { const node = byId(id); if (node) node.value = node.dataset.initial || ""; });

const pmrStages = [
  ["Expand", "Add nullable amount_minor and currency_code columns."], ["Compatibility", "Permit temporary old and new write shapes."], ["Backfill", "Resume bounded batches and check idempotence."], ["Switch", "Move reads and writes to the target shape."], ["Contract", "Remove the legacy column after the boundary closes."]
];
function renderPmr() {
  const selected = Number(byId("pmr-stage").value); const output = byId("pmr-output"); output.replaceChildren();
  output.append(element("p", "demo-status fail", "Prepared historical preview: the original engine is BLOCKED by its frozen image identity check. A separate CLI baseline is documented below."));
  output.append(element("p", "quiet", "Changing a stage explains the prepared six-invoice report. It does not start PostgreSQL, Docker, or a migration."));
  const list = element("div", ""); pmrStages.forEach(([name, description], index) => { const step = element("div", "stage-step"); if (index === selected) step.setAttribute("aria-current", "step"); step.append(element("span", "stage-number", String(index + 1)), element("div", "", `${name}: ${description}`)); list.append(step); }); output.append(list);
  const report = element("section", "panel spaced"); report.append(element("h3", "", "Prepared report excerpt")); report.append(element("p", "", selected < 4 ? `Selected stage: ${pmrStages[selected][0]}. The example retains invoice IDs 101 to 106 and records validation before a later switch.` : "Selected stage: Contract. The prepared report separates a completed migration from confirmed cleanup.")); report.append(element("p", "quiet", "Historical Phase B remains closed and is not represented by this control.")); output.append(report);
  byId("pmr-live").textContent = `Prepared PMR stage ${selected + 1}: ${pmrStages[selected][0]}; historical engine remains blocked; separate CLI baseline documented.`;
}

const evidenceCases = {
  answer: { question: "What annual platform amount is stated?", answer: "EUR 48,000", file: "northstar_master_services_agreement.pdf, page 1", quote: "Annual platform fee: EUR 48,000, invoiced quarterly.", note: "Prepared illustration based on a synthetic document excerpt. It is not a live model answer." },
  abstain: { question: "What is the supplier's VAT registration number?", answer: "Abstain: not stated in the supplied excerpt.", file: "northstar_master_services_agreement.pdf, page 1", quote: "The excerpt names a platform fee but contains no VAT registration number.", note: "Prepared abstention example. It demonstrates the intended product behavior, not a new evaluation result." },
  limitation: { question: "Can this answer be trusted without checking the source?", answer: "No. The frozen v7 evaluation did not meet its target.", file: "Frozen v7 evaluation record", quote: "Answerable accuracy was 9/25 and extraction F1 was 45.67%.", note: "Known limitation: retrieval alone did not establish correct answers or complete supporting evidence." }
};
function renderEvidence() {
  const item = evidenceCases[byId("evidence-select").value]; const output = byId("evidence-output"); output.replaceChildren(); output.append(element("h3", "", item.question)); output.append(element("p", "demo-status", item.answer)); const source = element("section", "source-quote"); source.append(element("strong", "", item.file), element("p", "", item.quote)); output.append(source, element("p", "quiet", item.note)); byId("evidence-live").textContent = `Prepared EvidenceDesk example: ${item.answer}`;
}

function setUp(page) {
  const map = { pmr: [renderPmr, ["pmr-stage"]], evidence: [renderEvidence, ["evidence-select"]] };
  const entry = map[page]; if (!entry) return; const [render, ids] = entry;
  ids.forEach((id) => byId(id).addEventListener("input", render)); byId(`${page}-reset`).addEventListener("click", () => { reset(ids); render(); byId(ids[0]).focus(); }); render();
}
document.addEventListener("DOMContentLoaded", () => setUp(document.body.dataset.demo));
