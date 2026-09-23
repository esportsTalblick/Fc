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

/* Demo live transfer market: values are stored locally and updated once per hour. */
const marketTable = document.getElementById('marketTable');
const marketStatus = document.getElementById('marketStatus');
if(marketTable){
  const basePlayers = [
    {name:'ILIJA', pos:'ZOM', value:1200000},
    {name:'LEON', pos:'RF', value:1050000},
    {name:'ZDRAVKO', pos:'LF / ZM / TW', value:900000},
    {name:'TOBIAS', pos:'ST', value:800000},
    {name:'KRISTIJAN', pos:'ZDM', value:700000},
    {name:'CHRIS', pos:'MS', value:600000},
    {name:'NILS', pos:'LF', value:500000},
    {name:'DANIEL', pos:'FLEX', value:300000}
  ];
  const storageKey = 'fcTalblickMarketV1';
  let market = null;
  try { market = JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch(e) {}
  const currentHour = Math.floor(Date.now() / 3600000);
  if(!market || market.hour !== currentHour){
    const previous = market?.players || basePlayers.map(p => ({...p, change:0}));
    market = {
      hour: currentHour,
      players: basePlayers.map((p,i) => {
        const old = previous[i] || p;
        const pct = (Math.random() * 8 - 4); // -4% to +4%
        const value = Math.max(100000, Math.round((old.value || p.value) * (1 + pct/100) / 10000) * 10000);
        const change = value - (old.value || p.value);
        return {...p, value, change};
      })
    };
    try { localStorage.setItem(storageKey, JSON.stringify(market)); } catch(e) {}
  }
  const fmt = n => n >= 1000000 ? `€ ${(n/1000000).toFixed(2).replace('.',',')} Mio.` : `€ ${Math.round(n/1000)} Tsd.`;
  const rows = market.players.map((p,i) => {
    const cls = p.change > 0 ? 'up' : p.change < 0 ? 'down' : 'flat';
    const arrow = p.change > 0 ? '▲' : p.change < 0 ? '▼' : '—';
    const oldValue = p.value - p.change;
    const signedEuro = p.change > 0 ? `+€ ${Math.abs(p.change/1000).toFixed(0)} Tsd.` : p.change < 0 ? `−€ ${Math.abs(p.change/1000).toFixed(0)} Tsd.` : '€ 0';
    const pct = p.change ? Math.abs(p.change / oldValue * 100).toFixed(1) : '0.0';
    return `<div class="market-row ${cls !== 'flat' ? `flash-${cls}` : ''}">
      <div class="market-rank">${String(i+1).padStart(2,'0')}</div>
      <div class="market-player"><strong>${p.name}</strong><span>${p.pos}</span></div>
      <div class="market-value">${fmt(p.value)}<span class="market-euro ${cls}">${signedEuro}</span></div>
      <div class="market-change ${cls}">${arrow} ${pct}%</div>
      <div class="market-time">STÜNDLICH</div>
    </div>`;
  }).join('');
  marketTable.innerHTML = `<div class="market-row header"><div>#</div><div>SPIELER</div><div>MARKTWERT</div><div>CHANGE</div><div>UPDATE</div></div>${rows}`;
  marketTable.insertAdjacentHTML('afterend','<div class="market-update-copy">Der Live-Markt aktualisiert sich jede volle Stunde dynamisch. Grün zeigt einen Wertzuwachs, Rot einen Wertverlust. Die Euro-Differenz zeigt, wie viel Marktwert der Spieler dazugewonnen oder verloren hat.</div>');
  if(marketStatus) marketStatus.innerHTML = '<span class="market-live-dot"></span>LIVE · DEMO · UPDATE JE STUNDE';
}

const kitName = document.getElementById('kitName');
const kitNumber = document.getElementById('kitNumber');
const kitPreview = document.getElementById('kitPreview');
function updateKitPreview(){
  if(kitPreview && kitName && kitNumber) kitPreview.textContent = `${kitName.value.toUpperCase() || 'TALBLICK'} · #${kitNumber.value || '00'}`;
}
kitName?.addEventListener('input', updateKitPreview);
kitNumber?.addEventListener('input', updateKitPreview);
updateKitPreview();

document.getElementById('kitOrder')?.addEventListener('click', () => {
  alert('Vorbestellung gespeichert! 🎽\n\nKeine Zahlung – kein echter Kauf. Das ist nur eine FC-Talblick-Demo.');
});
