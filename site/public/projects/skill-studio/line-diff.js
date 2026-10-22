(function (root) {
  const MAX_CHARS = 200000;
  const MAX_LINES = 4000;
  const MAX_CELLS = 250000;
  const MAX_OUTPUT_LINES = 500;

  function boundEdits(edits) {
    if (edits.length <= MAX_OUTPUT_LINES) return edits;

    const deletedCount = edits.filter(line => line.startsWith('- ')).length;
    const addedCount = edits.filter(line => line.startsWith('+ ')).length;
    const hasBothSides = deletedCount > 0 && addedCount > 0;
    let keepDeleted = 0;
    let keepAdded = 0;

    if (hasBothSides) {
      keepDeleted = Math.min(deletedCount, Math.floor(MAX_OUTPUT_LINES / 2));
      keepAdded = Math.min(addedCount, MAX_OUTPUT_LINES - keepDeleted);
      let remaining = MAX_OUTPUT_LINES - keepDeleted - keepAdded;
      const moreDeleted = Math.min(deletedCount - keepDeleted, remaining);
      keepDeleted += moreDeleted;
      remaining -= moreDeleted;
      keepAdded += Math.min(addedCount - keepAdded, remaining);
    } else if (deletedCount > 0) {
      keepDeleted = Math.min(deletedCount, MAX_OUTPUT_LINES);
    } else if (addedCount > 0) {
      keepAdded = Math.min(addedCount, MAX_OUTPUT_LINES);
    }

    let keptDeleted = 0;
    let keptAdded = 0;
    let keptContext = 0;
    const contextBudget = MAX_OUTPUT_LINES - keepDeleted - keepAdded;
    const selected = [];
    for (const line of edits) {
      if (line.startsWith('- ')) {
        if (keptDeleted < keepDeleted) {
          selected.push(line);
          keptDeleted += 1;
        }
      } else if (line.startsWith('+ ')) {
        if (keptAdded < keepAdded) {
          selected.push(line);
          keptAdded += 1;
        }
      } else if (keptContext < contextBudget) {
        selected.push(line);
        keptContext += 1;
      }
    }

    return [...selected, `… ${edits.length - selected.length} more diff lines omitted.`];
  }

  function createLineDiff(beforeText, afterText) {
    if (beforeText === afterText) return 'No local changes.';
    if (beforeText.length + afterText.length > MAX_CHARS) return 'Diff omitted: input exceeds the 200,000 character limit.';
    const before = beforeText.split('\n');
    const after = afterText.split('\n');
    if (before.length + after.length > MAX_LINES) return 'Diff omitted: input exceeds the 4,000 line limit.';

    let prefix = 0;
    while (prefix < before.length && prefix < after.length && before[prefix] === after[prefix]) prefix += 1;
    let suffix = 0;
    while (suffix < before.length - prefix && suffix < after.length - prefix &&
      before[before.length - 1 - suffix] === after[after.length - 1 - suffix]) suffix += 1;

    const oldMiddle = before.slice(prefix, before.length - suffix);
    const newMiddle = after.slice(prefix, after.length - suffix);
    let edits;
    if ((oldMiddle.length + 1) * (newMiddle.length + 1) <= MAX_CELLS) {
      const rows = Array.from({ length: oldMiddle.length + 1 }, () => new Uint32Array(newMiddle.length + 1));
      for (let i = oldMiddle.length - 1; i >= 0; i -= 1) {
        for (let j = newMiddle.length - 1; j >= 0; j -= 1) {
          rows[i][j] = oldMiddle[i] === newMiddle[j] ? rows[i + 1][j + 1] + 1 : Math.max(rows[i + 1][j], rows[i][j + 1]);
        }
      }
      edits = [];
      let i = 0, j = 0;
      while (i < oldMiddle.length || j < newMiddle.length) {
        if (i < oldMiddle.length && j < newMiddle.length && oldMiddle[i] === newMiddle[j]) {
          edits.push(`  ${oldMiddle[i++]}`); j += 1;
        } else if (j < newMiddle.length && (i === oldMiddle.length || rows[i][j + 1] > rows[i + 1][j])) {
          edits.push(`+ ${newMiddle[j++]}`);
        } else edits.push(`- ${oldMiddle[i++]}`);
      }
    } else {
      edits = [...oldMiddle.map(line => `- ${line}`), ...newMiddle.map(line => `+ ${line}`)];
    }

    if (!edits.length) return 'No local changes.';
    return boundEdits(edits).join('\n');
  }

  root.SkillStudioLineDiff = createLineDiff;
  if (typeof module !== 'undefined' && module.exports) module.exports = { createLineDiff };
})(typeof globalThis === 'undefined' ? window : globalThis);
