(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Mobile navigation
  const menuButton = $('.menu-toggle');
  const nav = $('#site-nav');
  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.classList.remove('open');
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  };
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      menuButton.classList.toggle('open', open);
      nav.classList.toggle('open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });
    $$('#site-nav a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', e => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
    });
    window.addEventListener('resize', () => { if (innerWidth > 760) closeMenu(); }, {passive:true});
  }

  // Loader: never trap the page behind it.
  const loader = $('.page-loader');
  const hideLoader = () => loader?.classList.add('hide');
  window.addEventListener('load', () => setTimeout(hideLoader, 450), {once:true});
  setTimeout(hideLoader, 1800);

  // Scroll reveal
  const reveal = $$('.reveal-section');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold: .08, rootMargin: '0px 0px -40px 0px'});
    reveal.forEach(section => revealObserver.observe(section));
  } else reveal.forEach(section => section.classList.add('is-visible'));

  // Active navigation
  const navLinks = $$('#site-nav a');
  const sections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, {rootMargin:'-35% 0px -55% 0px', threshold:0});
    sections.forEach(section => navObserver.observe(section));
  }

  // Scroll progress
  const progress = $('.scroll-progress');
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  };
  addEventListener('scroll', updateProgress, {passive:true});
  addEventListener('resize', updateProgress, {passive:true});
  updateProgress();

  // Cursor only on precise pointer devices
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  const finePointer = matchMedia('(pointer:fine)').matches;
  if (dot && ring && finePointer) {
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; }, {passive:true});
    const render = () => {
      rx += (x-rx) * .18;
      ry += (y-ry) * .18;
      dot.style.transform = `translate3d(${x-4}px,${y-4}px,0)`;
      ring.style.transform = `translate3d(${rx-22}px,${ry-22}px,0)`;
      requestAnimationFrame(render);
    };
    render();
    $$('a,button,.project,.what-grid article,.learning-card,.tiles div').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
    addEventListener('pointerdown', () => {
      ring.classList.add('click');
      setTimeout(() => ring.classList.remove('click'), 180);
    }, {passive:true});
  }

  // Card spotlight
  $$('.project,.what-grid article,.learning-card,.tiles div').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX-r.left}px`);
      card.style.setProperty('--my', `${e.clientY-r.top}px`);
    }, {passive:true});
  });
})();
