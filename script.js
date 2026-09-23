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

/* =========================================================
   TALBLICK INSIDER — 100 fictional weekly stories
   New set is generated every Saturday and cached locally.
   Every external offer is rejected in the fictional storyline.
   ========================================================= */
const insiderGrid = document.getElementById('insiderGrid');
const insiderCountdown = document.getElementById('insiderCountdown');

if (insiderGrid) {
  const players = [
    ['Ilija','ZOM','Aar-Einrich 11'],
    ['Leon','RF','Lahnkicker 09'],
    ['Zdravko','LF / ZM / TW','Rhein-Lahn Select'],
    ['Tobias','ST','Einrich 04'],
    ['Kristijan','ZDM','Katzenberg United'],
    ['Chris','MS','Aar United'],
    ['Nils','LF','Lahn 1912'],
    ['Daniel','FLEX','Nassau County FC']
  ];

  // Deliberately fictional local-style team names for the demo.
  const teams = [
    'Aar-Einrich 11','Lahnkicker 09','Rhein-Lahn Select','Einrich 04',
    'Katzenberg United','Aar United','Lahn 1912','Nassau County FC',
    'Dörsbach Athletic','Katzenelnbogen City','Aarhöhe FC','Nastätter Kickers',
    'Lahnstein Pro Club','Diez Valley Esports','Hahnstätten Rovers','Taunus Süd 24'
  ];

  const playerUpdates = [
    'trainiert laut Insiderkreisen besonders konzentriert an seinem Abschluss.',
    'soll im Training mit starken Pässen auf sich aufmerksam gemacht haben.',
    'bleibt laut Teamumfeld trotz mehrerer Anfragen fest beim FC Talblick.',
    'hat seine Rolle im neuen FC27-System weiter gefestigt.',
    'arbeitet laut internen Beobachtern an seiner Konstanz.',
    'wird intern als wichtiger Baustein für die neue Saison gesehen.',
    'soll im Team aktuell für gute Stimmung sorgen.',
    'hat laut Trainingskreis einen deutlichen Formsprung gemacht.',
    'wird für seine Flexibilität im Kader geschätzt.',
    'bleibt nach aktuellem Stand Teil der Talblick-Planung.'
  ];

  const offerAmounts = ['€ 280 Tsd.','€ 350 Tsd.','€ 420 Tsd.','€ 475 Tsd.','€ 550 Tsd.','€ 650 Tsd.','€ 780 Tsd.','€ 900 Tsd.','€ 1,10 Mio.','€ 1,35 Mio.'];

  function getSaturdayKey() {
    const now = new Date();
    const d = new Date(now);
    const day = d.getDay(); // 0 Sunday, 6 Saturday
    const diff = day === 6 ? 0 : -(day + 1); // previous Saturday
    d.setDate(d.getDate() + diff);
    d.setHours(0,0,0,0);
    return d.toISOString().slice(0,10);
  }

  function seededNumber(seed) {
    let h = 2166136261;
    for (let i=0;i<seed.length;i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
    return Math.abs(h) >>> 0;
  }

  function createInsiderSet() {
    const key = getSaturdayKey();
    const stories = [];
    for (let i=0;i<100;i++) {
      const n = seededNumber(key + ':' + i);
      const p = players[n % players.length];
      const team = teams[(n >>> 3) % teams.length];
      const amount = offerAmounts[(n >>> 6) % offerAmounts.length];
      const update = playerUpdates[(n >>> 9) % playerUpdates.length];
      const isOffer = i % 3 !== 1;
      if (isOffer) {
        stories.push({
          type:'rejected',
          date:key,
          player:p[0],
          pos:p[1],
          team,
          title:`${p[0]} im Visier von ${team}`,
          text:`${team} soll laut fiktiven Insiderkreisen ein Angebot für ${p[0]} vorbereitet haben. FC Talblick hat die Anfrage abgelehnt.`,
          offer:amount
        });
      } else {
        stories.push({
          type:'player-news',
          date:key,
          player:p[0],
          pos:p[1],
          team:'FC TALBLICK',
          title:`Update: ${p[0]} · ${p[1]}`,
          text:`${p[0]} ${update}`,
          offer:'Kein Wechsel geplant'
        });
      }
    }
    return {key, stories};
  }

  const insiderStorage = 'fcTalblickInsiderV1';
  let insiderData = null;
  try { insiderData = JSON.parse(localStorage.getItem(insiderStorage) || 'null'); } catch(e) {}

  const saturdayKey = getSaturdayKey();
  if (!insiderData || insiderData.key !== saturdayKey) {
    insiderData = createInsiderSet();
    try { localStorage.setItem(insiderStorage, JSON.stringify(insiderData)); } catch(e) {}
  }

  function renderInsider() {
    // Show the first 12 on the page, while all 100 remain generated and stored.
    insiderGrid.innerHTML = insiderData.stories.slice(0,12).map((s,i) => `
      <article class="insider-card ${s.type}">
        <div class="insider-meta"><span>${String(i+1).padStart(2,'0')} · ${s.date}</span><span>${s.pos}</span></div>
        <h4>${s.title}</h4>
        <p>${s.text}</p>
        <span class="offer">${s.type === 'rejected' ? `ANGEBOT: <b>${s.offer} · ABGELEHNT</b>` : s.offer}</span>
      </article>
    `).join('');
  }
  renderInsider();

  function updateInsiderCountdown() {
    if (!insiderCountdown) return;
    const now = new Date();
    const next = new Date(now);
    const day = now.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7 || 7;
    next.setDate(now.getDate() + daysUntilSaturday);
    next.setHours(0,0,0,0);
    const seconds = Math.max(0, Math.floor((next - now)/1000));
    const days = Math.floor(seconds/86400);
    const hours = String(Math.floor((seconds%86400)/3600)).padStart(2,'0');
    const mins = String(Math.floor((seconds%3600)/60)).padStart(2,'0');
    const secs = String(seconds%60).padStart(2,'0');
    insiderCountdown.textContent = `SAMSTAG · ${days}T ${hours}:${mins}:${secs}`;
  }
  updateInsiderCountdown();
  setInterval(updateInsiderCountdown,1000);
}

/* =========================================================
   TALBLICK FAN CHAT — 120 fictional messages, 70% critical
   ========================================================= */
const fanChat = document.getElementById('fanChat');
const fanChatToggle = document.getElementById('fanChatToggle');
const fanChatClose = document.getElementById('fanChatClose');
const fanChatMessages = document.getElementById('fanChatMessages');
const chatUnread = document.getElementById('chatUnread');

if (fanChat && fanChatMessages) {
  const chatUsers = [
    'AarMax','Lahnkicker92','Tobi_ProClubs','Michi1908','KatzenbergKid',
    'EinrichTom','NilsFan','Sanremo_Stand','RheinLahnDave','AarTal',
    'ProClubSven','Modric22','LiLegacy','LahnFan','TaunusTom',
    'TalblickOpa','FCFan2004','GoalHunter','KeeperChris','RedBlackFan'
  ];

  const meanTexts = [
    '0 Spiele und schon wird über Transfers geredet 😂',
    'Daniel für 300k? Wer zahlt das bitte?',
    'Ihr braucht erstmal ein Spiel, bevor ihr eine Dynastie seid.',
    'Der Sanremo Park ist größer als eure aktuelle Statistik.',
    'Diese Marktwerte sind ja komplett wild.',
    'Ilija für 1,2 Mio? Träumt weiter.',
    'Noch kein Spiel und schon 100 Insider-News 😂',
    'Wer hat euch eigentlich die Lizenz gegeben? Spaß 😄',
    'Ich warte immer noch auf euren ersten Sieg.',
    'Kader sieht gut aus, aber jetzt müsst ihr auch spielen.',
    'Der Transfermarkt macht mehr Spiele als ihr.',
    '0:0 ist aktuell eure stärkste Statistik.',
    'Sanremo Park ausverkauft bei 0 Spielen? 😂',
    'Ich glaube Daniel würde sogar als Keeper spielen.',
    'Diese Angebote werden ja schneller abgelehnt als sie kommen.',
    'Marktwert runter, Jungs. Der Hype ist vorbei. 😅',
    'FC Talblick FC 27: erstmal Menü-Meister.',
    'Ich will Ergebnisse sehen, keine Gerüchte.',
    'Katzenelnbogen wird euch schon zeigen, wo der Hammer hängt.',
    'Ganz ehrlich: Ich bin gespannt, ob ihr die 1. Partie gewinnt.',
    'Eure Transferzentrale ist größer als der Kader.',
    'Bitte einmal echte Ergebnisse statt Fake-Markt.',
    'Ilija ist teuer, aber liefert er auch?',
    'Tobias für 830k? Dafür muss er aber Tore schießen.',
    'Nils 490k? Der Markt ist verrückt.',
    'Kristijan 680k klingt nach einem riskanten Investment.',
    'Noch keine Niederlage! Aber auch kein Spiel. 😂',
    'Ihr seid entweder genial oder komplett verrückt.',
    'Ich komme wegen der Kommentare und bleibe wegen der News.',
    'Die roten Pfeile tun weh.',
    'Wer auch immer den Markt programmiert hat: gemein.',
    '0 Spiele, 100 Meldungen. Prioritäten stimmen. 😂',
    'Transferangebot abgelehnt. Natürlich. Immer.',
    'Ihr habt mehr Insider als Punkte.',
    'Wann kommt endlich ein echtes Match?',
    'Der Chat ist härter als jeder Gegner.'
  ];

  const fanTexts = [
    'Seit 2020 dabei – bin gespannt auf FC27! 🔥',
    'Team sieht stark aus. Viel Erfolg für die Saison!',
    'Sanremo Park sieht brutal aus.',
    'Ich feier das ganze Konzept.',
    'Ilija wird diese Saison liefern.',
    'Tobias als Stürmer könnte richtig gefährlich werden.',
    'Kristijan im ZDM ist wichtig für die Balance.',
    'Zdravko als Allrounder ist Gold wert.',
    'Freue mich auf das erste Match!',
    'Modric und Li gehören in die Hall of Fame. ❤️',
    'Schönes Vereinsdesign!',
    'Die roten Trikots sehen stark aus.',
    'Endlich wieder FC Talblick!',
    'Lasst euch Zeit und baut die Saison sauber auf.',
    'Ich tippe auf Ilija als Spieler der Saison.',
    'Sanremo Park, wir sehen uns!',
    'Viel Erfolg an den ganzen Kader!',
    'Die Transfer-News sind lustig gemacht.',
    'Bleibt zusammen, keine Transfers! 😂',
    'FC Talblick 2027 – auf gehts!',
    'Bin gespannt auf die ersten Statistiken.',
    'Coole Website!',
    'Hall of Fame mit den 2022-Spielern ist nice.',
    'Teamgeist vor Marktwert. ❤️',
    'Das wird eine gute Saison.'
  ];

  const allMessages = [];
  const target = 120;
  for (let i=0;i<target;i++) {
    const mean = i < 84; // exactly 70% critical
    const pool = mean ? meanTexts : fanTexts;
    const user = chatUsers[i % chatUsers.length];
    const text = pool[(i * 7 + Math.floor(i/3)) % pool.length];
    allMessages.push({user, text, type: mean ? 'mean' : 'fan'});
  }

  // Shuffle deterministically so the 70/30 mix doesn't look grouped.
  for (let i=allMessages.length-1;i>0;i--) {
    const j = (i * 37 + 11) % (i+1);
    [allMessages[i], allMessages[j]] = [allMessages[j], allMessages[i]];
  }

  fanChatMessages.innerHTML = allMessages.map(m => `
    <div class="chat-message ${m.type}">
      <div class="chat-user">${m.user}</div>
      <div class="chat-text">${m.text}</div>
    </div>
  `).join('');

  fanChatToggle?.addEventListener('click', () => {
    fanChat.classList.add('open');
    if (chatUnread) chatUnread.textContent = '0';
  });
  fanChatClose?.addEventListener('click', () => fanChat.classList.remove('open'));
}
