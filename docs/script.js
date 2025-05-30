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
  fetch('construct_submissions.json')
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
function initStarRatings(selector, keyPrefix, updateFn) {
  document.querySelectorAll(selector).forEach(el => {
    const idx = el.dataset.index;
    const key = keyPrefix + '-' + idx;
    const stored = parseInt(localStorage.getItem(key) || '0', 10);

    const render = (rating) => {
      el.innerHTML = '';
      for (let i = 1; i <= 5; i++) {
        const s = document.createElement('span');
        s.className = 'star' + (i <= rating ? ' filled' : '');
        s.dataset.value = i;
        s.textContent = '★';
        el.appendChild(s);
      }
    };

    render(stored);
    updateFn(idx);

    el.addEventListener('click', (e) => {
      const star = e.target.closest('.star');
      if (!star) return;
      const val = parseInt(star.dataset.value, 10);
      localStorage.setItem(key, val);
      render(val);
      updateFn(idx);
    });
  });
}

// Calculate average rating from existing values and optional user value
function computeAverage(base, user) {
  const arr = Array.isArray(base) ? base.slice() : [];
  if (user !== null && user !== '') arr.push(parseFloat(user));
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + parseFloat(b), 0) / arr.length;
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
