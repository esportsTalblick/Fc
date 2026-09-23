const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-header nav');
if(navToggle && nav){
  navToggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

const loader = document.getElementById('loader');
if(loader){
  // Deliberately keep the intro visible for 4 seconds.
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 4000);
  });
}

const form = document.getElementById('applicationForm');
if(form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const position = document.getElementById('position').value;
    const experience = document.getElementById('experience').value.trim();
    const birth = document.getElementById('birth').value;
    const message = document.getElementById('message').value.trim();

    const subject = encodeURIComponent(`Spielerbewerbung FC Talblick – ${position}`);
    const body = encodeURIComponent(
`Hallo FC Talblick,

ich möchte mich als Spieler bewerben.

E-Mail: ${email}
Position: ${position}
Spielerfahrung: ${experience}
Geburtsdatum: ${birth}

Nachricht:
${message || 'Keine zusätzliche Nachricht.'}

Viele Grüße`
    );
    window.location.href = `mailto:ESportTalblick@gmail.com?subject=${subject}&body=${body}`;
  });
}

const shopModal = document.getElementById('shopModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const closeShopModal = document.getElementById('closeShopModal');

document.querySelectorAll('.shop-buy').forEach(button => {
  button.addEventListener('click', () => {
    if(!shopModal) return;
    const product = button.dataset.product;
    const price = button.dataset.price;
    modalTitle.textContent = product;
    modalText.textContent = `${product} · ${price}. Dies ist nur eine fiktive Vorbestellung – es findet keine Zahlung und kein Versand statt.`;
    shopModal.classList.add('open');
    shopModal.setAttribute('aria-hidden','false');
  });
});

if(closeShopModal && shopModal){
  closeShopModal.addEventListener('click', () => {
    shopModal.classList.remove('open');
    shopModal.setAttribute('aria-hidden','true');
  });
  shopModal.addEventListener('click', (e) => {
    if(e.target === shopModal){
      shopModal.classList.remove('open');
      shopModal.setAttribute('aria-hidden','true');
    }
  });
}

const preorderForm = document.getElementById('preorderForm');
if(preorderForm){
  preorderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('preorderEmail').value.trim();
    const product = modalTitle ? modalTitle.textContent : 'Fanartikel';
    const subject = encodeURIComponent(`FC Talblick Vorbestellung – ${product}`);
    const body = encodeURIComponent(
      `Hallo FC Talblick,\n\nich möchte den folgenden Artikel fiktiv vorbestellen:\n\nArtikel: ${product}\nE-Mail: ${email}\n\nHinweis: Dies ist eine Demo-Vorbestellung über die Website.\n\nViele Grüße`
    );
    window.location.href = `mailto:ESportTalblick@gmail.com?subject=${subject}&body=${body}`;
  });
}

const ticketForm = document.getElementById('ticketForm');
if(ticketForm){
  ticketForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const block = document.getElementById('ticketBlock').value;
    const count = document.getElementById('ticketCount').value;
    const subject = encodeURIComponent('FC Talblick Ticket-Vorbestellung – Sanremo Park');
    const body = encodeURIComponent(
      `Hallo FC Talblick,\n\nich möchte fiktiv Tickets vorbestellen.\n\n${block}\nAnzahl: ${count}\n\nHinweis: Dies ist eine Demo-Vorbestellung. Keine Zahlung / kein echter Ticketversand.\n\nViele Grüße`
    );
    window.location.href = `mailto:ESportTalblick@gmail.com?subject=${subject}&body=${body}`;
  });
}
