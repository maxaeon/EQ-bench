// Navigation menu toggle for small screens
window.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
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
      const items = data.filter(c =>
        c.body && c.body.toLowerCase().includes(axis.toLowerCase())
      );
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
