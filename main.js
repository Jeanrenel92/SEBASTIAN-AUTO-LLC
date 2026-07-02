// ── PDF Generation ──────────────────────────────
function generateReservationPDF(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const gold = [201, 168, 76];
  const dark = [22, 22, 22];
  const white = [245, 242, 237];
  const muted = [153, 153, 153];
  const pageW = doc.internal.pageSize.getWidth();

  // Background
  doc.setFillColor(...dark);
  doc.rect(0, 0, pageW, 297, 'F');

  // Header bar
  doc.setFillColor(...gold);
  doc.rect(0, 0, pageW, 40, 'F');

  doc.setTextColor(22, 22, 22);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('SEBASTIAN AUTOS LLC', pageW / 2, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Luxury Black Car & Executive Transportation', pageW / 2, 28, { align: 'center' });
  doc.setFontSize(8);
  doc.text('407-873-8404  ·  Sebastianautos6@gmail.com  ·  Florida, USA', pageW / 2, 36, { align: 'center' });

  // Reservation title
  doc.setTextColor(...white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('RESERVATION REQUEST', pageW / 2, 58, { align: 'center' });

  // Divider
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(20, 63, pageW - 20, 63);

  // Confirmation number
  const confNum = 'SA-' + Date.now().toString().slice(-6);
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(`Confirmation #: ${confNum}`, 20, 72);
  doc.text(`Date Issued: ${new Date().toLocaleDateString('en-US')}`, pageW - 20, 72, { align: 'right' });

  // Fields
  const fields = [
    ['PASSENGER', data.full_name],
    ['PHONE', data.phone],
    ['EMAIL', data.email],
    ['SERVICE TYPE', data.service_type || '—'],
    ['PICKUP LOCATION', data.pickup_location],
    ['DESTINATION', data.destination],
    ['PICKUP DATE', data.pickup_date],
    ['PICKUP TIME', data.pickup_time],
    ['PASSENGERS', data.passengers],
    ['SPECIAL REQUESTS', data.special_requests || 'None'],
  ];

  let y = 88;
  fields.forEach(([label, value], i) => {
    // Alternating row background
    if (i % 2 === 0) {
      doc.setFillColor(30, 30, 30);
      doc.rect(20, y - 6, pageW - 40, 14, 'F');
    }
    doc.setTextColor(...gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(label, 25, y + 2);

    doc.setTextColor(...white);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(String(value), 110);
    doc.text(lines, 95, y + 2);
    y += lines.length > 1 ? 14 + (lines.length - 1) * 5 : 14;
  });

  // Payment note box
  y += 6;
  doc.setFillColor(40, 30, 10);
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.4);
  doc.roundedRect(20, y, pageW - 40, 28, 2, 2, 'FD');
  doc.setTextColor(...gold);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PAYMENT INSTRUCTIONS', pageW / 2, y + 9, { align: 'center' });
  doc.setTextColor(...white);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Send payment via Zelle to: 407-873-8404 (Sebastian Autos LLC)', pageW / 2, y + 17, { align: 'center' });
  doc.text('Include your name and pickup date in the payment note.', pageW / 2, y + 23, { align: 'center' });

  // Footer
  doc.setDrawColor(...gold);
  doc.line(20, 275, pageW - 20, 275);
  doc.setTextColor(...muted);
  doc.setFontSize(7);
  doc.text('This document is a reservation request, not a confirmed booking. Confirmation will be sent within 24 hours.', pageW / 2, 281, { align: 'center' });
  doc.text('Sebastian Autos LLC  ·  407-873-8404  ·  Sebastianautos6@gmail.com', pageW / 2, 287, { align: 'center' });

  doc.save(`SebastianAutos_Reservation_${confNum}.pdf`);
}

// ── Form submit ──────────────────────────────────
document.getElementById('reservationForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('input[type=submit]');
  btn.value = 'Processing...'; btn.disabled = true;

  const data = {
    full_name:       this.full_name.value,
    phone:           this.phone.value,
    email:           this.email.value,
    pickup_location: this.pickup_location.value,
    destination:     this.destination.value,
    pickup_date:     this.pickup_date.value,
    pickup_time:     this.pickup_time.value,
    passengers:      this.passengers.value,
    service_type:    this.service_type.value,
    special_requests:this.special_requests.value,
  };

  // 1. Generate and download PDF
  generateReservationPDF(data);

  // 2. Send to Formspree
  const res = await fetch('https://api.web3forms.com/submit', {
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

// ── Nav active state ─────────────────────────────
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
