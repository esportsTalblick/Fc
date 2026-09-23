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
