import { examplePair } from './examples.js';
const byId = id => document.getElementById(id);
const output = byId('contract-output'), live = byId('contract-live');
const run = byId('contract-run'), download = byId('contract-download');
let worker, timeout, latest;
function stop() { clearTimeout(timeout); worker?.terminate(); worker = undefined; run.disabled = false; }
function invalidate(message = 'Inputs changed. Run the comparison again.') {
  stop(); latest = undefined; download.disabled = true; output.replaceChildren(); live.textContent = message;
}
function load() {
  invalidate('Example loaded. You can edit either document before comparing.');
  const pair = examplePair(byId('contract-select').value);
  byId('contract-baseline').value = pair.baseline;
  byId('contract-candidate').value = pair.candidate;
}
function line(tag, text) { const node = document.createElement(tag); node.textContent = text; return node; }
function render(result) {
  stop(); output.replaceChildren(); latest = undefined; download.disabled = true;
  if (result.exitCode === 3) {
    live.textContent = 'Comparison refused. No compatibility result.';
    output.append(line('h3', `Input refused — ${result.errorCode}`), line('p', 'No report is available. Fix the input or use a supported document shape. File and network references are not supported in this browser version.'));
    return;
  }
  latest = result.report; download.disabled = false;
  const title = result.exitCode === 2 ? 'Supported breaking changes detected' : 'No supported breaking change detected';
  live.textContent = title;
  output.append(line('h3', title), line('p', result.report.disclaimer));
  for (const finding of result.report.findings) {
    const item = document.createElement('section'); item.className = 'demo-row';
    item.append(line('h4', finding.ruleId), line('p', `${finding.method.toUpperCase()} ${finding.path}: ${finding.message}`), line('code', finding.pointer));
    output.append(item);
  }
  output.append(line('h4', `Warnings (${result.report.warnings.length})`));
  for (const warning of result.report.warnings) output.append(line('p', `${warning.code}: ${warning.message} — ${warning.location}`));
  const details = document.createElement('details'); details.append(line('summary', 'Computed JSON report and input fingerprints'), line('pre', JSON.stringify(result.report, null, 2))); output.append(details);
}
run.addEventListener('click', () => {
  invalidate('Comparing locally…'); run.disabled = true;
  try {
    worker = new Worker('./compare-worker.js', { type: 'module' });
    worker.onmessage = ({ data }) => render(data);
    worker.onerror = () => render({ exitCode: 3, errorCode: 'WORKER_UNAVAILABLE' });
    timeout = setTimeout(() => render({ exitCode: 3, errorCode: 'TIME_LIMIT' }), 5000);
    worker.postMessage({ baseline: byId('contract-baseline').value, candidate: byId('contract-candidate').value });
  } catch { render({ exitCode: 3, errorCode: 'WORKER_UNAVAILABLE' }); }
});
byId('contract-select').addEventListener('change', load);
byId('contract-reset').addEventListener('click', () => { byId('contract-select').value = 'parameter'; load(); });
for (const id of ['contract-baseline', 'contract-candidate']) byId(id).addEventListener('input', () => invalidate());
download.addEventListener('click', () => {
  if (!latest) return;
  const url = URL.createObjectURL(new Blob([JSON.stringify(latest, null, 2) + '\n'], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = 'api-contract-report.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
load();
