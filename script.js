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

/* FC Talblick demo live transfer market — updates every full hour. */
const marketTable = document.getElementById('marketTable');
const marketStatus = document.getElementById('marketStatus');

if (marketTable) {
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

  const storageKey = 'fcTalblickMarketV2';
  const hourKey = Math.floor(Date.now() / 3600000);

  const formatValue = n =>
    n >= 1000000
      ? `€ ${(n/1000000).toFixed(2).replace('.',',')} Mio.`
      : `€ ${Math.round(n/1000)} Tsd.`;

  const formatChange = n => {
    if (n > 0) return `+€ ${Math.round(n/1000)} Tsd.`;
    if (n < 0) return `−€ ${Math.round(Math.abs(n)/1000)} Tsd.`;
    return `€ 0`;
  };

  function makeMarket() {
    let previous = null;
    try { previous = JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch (e) {}

    const previousPlayers = previous?.players || basePlayers;
    const players = basePlayers.map((p, i) => {
      const oldValue = Number(previousPlayers[i]?.value) || p.value;

      // ±2–5% movement, always at least €10k, so the change is visibly noticeable.
      const direction = Math.random() < 0.5 ? -1 : 1;
      const percent = 2 + Math.random() * 3;
      let newValue = Math.round((oldValue * (1 + direction * percent / 100)) / 10000) * 10000;

      newValue = Math.max(100000, newValue);
      const change = newValue - oldValue;

      return {...p, value:newValue, change};
    });

    const market = {hour: hourKey, players};
    try { localStorage.setItem(storageKey, JSON.stringify(market)); } catch (e) {}
    return market;
  }

  function getMarket() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved?.hour === hourKey && Array.isArray(saved.players)) return saved;
    } catch (e) {}
    return makeMarket();
  }

  function renderMarket(market) {
    const rows = market.players.map((p, i) => {
      const up = p.change > 0;
      const down = p.change < 0;
      const cls = up ? 'up' : down ? 'down' : 'flat';
      const arrow = up ? '▲' : down ? '▼' : '—';
      const oldValue = p.value - p.change;
      const pct = oldValue ? Math.abs(p.change / oldValue * 100).toFixed(1) : '0.0';

      return `
        <div class="market-row ${up ? 'flash-up' : down ? 'flash-down' : ''}">
          <div class="market-rank">${String(i+1).padStart(2,'0')}</div>
          <div class="market-player">
            <strong>${p.name}</strong>
            <span>${p.pos}</span>
          </div>
          <div class="market-value">
            ${formatValue(p.value)}
            <span class="market-euro ${cls}">${formatChange(p.change)}</span>
          </div>
          <div class="market-change ${cls}">${arrow} ${pct}%</div>
          <div class="market-time">LIVE</div>
        </div>`;
    }).join('');

    marketTable.innerHTML = `
      <div class="market-row header">
        <div>#</div><div>SPIELER</div><div>MARKTWERT</div><div>CHANGE</div><div>STATUS</div>
      </div>${rows}`;

    if (!document.getElementById('marketUpdateCopy')) {
      marketTable.insertAdjacentHTML(
        'afterend',
        `<div id="marketUpdateCopy" class="market-update-copy">
          Der <b>Live-Markt aktualisiert sich jede volle Stunde dynamisch.</b>
          Grün = Wert gestiegen · Rot = Wert gefallen · die Euro-Zahl zeigt den konkreten Marktwert-Gewinn oder -Verlust.
        </div>`
      );
    }

    if (marketStatus) {
      marketStatus.innerHTML =
        `<span class="market-live-dot"></span>LIVE · DEMO <span class="market-countdown" id="marketCountdown"></span>`;
    }
  }

  let market = getMarket();
  renderMarket(market);

  function updateCountdown() {
    const countdown = document.getElementById('marketCountdown');
    if (!countdown) return;

    const now = new Date();
    const next = new Date(now);
    next.setMinutes(60, 0, 0);

    let seconds = Math.max(0, Math.floor((next - now) / 1000));
    const h = String(Math.floor(seconds / 3600)).padStart(2,'0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2,'0');
    const s = String(seconds % 60).padStart(2,'0');
    countdown.innerHTML = `· NÄCHSTES UPDATE <b>${h}:${m}:${s}</b>`;

    // If the hour changed while the page is open, immediately create a new market.
    const newHourKey = Math.floor(Date.now() / 3600000);
    if (newHourKey !== market.hour) {
      market = makeMarket();
      renderMarket(market);
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
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
