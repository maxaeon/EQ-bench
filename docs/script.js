// Utility helpers
function supportsDynamicImport() {
  try {
    new Function('return import("")');
    return true;
  } catch (err) {
    return false;
  }
}

let editOverlay = null;
let editTrigger = null;
let editKeyHandler = null;

function createEditOverlay() {
  if (editOverlay) return;
  editOverlay = document.createElement('div');
  editOverlay.id = 'edit-overlay';
  editOverlay.className = 'hidden';
  document.body.appendChild(editOverlay);
}

function showEditOverlay(html, trigger = document.activeElement) {
  createEditOverlay();
  editTrigger = trigger;
  editOverlay.setAttribute('role', 'dialog');
  editOverlay.setAttribute('aria-modal', 'true');
  editOverlay.innerHTML = html;
  editOverlay.classList.remove('hidden');
  editKeyHandler = e => {
    if (e.key === 'Escape') hideEditOverlay();
  };
  document.addEventListener('keydown', editKeyHandler);
  return editOverlay.querySelector('form');
}

function hideEditOverlay() {
  if (editOverlay) {
    editOverlay.classList.add('hidden');
    editOverlay.innerHTML = '';
    editOverlay.remove();
    editOverlay = null;
  }
  if (editKeyHandler) {
    document.removeEventListener('keydown', editKeyHandler);
    editKeyHandler = null;
  }
  if (editTrigger && typeof editTrigger.focus === 'function') {
    editTrigger.focus();
  }
  editTrigger = null;
}

function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function showConfirm(message, trigger = document.activeElement) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box">
        <p>${message}</p>
        <div class="modal-buttons">
          <button type="button" class="button" id="confirm-ok">OK</button>
          <button type="button" class="button" id="confirm-cancel">Cancel</button>
        </div>
      </div>`;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    document.body.appendChild(overlay);
    const ok = overlay.querySelector('#confirm-ok');
    const cancel = overlay.querySelector('#confirm-cancel');
    ok.focus();
    const cleanup = (val) => {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
      if (trigger && typeof trigger.focus === 'function') trigger.focus();
      resolve(val);
    };
    const onKey = (e) => { if (e.key === 'Escape') cleanup(false); };
    document.addEventListener('keydown', onKey);
    ok.addEventListener('click', () => cleanup(true));
    cancel.addEventListener('click', () => cleanup(false));
  });
}

function showPrompt(message, defaultValue = '', trigger = document.activeElement) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <form class="modal-box" id="prompt-form">
        <label>${message}<br><input type="text" id="prompt-input"></label>
        <div class="modal-buttons">
          <button type="submit" class="button">OK</button>
          <button type="button" class="button" id="prompt-cancel">Cancel</button>
        </div>
      </form>`;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    document.body.appendChild(overlay);
    const form = overlay.querySelector('#prompt-form');
    const input = overlay.querySelector('#prompt-input');
    input.value = defaultValue;
    input.focus();
    const cleanup = (val) => {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
      if (trigger && typeof trigger.focus === 'function') trigger.focus();
      resolve(val);
    };
    const onKey = (e) => { if (e.key === 'Escape') cleanup(null); };
    document.addEventListener('keydown', onKey);
    form.addEventListener('submit', e => { e.preventDefault(); cleanup(input.value); });
    overlay.querySelector('#prompt-cancel').addEventListener('click', () => cleanup(null));
  });
}

function openGithubIssue(template, title, body) {
  const url =
    'https://github.com/maxaeon/EQ-bench/issues/new?template=' +
    encodeURIComponent(template) +
    '&title=' + encodeURIComponent(title) +
    '&body=' + encodeURIComponent(body);
  const win = window.open(url, '_blank');
  if (!win) showToast('Unable to open GitHub issue.');
  return win;
}

function toTitleCase(str) {
  return str.replace(/\b(\w)(\w*)/g, (_, c, rest) => c.toUpperCase() + rest.toLowerCase());
}

function toInt(value) {
  const str = String(value ?? '').trim();
  return /^-?\d+$/.test(str) ? parseInt(str, 10) : null;
}

