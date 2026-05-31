/* ── Slider ── */
let slideIdx = 0;
const totalSlides = 3;
const slider = document.getElementById('mainSlider');
const progressBar = document.getElementById('heroProgressBar');

function resetProgress() {
  progressBar.style.animation = 'none';
  progressBar.offsetHeight;
  progressBar.style.animation = 'progressBar 4.5s linear infinite';
}
setInterval(() => {
  slideIdx = (slideIdx + 1) % totalSlides;
  slider.style.transform = `translateX(-${slideIdx * 100}%)`;
  resetProgress();
}, 4500);

/* ── Search ── */
document.getElementById('gameSearch').oninput = (e) => {
  const val = e.target.value.toLowerCase();
  document.querySelectorAll('.game-card').forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(val) ? 'flex' : 'none';
  });
};

/* ── Category Filter ── */
document.querySelectorAll('.filter-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.game-card').forEach(card => {
      const cat = card.dataset.category || '';
      card.style.display = (filter === 'all' || cat.includes(filter)) ? 'flex' : 'none';
    });
  });
});

/* ── Grid / List Toggle ── */
const grid = document.getElementById('grid');
document.getElementById('viewGridBtn').addEventListener('click', () => {
  grid.classList.remove('view-list');
  document.getElementById('viewGridBtn').classList.add('active');
  document.getElementById('viewListBtn').classList.remove('active');
});
document.getElementById('viewListBtn').addEventListener('click', () => {
  grid.classList.add('view-list');
  document.getElementById('viewListBtn').classList.add('active');
  document.getElementById('viewGridBtn').classList.remove('active');
});

/* ── Hamburger ── */
document.getElementById('hamburgerBtn').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.toggle('open');
});

/* ── Toast helper ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Contact form ── */
function handleContact(e) {
  e.preventDefault();
  showToast("Message sent! We'll get back to you soon.");
  e.target.reset();
}

/* ── Newsletter ── */
function handleNewsletter(e) {
  e.preventDefault();
  showToast("You're subscribed! Welcome to ModXpro.");
  e.target.reset();
}

/* ══════════════════════════════════════════════
   AD BLOCKER DETECTION — single clean system
   ══════════════════════════════════════════════ */
let adBlockConfirmed = false;
let adBlockChecked   = false; // have we run the test yet?

function showAdBlockModal() {
  const overlay = document.getElementById('adblockOverlay');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function recheckAdBlock() {
  // Reset so we run the full test again
  adBlockConfirmed = false;
  adBlockChecked   = false;

  detectAdBlock().then((blocked) => {
    if (!blocked) {
      document.getElementById('adblockOverlay').classList.remove('show');
      document.body.style.overflow = '';
      location.reload();
    } else {
      // Shake the card to signal it's still blocked
      const card = document.querySelector('.adblock-card');
      card.style.animation = 'none';
      void card.offsetWidth; // force reflow
      card.style.animation = 'shakeCard 0.4s ease';
    }
  });
}

async function detectAdBlock() {
  // Return cached result if we already know
  if (adBlockChecked) return adBlockConfirmed;
  adBlockChecked = true;

  /* ── Test 1: Try loading a real Google Ads script ── */
  const scriptBlocked = await new Promise((resolve) => {
    // Remove any previously injected test script
    const old = document.getElementById('__adtest__');
    if (old) old.remove();

    const script = document.createElement('script');
    script.id  = '__adtest__';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000';
    script.onload  = () => resolve(false); // script loaded → no blocker
    script.onerror = () => resolve(true);  // script blocked → ad blocker
    document.head.appendChild(script);
    // If neither fires within 2 s, assume blocked
    setTimeout(() => resolve(true), 2000);
  });

  if (scriptBlocked) {
    adBlockConfirmed = true;
    return true;
  }

  /* ── Test 2: Bait div with classic ad-blocker class names ── */
  const bait = document.createElement('div');
  bait.className   = 'ad-banner adsbox doubleclick ads adsbygoogle';
  bait.style.cssText =
    'width:1px;height:1px;position:absolute;top:-9999px;left:-9999px;pointer-events:none;';
  document.body.appendChild(bait);

  await new Promise(r => setTimeout(r, 150)); // give blocker time to act

  const cs = window.getComputedStyle(bait);
  const baitBlocked =
    bait.offsetHeight  === 0  ||
    bait.offsetWidth   === 0  ||
    cs.display         === 'none' ||
    cs.visibility      === 'hidden' ||
    cs.opacity         === '0';

  document.body.removeChild(bait);

  if (baitBlocked) {
    adBlockConfirmed = true;
    return true;
  }

  return false;
}

/* ── Silently pre-warm the detection on page load ── */
window.addEventListener('load', () => {
  detectAdBlock(); // runs in background, no popup — just caches the result
});

/* ── Intercept ALL meaningful clicks in capture phase ── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', async (e) => {
    // Only care about game cards, links, download buttons, filter chips
    const target = e.target.closest('a, .game-card, .dl-btn, .filter-chip');
    if (!target) return;

    // Never block the modal's own buttons
    if (
      target.classList.contains('adblock-refresh-btn') ||
      target.closest('#adblockOverlay')
    ) return;

    const blocked = await detectAdBlock();
    if (blocked) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showAdBlockModal();
    }
  }, true); // true = capture phase — fires BEFORE the browser follows the link
});
