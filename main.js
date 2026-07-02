// Form submit → Formspree
document.getElementById('reservationForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('input[type=submit]');
  btn.value = 'Sending...'; btn.disabled = true;

  const res = await fetch('https://formspree.io/f/mnjkbaow', {
    method: 'POST',
    body: new FormData(this),
    headers: { 'Accept': 'application/json' }
  });

  if (res.ok) {
    document.getElementById('reservationForm').style.display = 'none';
    document.querySelector('.form-note').style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
  } else {
    btn.value = 'Send Reservation Request'; btn.disabled = false;
    alert('Something went wrong. Please call us at 407-873-8404.');
  }
});

// Nav active state on scroll
const navLinks = document.querySelectorAll('.top-nav a[href^="#"]');
const sections = ['top', 'services', 'booking', 'payment']
  .map(id => document.getElementById(id)).filter(Boolean);

window.addEventListener('scroll', () => {
  let cur = 'top';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
}, { passive: true });
