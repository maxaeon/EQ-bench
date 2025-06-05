// Authentication helper for CRUD actions
let supabase = null;
let supabasePromise = null;
// expose placeholder for legacy checks
window.supabase = null;

async function ensureSupabase() {
  if (supabase) return supabase;
  if (supabasePromise) return supabasePromise;
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return null;
  supabasePromise = import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
    .then(({ createClient }) => {
      supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
      window.supabase = supabase;
      return supabase;
    })
    .catch(err => {
      console.error('Failed to load Supabase client', err);
      supabasePromise = null;
      return null;
    });
  return supabasePromise;
}

// kick off loading in the background when possible
ensureSupabase();

let loginOverlay = null;
let loginResolve = null;
let editOverlay = null;

function createLoginForm() {
  if (loginOverlay) return;
  loginOverlay = document.createElement('div');
  loginOverlay.id = 'login-overlay';
  loginOverlay.className = 'hidden';
  loginOverlay.innerHTML = `
    <form id="login-form" class="login-form">
      <h3>Login</h3>
      <label>Email<br><input type="email" id="login-email" required></label><br>
      <label>Password<br><input type="password" id="login-pass" required></label><br>
      <div class="login-buttons">
        <button type="submit" class="button">Login</button>
        <button type="button" id="login-cancel" class="button">Cancel</button>
      </div>
    </form>`;
  document.body.appendChild(loginOverlay);
  const form = loginOverlay.querySelector('#login-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('#login-email').value.trim();
    const password = form.querySelector('#login-pass').value;
    hideLoginForm();
    if (loginResolve) loginResolve({ email, password });
  });
  loginOverlay.querySelector('#login-cancel').addEventListener('click', () => {
    hideLoginForm();
    if (loginResolve) loginResolve(null);
  });
}

function showLoginForm() {
  createLoginForm();
  loginOverlay.classList.remove('hidden');
  loginOverlay.querySelector('#login-email').focus();
  return new Promise(res => { loginResolve = res; });
}

function hideLoginForm() {
  if (loginOverlay) {
    loginOverlay.classList.add('hidden');
    loginOverlay.remove();
    loginOverlay = null;
  }
}

function createEditOverlay() {
  if (editOverlay) return;
  editOverlay = document.createElement('div');
  editOverlay.id = 'edit-overlay';
  editOverlay.className = 'hidden';
  document.body.appendChild(editOverlay);
}

function showEditOverlay(html) {
  createEditOverlay();
  editOverlay.innerHTML = html;
  editOverlay.classList.remove('hidden');
  return editOverlay.querySelector('form');
}

