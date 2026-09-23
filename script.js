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
   TALBLICK FAN CHAT — dynamischer Live-Demo-Chat
   Es existiert ein großer Nachrichten-Pool, aber IMMER nur 2
   Nachrichten gleichzeitig. Neue Nachricht kommt zufällig alle 1–4 Sek.
   ========================================================= */
(function(){
  function initFanChat(){
    const fanChat = document.getElementById('fanChat');
    const fanChatToggle = document.getElementById('fanChatToggle');
    const fanChatClose = document.getElementById('fanChatClose');
    const fanChatMessages = document.getElementById('fanChatMessages');
    const chatUnread = document.getElementById('chatUnread');
    if (!fanChat || !fanChatMessages) return;

    // 120 Demo-Nachrichten als Pool. Sie werden NICHT alle angezeigt.
    const chatMessages = [
      ['AarMax','0 Spiele und schon wird über Transfers geredet 😂','mean'],
      ['NilsFan','Ich warte immer noch auf euer erstes Match! 🔥','fan'],
      ['Lahnkicker92','Daniel für 300k? Wer zahlt das bitte? 😂','mean'],
      ['Sanremo_Stand','Sanremo Park sieht brutal aus.','fan'],
      ['Tobi_ProClubs','Der Transfermarkt macht mehr Spiele als ihr. 😂','mean'],
      ['RedBlackFan','Team sieht stark aus. Viel Erfolg für FC27!','fan'],
      ['KatzenbergKid','Ilija für 1,2 Mio? Träumt weiter.','mean'],
      ['AarTal','Ich feier das ganze Konzept.','fan'],
      ['EinrichTom','0:0 ist aktuell eure stärkste Statistik 😂','mean'],
      ['FCFan2004','Freue mich auf das erste Match!','fan'],
      ['Modric22','Noch kein Spiel und schon Insider-News 😂','mean'],
      ['LahnFan','Viel Erfolg an den ganzen Kader!','fan'],
      ['GoalHunter','Diese Marktwerte sind ja komplett wild.','mean'],
      ['TalblickOpa','Die roten Trikots sehen stark aus.','fan'],
      ['ProClubSven','Bitte einmal echte Ergebnisse statt Fake-Markt.','mean'],
      ['KeeperChris','Coole Website!','fan'],
      ['TaunusTom','Tobias muss die 800k erstmal auf dem Platz beweisen.','mean'],
      ['RheinLahnDave','Ich bin gespannt auf die ersten Statistiken.','fan'],
      ['LahnFan','Ihr seid entweder genial oder komplett verrückt. 😂','mean'],
      ['Sanremo_Stand','Hall of Fame mit Modric und Li ist nice.','fan'],
      ['AarUnited','Wer hat Daniel überhaupt gescoutet? 😂','mean'],
      ['ChrisFan','Ich will endlich das erste FC27-Spiel sehen.','fan'],
      ['NassauTom','1,2 Mio für Ilija ist mutig.','mean'],
      ['TalblickGirl','Das Stadiondesign gefällt mir richtig gut.','fan'],
      ['LahnBoy','Noch kein Spiel, aber schon Millionenwerte 😂','mean'],
      ['RedStorm','Bin gespannt auf die Saison.','fan'],
      ['Dorsbach99','Der Marktwert von Daniel ist noch großzügig. 😂','mean'],
      ['ProClubLeo','Kommt bald der erste Spielbericht?','fan'],
      ['Katzenberg11','Tobias 800k? Erstmal Tore schießen.','mean'],
      ['SanremoFan','Heimtrikot sieht richtig stark aus.','fan'],
      ['AarMax','Ihr habt mehr Insider als Spiele. 😂','mean'],
      ['FCBasti','Viel Erfolg Jungs!','fan'],
      ['Lahnkicker','Kristijan 700k ist auch interessant.','mean'],
      ['TalblickSupport','Bin seit Tag 1 dabei.','fan'],
      ['TaunusChris','0:0 als Bilanz ist schon legendär.','mean'],
      ['RedBlack24','Freue mich auf die ersten Ergebnisse.','fan'],
      ['Einrich04','Werden Transfers eigentlich wirklich abgelehnt? 😂','mean'],
      ['LahnSupport','Starkes Projekt, weiter so!','fan'],
      ['AarScout','Leon für 1,05 Mio? Ganz schön teuer.','mean'],
      ['SanremoKid','Das Stadion könnte voll werden.','fan'],
      ['ProClubMax','Bitte nicht wieder nur Trainingslager 😂','mean'],
      ['TalblickFan','Ich bin gespannt auf eure Formation.','fan'],
      ['KatzenbergKid','Daniel hat den Marktwert seines Lebens.','mean'],
      ['FCStorm','Gute Saison euch!','fan'],
      ['LahnTom','Der Transfermarkt ist jetzt schon spannender als die Liga. 😂','mean'],
      ['RedBlackFan','Das Logo sieht brutal aus.','fan'],
      ['AarLukas','Wann gibt es endlich ein 1:0? 😂','mean'],
      ['TalblickOpa','Ich schaue jedes Update.','fan'],
      ['NassauFC','Zdravko 900k muss erstmal bestätigt werden.','mean'],
      ['ChrisFan','Community sieht schon gut aus.','fan'],
      ['ProClubSven','Vielleicht erstmal spielen bevor ihr Marktwerte verteilt. 😂','mean'],
      ['LahnFan','Ich gönne euch eine starke Saison.','fan'],
      ['AarMax','Wer hat diese Preise erfunden? 😂','mean'],
      ['Sanremo_Stand','VIP-Ticket für 160? Was gibt es da alles?','fan'],
      ['EinrichTom','Die Spielerwerte sind komplett ausgedacht 😂','mean'],
      ['TalblickGirl','Ich mag den schwarzen Look der Seite.','fan'],
      ['Lahnkicker92','Nils für 500k klingt nach Schnäppchen.','mean'],
      ['FCFan2004','Bin auf die ersten Statistiken gespannt.','fan'],
      ['TaunusTom','Ilija muss erstmal liefern für 1,2 Mio.','mean'],
      ['RedStorm','Das wird eine interessante Saison.','fan'],
      ['AarTal','Ihr habt echt einen eigenen Transfermarkt gebaut 😂','mean'],
      ['ProClubLeo','Ich hoffe auf viele Spiele dieses Jahr.','fan'],
      ['Katzenberg11','Daniel würde ich für 300k sofort verkaufen. 😂','mean'],
      ['SanremoFan','Das Sanremo Park sieht cool aus.','fan'],
      ['LahnBoy','Warum hat der Transfermarkt schon Bewegung? 😂','mean'],
      ['TalblickSupport','Coole Idee mit dem Live-Chat.','fan'],
      ['AarUnited','Tobias 800k ist sportlich bewertet.','mean'],
      ['FCBasti','Viel Erfolg beim FC27 Neustart!','fan'],
      ['RheinLahnDave','Kristijan könnte überraschen.','fan'],
      ['ProClubMax','Noch keine Spiele und trotzdem Markt-News 😂','mean'],
      ['TalblickFan','Ich bleibe hier für die Updates.','fan'],
      ['NassauTom','Leon muss die Millionen erstmal rechtfertigen.','mean'],
      ['RedBlack24','Das neue FC27 Kapitel kann kommen.','fan'],
      ['Lahnkicker','Wer ist eigentlich euer bester Spieler?','fan'],
      ['AarScout','Ich sage Ilija ist überbewertet. 😂','mean'],
      ['SanremoKid','Stadion + Trikot = starkes Gesamtpaket.','fan'],
      ['Dorsbach99','0 Spiele, 0 Niederlagen. Perfekte Saison. 😂','mean'],
      ['FCStorm','Genau solche Seiten braucht Pro Clubs.','fan'],
      ['TaunusChris','Wann kommt endlich die erste Niederlage? 😂','mean'],
      ['LahnSupport','Viel Erfolg an alle Spieler!','fan'],
      ['Einrich04','Der Markt braucht einen Daniel-Absturz. 😂','mean'],
      ['TalblickOpa','Schönes Vereinsprojekt.','fan'],
      ['AarMax','Modric und Li in der Hall of Fame? Okay 😂','mean'],
      ['ChrisFan','Die Historie gefällt mir.','fan'],
      ['KatzenbergKid','700k für Kristijan? Mutig.','mean'],
      ['RedBlackFan','Ich will das erste Match sehen!','fan'],
      ['LahnFan','Das wird lustig mit diesem Kader. 😂','mean'],
      ['ProClubSven','Bitte Matchberichte nicht vergessen.','fan'],
      ['NassauFC','Zdravko könnte einer der wichtigsten Spieler sein.','fan'],
      ['AarLukas','Daniel auf dem Markt? Ich biete 50k. 😂','mean'],
      ['Sanremo_Stand','Die Vereinsseite wirkt richtig professionell.','fan'],
      ['TalblickGirl','Das Auswärtstrikot gefällt mir.','fan'],
      ['LahnBoy','500k für Nils? Wer hat das berechnet? 😂','mean'],
      ['FCFan2004','Ich freue mich auf die Saison.','fan'],
      ['TaunusTom','Ich glaube Tobias wird viele Tore machen.','fan'],
      ['AarTal','Der Marktwert von Daniel sinkt bestimmt noch 😂','mean'],
      ['RedStorm','Hoffentlich gibt es bald Ergebnisse.','fan'],
      ['EinrichTom','Ihr braucht erstmal einen Sieg bevor ihr Millionen verteilt. 😂','mean'],
      ['LahnSupport','Ich drücke euch die Daumen.','fan'],
      ['Katzenberg11','Der Chat ist besser als manche Bundesliga-Liveticker. 😂','mean'],
      ['TalblickFan','Weiter so!','fan'],
      ['ProClubLeo','Ilija wird die Saison rocken.','fan'],
      ['AarUnited','Oder komplett floppen 😂','mean'],
      ['SanremoFan','Ich mag die Vereinsfarben.','fan'],
      ['NassauTom','Chris für 600k? Interessant.','mean'],
      ['FCStorm','Bin gespannt wer am Ende die meisten Tore hat.','fan'],
      ['Lahnkicker92','Ich tippe Tobias.','fan'],
      ['RedBlack24','Ich tippe auf Ilija.','fan'],
      ['Dorsbach99','Ich tippe Daniel auf der Bank. 😂','mean'],
      ['TalblickOpa','Hauptsache alle haben Spaß.','fan'],
      ['AarMax','Dieser Chat eskaliert noch 😂','mean'],
      ['ChrisFan','Ich komme später wieder.','fan'],
      ['KatzenbergKid','Die Konkurrenz wird euch beobachten.','mean'],
      ['LahnFan','Gute Stimmung hier!','fan'],
      ['ProClubMax','Ich will endlich Transfergerüchte mit echten Namen 😂','mean'],
      ['SanremoKid','Das kommt bestimmt noch.','fan'],
      ['TaunusChris','FC Talblick gegen Lahnkicker wäre interessant.','fan'],
      ['AarScout','Ihr seid noch ungeschlagen! 😂','mean'],
      ['RedBlackFan','Das ist technisch gesehen korrekt. 😂','fan'],
      ['Einrich04','Noch kein Spiel heißt noch kein Problem.','mean'],
      ['TalblickSupport','FC27 Neustart, jetzt geht es los.','fan'],
      ['LahnBoy','Ich beobachte den Marktwert von Daniel. 😂','mean'],
      ['FCFan2004','Ich beobachte Tobias.','fan'],
      ['NassauFC','Ich beobachte Zdravko.','fan'],
      ['AarTal','Ich beobachte alle.','fan'],
      ['Sanremo_Stand','Der Chat lebt.','fan']
    ];

    let nextIndex = 0;
    let visible = [];
    let timer = null;

    function render(){
      fanChatMessages.innerHTML = visible.map(m => `
        <div class="chat-message ${m.type}">
          <div class="chat-user">${m.user}</div>
          <div class="chat-text">${m.message}</div>
        </div>
      `).join('');
      fanChatMessages.scrollTop = fanChatMessages.scrollHeight;
      if (chatUnread && !fanChat.classList.contains('open')) chatUnread.textContent = String(Math.min(9, visible.length));
    }

    function addMessage(){
      const m = chatMessages[nextIndex % chatMessages.length];
      nextIndex++;
      visible.push({user:m[0], message:m[1], type:m[2]});
      // HARTE REGEL: niemals mehr als 2 Nachrichten gleichzeitig.
      if (visible.length > 2) visible.shift();
      render();
      scheduleNext();
    }

    function scheduleNext(){
      if (timer) clearTimeout(timer);
      // zufälliger Abstand: 1–4 Sekunden
      const delay = 1000 + Math.floor(Math.random() * 3001);
      timer = window.setTimeout(addMessage, delay);
    }

    // Beim Öffnen erscheinen nur 2 Nachrichten. Danach 1 neue Nachricht alle 1–4 Sek.
    visible = [
      {user:chatMessages[0][0], message:chatMessages[0][1], type:chatMessages[0][2]},
      {user:chatMessages[1][0], message:chatMessages[1][1], type:chatMessages[1][2]}
    ];
    nextIndex = 2;
    render();
    scheduleNext();

    fanChatToggle?.addEventListener('click',()=>{
      fanChat.classList.add('open');
      if(chatUnread) chatUnread.textContent='0';
    });
    fanChatClose?.addEventListener('click',()=>fanChat.classList.remove('open'));
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initFanChat);
  else initFanChat();
})();


// AKTUELLE NEWS POPUP
(function(){
  const popup=document.getElementById('newsPopup');
  if(!popup) return;
  const close=()=>popup.classList.remove('show');
  const btn=document.getElementById('newsPopupClose');
  btn?.addEventListener('click',close);
  popup.querySelector('[data-news-close]')?.addEventListener('click',close);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  window.setTimeout(()=>popup.classList.add('show'), 4200);
})();
