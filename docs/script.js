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
  if (loginOverlay) loginOverlay.classList.add('hidden');
}

async function authenticate() {
  // If Supabase is configured, prefer email/password authentication
  const client = await ensureSupabase();
  if (client) {
    const { data: { session } } = await client.auth.getSession();
    if (session) return true;
    const creds = await showLoginForm();
    if (!creds) return false;
    const { error } = await client.auth.signInWithPassword(creds);
    if (error) {
      alert('Incorrect credentials. Access denied.');
      return false;
    }
    return true;
  }

  // Fallback to environment-provided password
  const envPass = window.DOC_PASSWORD;
  if (envPass) {
    const creds = await showLoginForm();
    if (!creds || creds.password !== envPass) {
      alert('Incorrect password. Access denied.');
      return false;
    }
  }
  return true;
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
  if (!client) return null;
  const { data, error } = await client.from('constructs').insert([construct]);
  if (error) {
    console.error('Error adding construct:', error);
    return null;
  }
  return data;
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
  if (!client) return null;
  const { data, error } = await client.from('literature').insert([entry]);
  if (error) {
    console.error('Error adding literature:', error);
    return null;
  }
  return data;
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

// Navigation menu toggle for small screens
window.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  const logoLink = document.querySelector('#logo-link');
  const logoMenu = document.querySelector('#logo-menu');
  if (logoLink && logoMenu) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      logoMenu.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      if (!logoMenu.contains(e.target) && e.target !== logoLink) {
        logoMenu.classList.remove('show');
      }
    });
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
          const axes = c.axes
            .split(',')
            .map(a => a.trim().toLowerCase());
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
          ${c.evaluation ? `<strong>How to Evaluate:</strong> ${c.evaluation.length > 250 ? c.evaluation.slice(0,250)+'…' : c.evaluation}<br>` : ''}
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
  select.addEventListener('change', collapse);
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

// Initialize interactive star rating widgets
function parseRating(val) {
  const n = parseInt(val, 10);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}

function initStarRatings(selector, keyPrefix, updateFn) {
  document.querySelectorAll(selector).forEach(el => {
    const idx = el.dataset.index;
    const key = keyPrefix + '-' + idx;
    // Read any previously stored rating and default to zero
    let stored = parseRating(localStorage.getItem(key));
    if (stored === null) stored = 0;

    const render = (rating) => {
      el.innerHTML = '';
      for (let i = 1; i <= 5; i++) {
        const s = document.createElement('span');
        s.className = 'star' + (i <= rating ? ' filled' : '');
        s.dataset.value = i;
        s.setAttribute('aria-pressed', i <= rating ? 'true' : 'false');
        s.textContent = '★';
        el.appendChild(s);
      }
    };

    // Render the widget using the stored rating so the correct
    // number of stars are initially marked as selected
    render(stored);
    // Recalculate the average to reflect this value on load
    updateFn(idx);

    el.addEventListener('click', (e) => {
      const star = e.target.closest('.star');
      if (!star) return;
      const val = parseRating(star.dataset.value);
      if (val === null) return;
      localStorage.setItem(key, val);
      render(val);
      // Trigger an update so the average rating recalculates
      updateFn(idx);
    });
  });
}

// Calculate average rating from existing values and optional user value
function computeAverage(base, user) {
  const arr = [];
  if (Array.isArray(base)) {
    base.forEach(v => {
      const n = parseRating(v);
      if (n !== null) arr.push(n);
    });
  }
  const u = parseRating(user);
  if (u !== null) arr.push(u);
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Setup star widgets and update corresponding averages
// selector: rating widget selector
// storagePrefix: prefix for localStorage keys
// getItemFn: function that returns the data item for a given index
function initRatings(selector, storagePrefix, getItemFn) {
  const update = (idx) => {
    if (typeof getItemFn !== 'function') return;
    const item = getItemFn(idx);
    if (!item) return;
    const key = storagePrefix + '-' + idx;
    const user = localStorage.getItem(key);
    const span = document.querySelector(`.avg-rating[data-index="${idx}"]`);
    if (span) span.textContent = computeAverage(item.ratings, user).toFixed(1);
  };
  initStarRatings(selector, storagePrefix, update);
}

// Parse BibTeX text into reference objects matching literature.json fields
function parseBibtex(text) {
  const entries = [];
  if (!text) return entries;
  const entryRe = /@([a-zA-Z]+)\s*{\s*([^,]+),/g;
  let match;
  while ((match = entryRe.exec(text)) !== null) {
    let start = match.index + match[0].length;
    let braces = 1;
    let i = start;
    while (i < text.length && braces > 0) {
      if (text[i] === '{') braces++; else if (text[i] === '}') braces--;
      i++;
    }
    const body = text.slice(start, i - 1);
    entryRe.lastIndex = i;
    const fields = {};
    const fieldRe = /(\w+)\s*=\s*(\{[^\}]*\}|"[^"]*"|[^,\n]+),?/g;
    let f;
    while ((f = fieldRe.exec(body)) !== null) {
      let val = f[2].trim();
      if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('"') && val.endsWith('"')))
        val = val.slice(1, -1);
      fields[f[1].toLowerCase()] = val;
    }
    entries.push({
      title: fields.title || '',
      authors: fields.author || fields.authors || '',
      year: fields.year || '',
      journal: fields.journal || fields.booktitle || '',
      publisher: fields.publisher || '',
      address: fields.address || '',
      volume: fields.volume || '',
      number: fields.number || '',
      pages: fields.pages || '',
      url: fields.url || (fields.doi ? `https://doi.org/${fields.doi}` : ''),
      doi: fields.doi || ''
    });
  }
  return entries;
}
