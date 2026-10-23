const METRICS = [
  ['Answerable accuracy', (m) => `${m.answerable_correct}/${m.answerable_total} (${percent(m.answerable_correct / m.answerable_total)})`],
  ['Abstention accuracy', (m) => `${m.abstention_correct}/${m.abstention_total} (${percent(m.abstention_correct / m.abstention_total)})`],
  ['Citation precision', (m) => percent(m.citation_precision)],
  ['Citation recall', (m) => percent(m.citation_recall)],
];

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isText = (value) => typeof value === 'string' && value.trim().length > 0;
const isCount = (value) => Number.isInteger(value) && value >= 0;
const percent = (value) => `${(value * 100).toFixed(value * 100 % 1 ? 1 : 0)}%`;

export function validateEvaluation(data) {
  if (!isRecord(data) || !isRecord(data.evaluation) || !isRecord(data.metrics) || !Array.isArray(data.cases)) return false;
  const e = data.evaluation;
  if (![e.id, e.scope, e.verdict, e.note].every(isText)) return false;
  if (![e.baseline_commit, e.candidate_commit].every((sha) => typeof sha === 'string' && /^[a-f\d]{7,40}$/i.test(sha))) return false;
  if (e.links !== undefined && (!Array.isArray(e.links) || !e.links.every((link) => isRecord(link) && isText(link.label) && isText(link.url)))) return false;
  for (const side of ['baseline', 'candidate']) {
    const m = data.metrics[side];
    if (!isRecord(m) || !isCount(m.answerable_correct) || !isCount(m.answerable_total) || m.answerable_total < 1 || m.answerable_correct > m.answerable_total) return false;
    if (!isCount(m.abstention_correct) || !isCount(m.abstention_total) || m.abstention_total < 1 || m.abstention_correct > m.abstention_total) return false;
    if (![m.citation_precision, m.citation_recall].every((n) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1)) return false;
  }
  return data.cases.every((item) => {
    if (!isRecord(item) || ![item.id, item.question, item.kind].every(isText)) return false;
    return ['baseline', 'candidate'].every((side) => {
      const result = item[side];
      return isRecord(result) && isText(result.status) && typeof result.answer === 'string' && Array.isArray(result.citations) && result.citations.every((citation) => isRecord(citation) && isText(citation.document_name) && isCount(citation.page) && typeof citation.excerpt === 'string');
    });
  });
}

