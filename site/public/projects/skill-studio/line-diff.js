(function (root) {
  const MAX_CHARS = 200000;
  const MAX_LINES = 4000;
  const MAX_CELLS = 250000;
  const MAX_OUTPUT_LINES = 500;

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
    if (edits.length > MAX_OUTPUT_LINES) edits = [...edits.slice(0, MAX_OUTPUT_LINES), `… ${edits.length - MAX_OUTPUT_LINES} more diff lines omitted.`];
    return edits.join('\n');
  }

  root.SkillStudioLineDiff = createLineDiff;
  if (typeof module !== 'undefined' && module.exports) module.exports = { createLineDiff };
})(typeof globalThis === 'undefined' ? window : globalThis);
