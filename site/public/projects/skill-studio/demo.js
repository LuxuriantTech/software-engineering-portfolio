const originalSkill = `---
name: delivery-note
description: Produce a factual delivery note from supplied validation results.
---

# Delivery note

## Procedure

1. Identify the supplied change without adding context.
2. Preserve supplied outcomes and their stated limits.
3. Separate completed checks from checks that have not been run.
4. End with the exact sentence: Checks remain to be completed.
`;
const editor = document.querySelector("#skill-editor");
const diffOutput = document.querySelector("#diff-output");
const correspondence = document.querySelector("#correspondence");
const preparedOutput = document.querySelector(".prepared-output");
const loadButton = document.querySelector("#load-example");
const exportButton = document.querySelector("#export-example");

function renderDiff() {
  const before = originalSkill.split("\n");
  const after = editor.value.split("\n");
  const count = Math.max(before.length, after.length);
  const lines = [];
  for (let index = 0; index < count; index += 1) {
    if (before[index] === after[index]) continue;
    if (before[index] !== undefined) lines.push(`- ${before[index]}`);
    if (after[index] !== undefined) lines.push(`+ ${after[index]}`);
  }
  diffOutput.textContent = lines.length ? lines.join("\n") : "No local changes.";
  const isOriginal = editor.value === originalSkill;
  preparedOutput.classList.toggle("invalid", !isOriginal);
  correspondence.textContent = isOriginal
    ? "This illustration corresponds only to the original prepared instruction. It is not model output."
    : "Instruction edited. The prepared illustration has been withdrawn because it no longer corresponds. No output was generated.";
}

function loadExample(shouldFocus = false) {
  editor.value = originalSkill;
  renderDiff();
  if (shouldFocus) editor.focus();
}

function exportMarkdown() {
  const blob = new Blob([editor.value], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "delivery-note-SKILL.md";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

editor.addEventListener("input", renderDiff);
loadButton.addEventListener("click", () => loadExample(true));
exportButton.addEventListener("click", exportMarkdown);
loadExample();