function node(doc, tag, text, className) {
  const element = doc.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function safeLink(raw, baseUrl) {
  try {
    const url = new URL(raw, baseUrl);
    if (url.protocol !== 'https:') return null;
    if (url.hostname === 'github.com' && (url.pathname === '/LuxuriantTech/evidencedesk' || url.pathname.startsWith('/LuxuriantTech/evidencedesk/'))) return url.href;
    if (url.origin === new URL(baseUrl).origin && (url.pathname === '/projects/evidencedesk/evaluation-followup.json' || url.pathname.startsWith('/projects/evidencedesk/artifacts/'))) return url.href;
  } catch { /* Invalid URLs are omitted. */ }
  return null;
}

function renderCitations(doc, result) {
  const list = node(doc, 'ul');
  if (result.citations.length === 0) {
    list.append(node(doc, 'li', 'No cited sources recorded.'));
    return list;
  }
  for (const citation of result.citations) {
    const item = node(doc, 'li');
    const title = node(doc, 'strong', `${citation.document_name}, page ${citation.page}`);
    item.append(title);
    if (citation.excerpt) item.append(node(doc, 'blockquote', citation.excerpt, 'source-quote'));
    list.append(item);
  }
  return list;
}

export function renderEvaluation({ data, document: doc, elements, baseUrl = globalThis.location?.href ?? 'https://example.invalid/projects/evidencedesk/' }) {
  const { status, content, summary, metrics, selector, caseOutput, links } = elements;
  content.hidden = true;
  metrics.replaceChildren();
  caseOutput.replaceChildren();
  links.replaceChildren();
  selector.replaceChildren();
  if (!validateEvaluation(data)) {
    status.textContent = 'Recorded comparison unavailable: the JSON is missing fields or has an invalid format. No result has been shown.';
    return false;
  }

  const e = data.evaluation;
  summary.textContent = `${e.scope} · ${e.verdict} · Baseline ${e.baseline_commit} → candidate ${e.candidate_commit}. ${e.note}`;
  for (const [label, format] of METRICS) {
    const card = node(doc, 'article', undefined, 'panel');
    card.append(node(doc, 'h3', label));
    const comparison = node(doc, 'div', undefined, 'comparison');
    for (const [side, title] of [['baseline', 'Baseline'], ['candidate', 'Candidate']]) {
      const value = node(doc, 'p');
      value.append(node(doc, 'strong', `${title}: `), doc.createTextNode(format(data.metrics[side])));
      comparison.append(value);
    }
    card.append(comparison);
    metrics.append(card);
  }
  for (const item of data.cases) {
    const question = item.question.length > 100 ? `${item.question.slice(0, 97)}…` : item.question;
    const option = node(doc, 'option', `${question} · ${item.id}`);
    option.value = item.id;
    selector.append(option);
  }
  const renderCase = () => {
    caseOutput.replaceChildren();
    const item = data.cases.find((entry) => entry.id === selector.value);
    if (!item) {
      caseOutput.append(node(doc, 'p', 'No cases were included in this recorded comparison.'));
      return;
    }
    caseOutput.append(node(doc, 'h3', item.question));
    const comparison = node(doc, 'div', undefined, 'comparison');
    for (const [side, title] of [['baseline', 'Baseline'], ['candidate', 'Candidate']]) {
      const result = item[side];
      const panel = node(doc, 'article', undefined, 'panel');
      panel.append(node(doc, 'h3', title), node(doc, 'p', `Status: ${result.status}`, 'demo-status'), node(doc, 'p', result.answer));
      const sources = node(doc, 'section');
      sources.append(node(doc, 'h4', 'Cited passages'));
      sources.append(renderCitations(doc, result));
      panel.append(sources);
      comparison.append(panel);
    }
    caseOutput.append(comparison);
  };
  selector.value = data.cases[0]?.id ?? '';
  selector.addEventListener('change', renderCase);
  renderCase();
  for (const link of e.links ?? []) {
    const url = safeLink(link.url, baseUrl);
    if (!url) continue;
    const item = node(doc, 'li');
    const anchor = node(doc, 'a', link.label);
    anchor.href = url;
    anchor.rel = 'noopener noreferrer';
    item.append(anchor);
    links.append(item);
  }
  status.textContent = 'Recorded comparison loaded. These are saved results, not a live evaluation.';
  content.hidden = false;
  return true;
}

export async function loadRecordedEvaluation({ fetchImpl = globalThis.fetch, document: doc = globalThis.document } = {}) {
  const elements = {
    status: doc.querySelector('#follow-up-status'), content: doc.querySelector('#follow-up-content'),
    summary: doc.querySelector('#follow-up-summary'), metrics: doc.querySelector('#follow-up-metrics'),
    selector: doc.querySelector('#follow-up-case'), caseOutput: doc.querySelector('#follow-up-case-output'),
    links: doc.querySelector('#follow-up-links'),
  };
  try {
    const response = await fetchImpl('./evaluation-followup.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('missing');
    const data = await response.json();
    return renderEvaluation({ data, document: doc, elements, baseUrl: doc.location?.href ?? globalThis.location?.href });
  } catch {
    elements.content.hidden = true;
    elements.status.textContent = 'Follow-up evaluation is not available yet. The recorded comparison file is missing or could not be read.';
    return false;
  }
}

if (typeof document !== 'undefined') loadRecordedEvaluation();
