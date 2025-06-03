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
      '\nIf you forgot your login information or encounter issues, please email maxaeonparks@gmail.com.' +
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

async function handleAuthButton() {
  if (await isLoggedIn()) {
    await logout();
    showToast('Logged out');
  } else {
    const ok = await authenticate();
    if (ok) showToast('Logged in');
  }
  updateAuthButton();
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
  if (!client) return null;
  const { data, error } = await client.from('constructs').update(updates).eq('id', id);
  if (error) {
    console.error('Error updating construct:', error);
    return null;
  }
  return data;
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
  const { id, ...insertData } = entry;
  const { data, error } = await client.from('literature').insert([insertData]);
  if (error) {
    console.error('Error adding literature:', error);
  }
  return { data, error };
}

async function updateLiterature(id, updates) {
  const client = await ensureSupabase();
  if (!client) return null;
  const { data, error } = await client.from('literature').update(updates).eq('id', id);
  if (error) {
    console.error('Error updating literature:', error);
    return null;
  }
  return data;
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
    select.size = 1;
    select.classList.remove('select-open');
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


// Parse BibTeX text into reference objects matching literature.json fields
function parseBibtex(text) {
  if (!text || !window.bibtexParse || !window.bibtexParse.toJSON) return [];
  const rawEntries = window.bibtexParse.toJSON(text);
  return rawEntries.map(entry => {
    const fields = entry.entryTags || {};
    const rawAuthors = fields.author || fields.authors || '';
    const authors = rawAuthors
      ? rawAuthors.split(/\s+and\s+/).map(a => a.trim()).filter(Boolean)
      : [];
    const obj = {
      title: fields.title || '',
      authors,
      year: fields.year || '',
      journal: fields.journal || fields.booktitle || '',
      publisher: fields.publisher || '',
      volume: fields.volume || '',
      number: fields.number || '',
      pages: fields.pages || '',
      url: fields.url || (fields.doi ? `https://doi.org/${fields.doi}` : ''),
      doi: fields.doi || '',
      construct: fields['sera-construct'] || fields.construct || '',
      axis: fields['sera-axis'] || fields.axis || '',
      keywords: (fields.keywords || fields.keyword || '')
        .split(/[,;]+/)
        .map(k => k.trim())
        .filter(Boolean),
      relevance: fields.note || '',
      methodology_supported: fields.methodology_supported || ''
    };
    // Preserve any additional fields not explicitly handled
    for (const [k, v] of Object.entries(fields)) {
      if (!(k in obj)) obj[k] = v;
    }
    return obj;
  });
}
