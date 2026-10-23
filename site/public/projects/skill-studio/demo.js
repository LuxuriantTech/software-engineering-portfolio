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
const editorStatus = document.querySelector("#editor-status");

function setEditorStatus(message, state = "") {
  if (!editorStatus) return;
  editorStatus.textContent = message;
  if (state) editorStatus.dataset.state = state;
  else delete editorStatus.dataset.state;
}

function renderDiff() {
  const isOriginal = editor.value === originalSkill;
  preparedOutput.classList.toggle("invalid", !isOriginal);
  correspondence.textContent = isOriginal
    ? "This illustration corresponds only to the original prepared instruction. It is not model output."
    : "Instruction edited. The prepared illustration has been withdrawn because it no longer corresponds. No output was generated.";

  try {
    diffOutput.textContent = window.SkillStudioLineDiff(originalSkill, editor.value);
    setEditorStatus(editor.value === ""
      ? "The instruction is empty. The diff shows the original lines as removed; export will create an empty Markdown file."
      : "");
  } catch {
    diffOutput.textContent = "Diff unavailable.";
    setEditorStatus("The diff could not be updated. Your text is still here; reset the editor to try again.", "error");
  }
}

function loadExample(shouldFocus = false) {
  editor.value = originalSkill;
  renderDiff();
  if (shouldFocus) editor.focus();
}

function exportMarkdown() {
  let url = "";
  let link;
  try {
    if (typeof Blob !== "function" || typeof URL?.createObjectURL !== "function") {
      throw new Error("Download APIs are unavailable.");
    }
    const blob = new Blob([editor.value], { type: "text/markdown;charset=utf-8" });
    url = URL.createObjectURL(blob);
    if (!url) throw new Error("A download URL could not be created.");

    link = document.createElement("a");
    if (!link) throw new Error("A download link could not be created.");
    link.href = url;
    link.download = "delivery-note-SKILL.md";
    link.hidden = true;
    document.body.append(link);
    link.click();
    setEditorStatus(editor.value === ""
      ? "Empty Markdown download started."
      : "Markdown download started. The file contains the current editor text.", "success");
  } catch {
    setEditorStatus("Markdown export could not start. Your text is still in the editor; try again.", "error");
  } finally {
    link?.remove();
    if (url) {
      const release = () => {
        try { URL.revokeObjectURL(url); } catch { /* Keep cleanup failures out of the editor. */ }
      };
      try { window.setTimeout(release, 1000); }
      catch { release(); }
    }
  }
}

editor.addEventListener("input", renderDiff);
loadButton.addEventListener("click", () => loadExample(true));
exportButton.addEventListener("click", exportMarkdown);
loadExample();