// Map common variations of field names to canonical keys
const FIELD_MAP = {
  title: 'title',
  author: 'authors',
  authors: 'authors',
  authorss: 'authors', // from "author(s)"
  url: 'url',
  link: 'url',
  doi: 'url',
  year: 'year',
  journal: 'journal',
  booktitle: 'booktitle',
  publisher: 'publisher',
  institution: 'publisher',
  volume: 'volume',
  number: 'number',
  pages: 'pages',
  page: 'pages',
  construct: 'construct',
  seraconstruct: 'construct',
  axis: 'axis',
  seraaxis: 'axis',
  keyword: 'keywords',
  keywords: 'keywords',
  note: 'relevance',
  relevance: 'relevance',
  summary: 'relevance',
  methodologysupported: 'methodology_supported',
  methodology: 'methodology_supported'
};

function normalizeFieldKey(key) {
  if (!key) return key;
  const cleaned = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  return FIELD_MAP[cleaned] || FIELD_MAP[key] || key.toLowerCase();
}

function normalizeFields(obj) {
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    const nk = normalizeFieldKey(k);
    if (result[nk] === undefined) result[nk] = v;
  }
  return result;
}

const ALLOWED_LIT_FIELDS = new Set([
  'title', 'authors', 'year', 'publisher', 'journal', 'volume', 'number', 'pages',
  'url', 'doi', 'construct', 'axis', 'keywords', 'relevance',
  'methodology_supported', 'category', 'entry_type'
]);

function sanitizeLiteratureFields(obj) {
  const clean = {};
  for (const [k, v] of Object.entries(obj)) {
    if (ALLOWED_LIT_FIELDS.has(k)) clean[k] = v;
  }
  return clean;
}

// Authentication-related helpers were removed. Forms now open GitHub issues.

async function fetchConstructs() {
  return [];
}

async function addConstruct(construct) {
  openGithubIssue(
    'construct.yml',
    'New construct: ' + (construct.title || ''),
    '```json\n' + JSON.stringify(construct, null, 2) + '\n```'
  );
  return { data: null, error: null };
}

async function updateConstruct(id, updates) {
  const updateData = { id, ...updates };
  openGithubIssue(
    'construct.yml',
    'Update construct: ' + (updates.title || id),
    '```json\n' + JSON.stringify(updateData, null, 2) + '\n```'
  );
  return { data: null, error: null };
}

async function deleteConstruct(id) {
  openGithubIssue('delete-construct.yml', 'Delete construct: ' + id, 'ID: ' + id);
  return null;
}

async function fetchLiterature() {
  return [];
}

async function addLiterature(entry) {
  openGithubIssue(
    'reference.yml',
    'New reference: ' + (entry.title || ''),
    '```json\n' + JSON.stringify(entry, null, 2) + '\n```'
  );
  return { data: null, error: null };
}

async function updateLiterature(id, updates) {
  openGithubIssue(
    'reference.yml',
    'Update reference: ' + (updates.title || id),
    '```json\n' + JSON.stringify({ id, ...updates }, null, 2) + '\n```'
  );
  return { data: null, error: null };
}

async function deleteLiterature(id) {
  openGithubIssue('delete-publication.yml', 'Delete publication: ' + id, 'ID: ' + id);
  return null;
}

async function fetchBenchmarks() {
  return [];
}

async function addBenchmark(entry) {
  openGithubIssue(
    'dataset-submission.yml',
    'New benchmark entry',
    '```json\n' + JSON.stringify(entry, null, 2) + '\n```'
  );
  return { data: null, error: null };
}

async function updateBenchmark(id, updates) {
  openGithubIssue(
    'dataset-submission.yml',
    'Update benchmark: ' + id,
    '```json\n' + JSON.stringify({ id, ...updates }, null, 2) + '\n```'
  );
  return null;
}

async function deleteBenchmark(id) {
  openGithubIssue('dataset-submission.yml', 'Delete benchmark: ' + id, 'ID: ' + id);
  return null;
}

// Navigation menu toggle for small screens
window.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

  const header = document.querySelector('header');
  if (header) {
    // previously a login/logout button was inserted here
  }
});

