const FIELD_WEIGHTS = Object.freeze({ name: 0.45, brand: 0.20, sku: 0.25, price: 0.10 });
const PRICE_ZERO_SCORE_RELATIVE_DELTA = 0.20;
const MAX_TEXT_LENGTH = 120;

export const DEFAULT_THRESHOLD = "0.86";
export const DEFAULT_RECORDS = Object.freeze({
  left: Object.freeze({ name: "Harbor Desk Lamp", brand: "Harbor", sku: "HBL8", price: "69.00" }),
  right: Object.freeze({ name: "Harbor Desk Lamp", brand: "Harbor", sku: "HBL9", price: "71.00" }),
});

export class PairInputError extends Error {
  constructor(message, fields = []) {
    super(message);
    this.name = "PairInputError";
    this.fields = fields;
  }
}

export function normalizeText(value) {
  const tokens = String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\p{M}/gu, "")
    .match(/[\p{L}\p{N}]+/gu);
  return tokens?.join(" ") ?? "";
}

function normalizeSku(value) {
  return normalizeText(value).replace(/\s/gu, "");
}

function validateRecord(record, side, errors) {
  const prefix = side === "left" ? "a" : "b";
  const normalized = {};
  let provided = false;
  for (const field of ["name", "brand", "sku"]) {
    const value = String(record[field] ?? "").trim();
    if (value.length > MAX_TEXT_LENGTH) {
      errors.push({ field: `record-${prefix}-${field}`, message: "Use at most 120 characters." });
    }
    normalized[field] = field === "sku" ? normalizeSku(value) : normalizeText(value);
    provided ||= normalized[field] !== "";
  }

  const priceInput = String(record.price ?? "").trim();
  if (priceInput) {
    provided = true;
    if (!/^\d{1,10}(?:\.\d{1,2})?$/u.test(priceInput)) {
      errors.push({
        field: `record-${prefix}-price`,
        message: "Enter a non-negative price with up to 10 whole digits and 2 decimal places, using a dot.",
      });
    } else {
      normalized.price = Number(priceInput);
    }
  } else {
    normalized.price = null;
  }

  if (!provided) {
    errors.push({ field: `record-${prefix}-name`, message: `Add at least one value to record ${side === "left" ? "A" : "B"}.` });
  }
  return normalized;
}

function jaccard(left, right) {
  const a = new Set(left.split(" ").filter(Boolean));
  const b = new Set(right.split(" ").filter(Boolean));
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const token of a) if (b.has(token)) shared += 1;
  return shared / (a.size + b.size - shared);
}

function compareFields(left, right) {
  const components = [];
  const skipped = [];
  const reasons = [];
  const add = (key, label, score, explanation) => {
    components.push({ key, label, score, weight: FIELD_WEIGHTS[key], explanation });
  };

  if (left.name && right.name) {
    const score = jaccard(left.name, right.name);
    add("name", "Name token overlap", score, score === 1
      ? "The normalized name tokens are the same."
      : `${Math.round(score * 100)}% Jaccard overlap between the normalized name tokens.`);
    if (score < 1) reasons.push("Name tokens differ; inspect the raw values before deciding anything.");
  } else skipped.push("Name comparison skipped because one side is blank.");

  if (left.brand && right.brand) {
    const score = left.brand === right.brand ? 1 : 0;
    add("brand", "Brand exact", score, score ? "The normalized brands are the same." : "The normalized brands differ.");
    if (!score) reasons.push("The normalized brands differ.");
  } else skipped.push("Brand comparison skipped because one side is blank.");

  if (left.sku && right.sku) {
    const score = left.sku === right.sku ? 1 : 0;
    add("sku", "SKU exact", score, score ? "The normalized SKUs are the same." : "The normalized SKUs differ.");
    if (!score) reasons.push("The normalized SKUs differ.");
  } else skipped.push("SKU comparison skipped because one side is blank.");

  if (left.price !== null && right.price !== null) {
    const relativeDelta = Math.abs(left.price - right.price) / Math.max(left.price, right.price, 1);
    const score = Math.max(0, 1 - relativeDelta / PRICE_ZERO_SCORE_RELATIVE_DELTA);
    add("price", "Price distance", score, `Relative price difference: ${(relativeDelta * 100).toFixed(2)}%.`);
    if (relativeDelta > PRICE_ZERO_SCORE_RELATIVE_DELTA) reasons.push("The price difference is beyond this demo's 20% scoring range.");
  } else skipped.push("Price comparison skipped because one side is blank.");

  const weightTotal = components.reduce((sum, component) => sum + component.weight, 0);
  if (!weightTotal) {
    throw new PairInputError("Enter at least one field on both sides so the pair has something to compare.");
  }
  const score = components.reduce((sum, component) => sum + component.score * component.weight, 0) / weightTotal;
  return { components, skipped, reasons, score };
}

export function calculatePair(leftInput, rightInput, thresholdInput) {
  const errors = [];
  const left = validateRecord(leftInput, "left", errors);
  const right = validateRecord(rightInput, "right", errors);
  const rawThreshold = String(thresholdInput ?? "").trim();
  const threshold = Number(rawThreshold);
  if (!/^(?:0(?:\.\d{1,2})?|1(?:\.0{1,2})?)$/u.test(rawThreshold)) {
    errors.push({ field: "entity-threshold", message: "Enter a threshold from 0.00 to 1.00 using up to two decimal places." });
  }
  if (errors.length) throw new PairInputError("Fix the highlighted fields, then compare again.", errors);

  const result = compareFields(left, right);
  return {
    ...result,
    threshold,
    aboveThreshold: result.score >= threshold,
  };
}
