/* ── Slider ── */
    let slideIdx = 0;
    const totalSlides = 3;
    const slider = document.getElementById('mainSlider');
    const progressBar = document.getElementById('heroProgressBar');

    function resetProgress() {
      progressBar.style.animation = 'none';
      progressBar.offsetHeight; // reflow
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
      showToast('Message sent! We\'ll get back to you soon.');
      e.target.reset();
    }

    /* ── Newsletter ── */
    function handleNewsletter(e) {
      e.preventDefault();
      showToast('You\'re subscribed! Welcome to Yazone.');
      e.target.reset();
    }
    
    function isAdBlockerActive() {
    const decoy = document.getElementById('adSenseCheck');
    if (!decoy) return false;
    const s = window.getComputedStyle(decoy);
    return (
      s.display === 'none' ||
      s.visibility === 'hidden' ||
      decoy.offsetHeight === 0 ||
      decoy.offsetParent === null
    );
  }

  function recheckAdBlock() {
    if (isAdBlockerActive()) {
      const card = document.querySelector('.adblock-card');
      card.style.animation = 'none';
      card.offsetHeight;
      card.style.animation = 'shakeCard 0.4s ease';
    } else {
      document.getElementById('adblockOverlay').classList.remove('show');
      document.body.style.overflow = '';
      location.reload();
    }
  }

  // Check on every download click
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (isAdBlockerActive()) {
        e.preventDefault();
        document.getElementById('adblockOverlay').classList.add('show');
        document.body.style.overflow = 'hidden';
      }
      // No blocker = link works normally, no interruption
    });
  });