// Populate constructs for a given axis onto the page
function populateAxisConstructs(axis, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  fetch('data/construct_submissions.json')
    .then(r => r.json())
    .then(data => {
      const axisLower = axis.toLowerCase();
      const items = data.filter(c => {
        if (c.axes) {
          const axes = Array.isArray(c.axes)
            ? c.axes.map(a => String(a).trim().toLowerCase())
            : c.axes.split(',').map(a => a.trim().toLowerCase());
          if (axes.includes(axisLower)) return true;
        }
        return c.body && c.body.toLowerCase().includes(axisLower);
      });
      if (items.length === 0) {
        container.textContent = 'No constructs submitted yet.';
        return;
      }
      const ul = document.createElement('ul');
      items.forEach((c, idx) => {
        const li = document.createElement('li');
        const id = `${containerId}-detail-${idx}`;
        const synonyms = Array.isArray(c.synonyms) ? c.synonyms.join(', ') : (c.synonyms || '');
        const related = Array.isArray(c.related_terms) ? c.related_terms.join(', ') : (c.related_terms || '');
        const issues = c.verification_issues || '';
        const btn = document.createElement('button');
        btn.className = 'toggle-details';
        btn.dataset.target = id;
        btn.textContent = c.title;
        const details = document.createElement('div');
        details.id = id;
        details.className = 'construct-details';
        details.style.display = 'none';
        const delUrl =
          'https://github.com/maxaeon/EQ-bench/issues/new?template=delete-construct.yml&title=' +
          encodeURIComponent('Delete construct: ' + c.title);
        const issueUrl =
          'https://github.com/maxaeon/EQ-bench/issues/new?template=construct.yml&title=' +
          encodeURIComponent('Feedback on ' + c.title);
        details.innerHTML = `
          <strong>synonyms:</strong> ${synonyms}<br>
          <strong>related terms:</strong> ${related}<br>
          ${c.evaluation ? `<strong>How to Measure:</strong> ${c.evaluation.length > 250 ? c.evaluation.slice(0,250)+'…' : c.evaluation}<br>` : ''}
          <strong>Potential Issues:</strong> ${issues}<br><br>
          ${c.example ? `<em>${c.example}</em><br>` : ''}
          <div class="construct-actions">
            <a href="${delUrl}" target="_blank" class="delete-link">Request deletion</a>
            <a href="${issueUrl}" target="_blank" class="issue-link">Report issue</a>
          </div>`;
        li.appendChild(btn);
        li.appendChild(details);
        ul.appendChild(li);
      });
      ul.addEventListener('click', e => {
        if (e.target && e.target.classList.contains('toggle-details')) {
          const target = document.getElementById(e.target.dataset.target);
          if (target.style.display === 'none' || !target.style.display) {
            target.style.display = 'block';
          } else {
            target.style.display = 'none';
          }
        }
      });
      container.appendChild(ul);
    })
    .catch(() => {
      container.textContent = 'Unable to load constructs.';
    });
}

// Enable dropdown-like behavior for multi-select elements
function enableMultiSelectDropdown(select) {
  if (!select || select.__multiInitialized) return;
  select.__multiInitialized = true;

  const expand = () => {
    const count = select.options.length;
    select.size = Math.min(count, 6);
    select.classList.add('select-open');
  };

  const collapse = () => {
    const rows = Math.max(select.selectedOptions.length, 1);
    select.size = rows;
    select.classList.remove('select-open');
    if (select.selectedOptions.length > 0) {
      const first = select.selectedOptions[0];
      if (first && typeof first.scrollIntoView === 'function') {
        first.scrollIntoView({ block: 'nearest' });
      }
    }
  };

  select.addEventListener('focus', expand);
  select.addEventListener('click', expand);
  select.addEventListener('input', collapse);
  select.addEventListener('blur', collapse);
  select.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      collapse();
      select.blur();
    }
  });

  document.addEventListener('click', (e) => {
    if (!select.contains(e.target)) {
      collapse();
    }
  });
}

