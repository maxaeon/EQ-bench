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
      items.forEach(c => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = c.url;
        a.textContent = c.title;
        li.appendChild(a);
        ul.appendChild(li);
      });
      container.appendChild(ul);
    })
    .catch(() => {
      container.textContent = 'Unable to load constructs.';
    });
}
