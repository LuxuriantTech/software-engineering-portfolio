import {
  DEFAULT_RECORDS,
  DEFAULT_THRESHOLD,
  PairInputError,
  calculatePair,
} from "./entity-pair-engine.js";

const INPUT_IDS = [
  "record-a-name", "record-a-brand", "record-a-sku", "record-a-price",
  "record-b-name", "record-b-brand", "record-b-sku", "record-b-price",
  "entity-threshold",
];
const FIELD_LABELS = {
  "record-a-name": "Record A · product name",
  "record-a-brand": "Record A · brand",
  "record-a-sku": "Record A · SKU",
  "record-a-price": "Record A · price",
  "record-b-name": "Record B · product name",
  "record-b-brand": "Record B · brand",
  "record-b-sku": "Record B · SKU",
  "record-b-price": "Record B · price",
  "entity-threshold": "Demonstration threshold",
};

function node(document, tag, className = "", text = "") {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (text) item.textContent = text;
  return item;
}

function readRecord(document, prefix) {
  return Object.fromEntries(["name", "brand", "sku", "price"].map((field) => [
    field,
    document.getElementById(`record-${prefix}-${field}`).value,
  ]));
}

function clearValidation(document) {
  for (const id of INPUT_IDS) document.getElementById(id).removeAttribute("aria-invalid");
}

function renderResult(document, result) {
  const output = document.getElementById("entity-output");
  output.replaceChildren();

  const summary = node(document, "section", "entity-result-block");
  summary.append(node(document, "h3", "", "Pair summary"));
  summary.append(node(document, "p", "entity-verdict", result.aboveThreshold
    ? "Similarity is at or above the selected demonstration threshold."
    : "Similarity is below the selected demonstration threshold."));
  summary.append(node(document, "p", "entity-score", `Similarity score: ${result.score.toFixed(3)} of 1.000`));
  summary.append(node(document, "p", "quiet", `Selected demonstration threshold: ${result.threshold.toFixed(2)}. This comparison describes only the two edited records.`));
  output.append(summary);

  const breakdown = node(document, "section", "entity-result-block");
  breakdown.append(node(document, "h3", "", "Field-by-field calculation"));
  const list = node(document, "dl", "entity-breakdown");
  for (const component of result.components) {
    const row = node(document, "div", "entity-component");
    row.append(node(document, "dt", "", `${component.label} · weight ${component.weight.toFixed(2)}`));
    row.append(node(document, "dd", "entity-component-score", component.score.toFixed(3)));
    row.append(node(document, "p", "entity-component-reason", component.explanation));
    list.append(row);
  }
  breakdown.append(list);

  if (result.reasons.length) {
    breakdown.append(node(document, "h4", "", "Differences to inspect"));
    const reasons = node(document, "ul", "entity-reasons");
    for (const reason of result.reasons) reasons.append(node(document, "li", "", reason));
    breakdown.append(reasons);
  } else {
    breakdown.append(node(document, "p", "quiet", "No difference was found by the fields included in this calculation."));
  }

  if (result.skipped.length) {
    const skipped = node(document, "details", "entity-skipped");
    skipped.append(node(document, "summary", "", `Skipped fields (${result.skipped.length})`));
    const skippedList = node(document, "ul");
    for (const reason of result.skipped) skippedList.append(node(document, "li", "", reason));
    skipped.append(skippedList);
    breakdown.append(skipped);
  }

  const disclosure = node(document, "p", "entity-score-disclosure", "This browser-only score is a deterministic demonstration value, not a probability, confidence estimate or match decision.");
  output.append(breakdown, disclosure);
}

function renderError(document, error) {
  const panel = document.getElementById("entity-error");
  panel.replaceChildren();
  panel.append(node(document, "p", "", error.message));
  panel.hidden = false;
  const fields = error.fields ?? [];
  if (fields.length) {
    const list = node(document, "ul");
    for (const fieldError of fields) {
      document.getElementById(fieldError.field).setAttribute("aria-invalid", "true");
      list.append(node(document, "li", "", `${FIELD_LABELS[fieldError.field] ?? "Input"}: ${fieldError.message}`));
    }
    panel.append(list);
    document.getElementById(fields[0].field).focus();
  } else {
    panel.focus();
  }
}

export function mountEntityWorkbench(document) {
  const form = document.getElementById("entity-workbench-form");
  const reset = document.getElementById("entity-reset");
  const results = document.getElementById("entity-results");
  const errorPanel = document.getElementById("entity-error");
  const live = document.getElementById("entity-live");
  let hasAttempted = false;

  const markStale = () => {
    results.hidden = true;
    document.getElementById("entity-output").replaceChildren();
    errorPanel.hidden = true;
    errorPanel.replaceChildren();
    clearValidation(document);
    if (hasAttempted) live.textContent = "Values changed. The previous result or input message was cleared; compare again.";
  };

  form.addEventListener("input", markStale);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hasAttempted = true;
    results.hidden = true;
    errorPanel.hidden = true;
    clearValidation(document);
    try {
      const result = calculatePair(
        readRecord(document, "a"),
        readRecord(document, "b"),
        document.getElementById("entity-threshold").value,
      );
      renderResult(document, result);
      errorPanel.replaceChildren();
      results.hidden = false;
      live.textContent = `Comparison recalculated. Similarity score ${result.score.toFixed(3)} of 1.000; not a probability.`;
    } catch (error) {
      if (!(error instanceof PairInputError)) throw error;
      renderError(document, error);
      live.textContent = "Comparison not available. Review the input message.";
    }
  });

  reset.addEventListener("click", () => {
    for (const [side, record] of Object.entries(DEFAULT_RECORDS)) {
      const prefix = side === "left" ? "a" : "b";
      for (const field of ["name", "brand", "sku", "price"]) {
        document.getElementById(`record-${prefix}-${field}`).value = record[field];
      }
    }
    document.getElementById("entity-threshold").value = DEFAULT_THRESHOLD;
    clearValidation(document);
    results.hidden = true;
    document.getElementById("entity-output").replaceChildren();
    errorPanel.hidden = true;
    errorPanel.replaceChildren();
    hasAttempted = false;
    live.textContent = "Example restored. Compare records to calculate a new result.";
  });
}

if (typeof document !== "undefined") mountEntityWorkbench(document);