// Populate theoretical foundations table on the research page
function populateFoundationsTable(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  fetch('theoretical_foundations.json')
    .then(r => r.json())
    .then(data => {
      data.forEach(f => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${f.framework}</td>
          <td>${f.description}</td>
          <td>${f.origin}</td>
          <td>${f.reference}</td>
          <td>${f.role}</td>`;
        tbody.appendChild(row);
      });
    })
    .catch(() => {
      tbody.innerHTML = '<tr><td colspan="5">Unable to load foundations.</td></tr>';
    });
}


// Parse BibTeX text into reference objects matching literature.json fields.
// Any `doi` value is converted into a URL if no explicit URL is provided.
function parseBibtex(text) {
  if (!text || !window.bibtexParse || !window.bibtexParse.toJSON) return [];
  const rawEntries = window.bibtexParse.toJSON(text);
  return rawEntries.map(entry => {
    const fields = normalizeFields(entry.entryTags || {});
    const entryType = entry.entryType || fields.entrytype || '';
    const doiValue = fields.doi;
    const rawAuthors = fields.authors || '';
    const authors = rawAuthors
      ? rawAuthors.split(/\s+and\s+/).map(a => a.trim()).filter(Boolean)
      : [];
    const year = toInt(fields.year);
    const volume = toInt(fields.volume);
    const number = toInt(fields.number);
    const obj = {
      title: fields.title || '',
      authors,
      year,
      journal: fields.journal || '',
      publisher: fields.publisher || '',
      volume,
      number,
      pages: fields.pages || '',
      url: fields.url || (doiValue ? `https://doi.org/${doiValue}` : ''),
      doi: doiValue || '',
      construct: fields['sera-construct'] || fields.construct || '',
      axis: fields['sera-axis'] || fields.axis || '',
      keywords: (fields.keywords || '')
        .split(/[,;]+/)
        .map(k => k.trim())
        .filter(Boolean),
      relevance: fields.note || fields.relevance || '',
      methodology_supported: fields.methodology_supported || '',
      entry_type: entryType
    };
    for (const [k, v] of Object.entries(fields)) {
      if (k === 'authors') continue;
      if (!(k in obj)) obj[k] = v;
    }
    return obj;
  });
}

// Parse CSV text into literature objects similar to parseBibtex.
// Dynamically loads PapaParse if not already present.
async function parseCsv(text) {
  if (!text) return [];
  if (!window.Papa) {
    if (supportsDynamicImport()) {
      try {
        const mod = await import('https://cdn.jsdelivr.net/npm/papaparse/+esm');
        window.Papa = mod.default || mod;
      } catch (err) {
        console.error('Failed to load PapaParse', err);
        return [];
      }
    } else {
      await new Promise(resolve => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/papaparse@latest/papaparse.min.js';
        s.async = true;
        s.onload = resolve;
        s.onerror = e => { console.error('Failed to load PapaParse', e); resolve(); };
        document.head.appendChild(s);
      });
      if (!window.Papa) return [];
    }
  }
  const result = window.Papa.parse(text.trim(), { header: true });
  const rows = Array.isArray(result.data) ? result.data : [];
  return rows.map(raw => {
    const row = normalizeFields(raw);
    const authorsRaw = row.authors || '';
    const authors = authorsRaw
      ? authorsRaw
          .split(/\s*[,;]\s*|\s+and\s+/)
          .map(a => a.trim())
          .filter(Boolean)
      : [];
    const year = toInt(row.year);
    const volume = toInt(row.volume);
    const number = toInt(row.number);
    const obj = {
      title: row.title || '',
      authors,
      year,
      journal: row.journal || '',
      publisher: row.publisher || '',
      volume,
      number,
      pages: row.pages || '',
      url: row.url || '',
      doi: row.doi || '',
      construct: row['sera-construct'] || row.construct || '',
      axis: row['sera-axis'] || row.axis || '',
      keywords: (row.keywords || '')
        .split(/[,;]+/)
        .map(k => k.trim())
        .filter(Boolean),
      relevance: row.note || row.relevance || '',
      methodology_supported: row.methodology_supported || '',
      entry_type: row.entry_type || row.type || ''
    };
    for (const [k, v] of Object.entries(row)) {
      if (!(k in obj)) obj[k] = v;
    }
    return obj;
  });
}
