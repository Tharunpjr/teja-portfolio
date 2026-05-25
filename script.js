// ── Typewriter effect ─────────────────────────────────────
const roles = [
  "AI/ML Engineer",
  "Data Scientist",
  "LLM & RAG Specialist",
  "Full-Stack Developer",
  "MLOps Engineer"
];

let rIdx = 0, cIdx = 0, deleting = false;
const typed = document.getElementById('typed');

function typeWriter() {
  const role = roles[rIdx];
  typed.textContent = deleting
    ? role.substring(0, cIdx - 1)
    : role.substring(0, cIdx + 1);
  deleting ? cIdx-- : cIdx++;
  let delay = deleting ? 55 : 95;
  if (!deleting && cIdx === role.length) { delay = 2200; deleting = true; }
  else if (deleting && cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; delay = 380; }
  setTimeout(typeWriter, delay);
}
typeWriter();

// ── Animate skill bars ────────────────────────────────────
let barsAnimated = false;
function animateBars() {
  if (barsAnimated) return;
  barsAnimated = true;
  document.querySelectorAll('.bfill').forEach(bar => {
    bar.style.width = bar.dataset.w + '%';
  });
}

// ── IntersectionObserver: fade-in + bars ──────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (entry.target.closest('.skills-section')) animateBars();
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in:not(.hidden-proj)').forEach(el => observer.observe(el));

// Also trigger bars when skills section scrolls in
const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
  const bObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateBars(); bObs.disconnect(); }
  }, { threshold: 0.1 });
  bObs.observe(skillsSection);
}

// ── Show / Hide Projects ──────────────────────────────────
const showAllBtn     = document.getElementById('showAllBtn');
const hiddenProjects = document.querySelectorAll('.hidden-proj');
let allShown = false;

showAllBtn.addEventListener('click', () => {
  allShown = !allShown;
  hiddenProjects.forEach(p => {
    p.classList.toggle('shown', allShown);
    if (allShown) {
      requestAnimationFrame(() => observer.observe(p));
    } else {
      p.classList.remove('visible');
    }
  });
  showAllBtn.textContent = allShown
    ? 'Show Less ↑'
    : 'View All 10 Projects ↓';

  if (allShown) {
    setTimeout(() => {
      document.querySelector('#projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
});

// ── Header shadow on scroll ───────────────────────────────
const header  = document.getElementById('header');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  backTop.classList.toggle('visible', y > 400);
});

// ── Back to top ───────────────────────────────────────────
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Mobile nav ────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');
hamburger.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// ── Active nav highlight ──────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#nav a');

const secObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.style.color = '');
      const active = document.querySelector(`#nav a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--accent)';
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => secObs.observe(s));