function hideEditOverlay() {
  if (editOverlay) {
    editOverlay.classList.add('hidden');
    editOverlay.innerHTML = '';
    editOverlay.remove();
    editOverlay = null;
  }
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
  doi: 'doi',
  year: 'year',
  journal: 'journal',
  booktitle: 'journal',
  publisher: 'publisher',
  volume: 'volume',
  number: 'number',
  pages: 'pages',
  construct: 'construct',
  seraconstruct: 'construct',
  axis: 'axis',
  seraaxis: 'axis',
  keyword: 'keywords',
  keywords: 'keywords',
  note: 'relevance',
  relevance: 'relevance',
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

// Prompt the user to log in if no session is active
async function authenticate() {
  const client = await ensureSupabase();
  if (!client) return false;
  const { data: { session } } = await client.auth.getSession();
  if (session) return true;

  while (true) {
    const creds = await showLoginForm();
    if (!creds) return false;
    const { error } = await client.auth.signInWithPassword(creds);
    hideLoginForm();
    if (!error) return true;
    const retry = confirm(
      'Login failed: ' + (error.message || error) +
      '\nIf you forgot your login information or encounter issues, please email Max Parks at maxaeonparks@gmail.com.' +
      '\n\nClick OK to try again, or Cancel to return.'
    );
    if (!retry) return false;
  }
}

async function isLoggedIn() {
  const client = await ensureSupabase();
  if (!client) return false;
  const { data: { session } } = await client.auth.getSession();
  return !!session;
}

async function logout() {
  const client = await ensureSupabase();
  if (client) await client.auth.signOut();
}

async function updateAuthButton() {
  const btn = document.querySelector('#auth-btn');
  if (!btn) return;
  btn.textContent = (await isLoggedIn()) ? 'Logout' : 'Login';
}

// Enable or hide the BibTeX upload control based on login status
async function updateBibtexUpload() {
  const input = document.getElementById('bib-upload');
  const label = document.querySelector('label[for="bib-upload"]');
  if (!input && !label) return;
  const loggedIn = await isLoggedIn();
  if (input) input.disabled = !loggedIn;
  if (label) label.style.display = loggedIn ? '' : 'none';
}

async function handleAuthButton() {
  if (await isLoggedIn()) {
    await logout();
    showToast('Logged out');
  } else {
    const ok = await authenticate();
    if (ok) showToast('Logged in');
  }
  updateAuthButton();
  updateBibtexUpload();
}

async function fetchConstructs() {
  const client = await ensureSupabase();
  if (!client) return [];
  const { data, error } = await client.from('constructs').select('*');
  if (error) {
    console.error('Error fetching constructs:', error);
    return [];
  }
  return data;
}

async function addConstruct(construct) {
  const client = await ensureSupabase();
  if (!client) {
    const error = new Error('Supabase unavailable');
    return { data: null, error };
  }
  const { data, error } = await client.from('constructs').insert([construct]);
  if (error) {
    console.error('Error adding construct:', error);
  }
  return { data, error };
}

async function updateConstruct(id, updates) {
  const client = await ensureSupabase();
  if (!client) {
    const error = new Error('Supabase unavailable');
    return { data: null, error };
  }
  const updateData = { ...updates };
  delete updateData.id;
  delete updateData.__index;
  const { data, error } = await client.from('constructs').update(updateData).eq('id', id);
  if (error) {
    console.error('Error updating construct:', error);
  }
  return { data, error };
}

async function deleteConstruct(id) {
  const client = await ensureSupabase();
  if (!client) return null;
  const { data, error } = await client.from('constructs').delete().eq('id', id);
  if (error) {
    console.error('Error deleting construct:', error);
    return null;
  }
  return data;
}

async function fetchLiterature() {
  const client = await ensureSupabase();
  if (!client) return [];
  const { data, error } = await client.from('literature').select('*');
  if (error) {
    console.error('Error fetching literature:', error);
    return [];
  }
  return data;
}

async function addLiterature(entry) {
  const client = await ensureSupabase();
  if (!client) {
    const error = new Error('Supabase unavailable');
    return { data: null, error };
  }
  const insertData = { ...entry };
  delete insertData.id;
  delete insertData.__index;
  const { data, error } = await client.from('literature').insert([insertData]);
  if (error) {
    console.error('Error adding literature:', error);
  }
  return { data, error };
}

async function updateLiterature(id, updates) {
  const client = await ensureSupabase();
  if (!client) {
    const error = new Error('Supabase unavailable');
    return { data: null, error };
  }
  const updateData = { ...updates };
  delete updateData.id;
  delete updateData.__index;
  const { data, error } = await client.from('literature').update(updateData).eq('id', id);
  if (error) {
    console.error('Error updating literature:', error);
  }
  return { data, error };
}

async function deleteLiterature(id) {
  const client = await ensureSupabase();
  if (!client) return null;
  const { data, error } = await client.from('literature').delete().eq('id', id);
  if (error) {
    console.error('Error deleting literature:', error);
    return null;
  }
  return data;
}

async function fetchBenchmarks() {
  const client = await ensureSupabase();
  if (!client) return [];
  const { data, error } = await client.from('benchmarks').select('*');
  if (error) {
    console.error('Error fetching benchmarks:', error);
    return [];
  }
  return data;
}

async function addBenchmark(entry) {
  const client = await ensureSupabase();
  if (!client) {
    const error = new Error('Supabase unavailable');
    return { data: null, error };
  }
  const { data, error } = await client.from('benchmarks').insert([entry]);
  if (error) {
    console.error('Error adding benchmark:', error);
  }
  return { data, error };
}

async function updateBenchmark(id, updates) {
  const client = await ensureSupabase();
  if (!client) return null;
  const { data, error } = await client.from('benchmarks').update(updates).eq('id', id);
  if (error) {
    console.error('Error updating benchmark:', error);
    return null;
  }
  return data;
}

async function deleteBenchmark(id) {
  const client = await ensureSupabase();
  if (!client) return null;
  const { data, error } = await client.from('benchmarks').delete().eq('id', id);
  if (error) {
    console.error('Error deleting benchmark:', error);
    return null;
  }
  return data;
}

// Navigation menu toggle for small screens
window.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  const header = document.querySelector('header');
  if (header) {
    const btn = document.createElement('button');
    btn.id = 'auth-btn';
    btn.className = 'button auth-button';
    btn.addEventListener('click', handleAuthButton);
    header.appendChild(btn);
    updateAuthButton();
    updateBibtexUpload();
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
      methodology_supported: fields.methodology_supported || ''
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
    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/papaparse/+esm');
      window.Papa = mod.default || mod;
    } catch (err) {
      console.error('Failed to load PapaParse', err);
      return [];
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
      methodology_supported: row.methodology_supported || ''
    };
    for (const [k, v] of Object.entries(row)) {
      if (!(k in obj)) obj[k] = v;
    }
    return obj;
  });
}
