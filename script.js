const links=[...document.querySelectorAll('nav a')];
const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}}),{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>observer.observe(s));

window.addEventListener('load',()=>setTimeout(()=>document.querySelector('.page-loader')?.classList.add('hide'),500));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealObserver.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal-section').forEach(s=>revealObserver.observe(s));

const progress=document.querySelector('.scroll-progress');
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight; progress.style.width=(max>0?(scrollY/max)*100:0)+'%';},{passive:true});

const dot=document.querySelector('.cursor-dot'), ring=document.querySelector('.cursor-ring');
window.addEventListener('pointermove',e=>{dot.style.transform=`translate(${e.clientX-3.5}px,${e.clientY-3.5}px)`;ring.style.transform=`translate(${e.clientX-17}px,${e.clientY-17}px)`;const card=e.target.closest('.project,.what-grid article,.learning-card');if(card){card.style.setProperty('--mx',`${e.offsetX}px`);card.style.setProperty('--my',`${e.offsetY}px`);ring.classList.add('hover')}else ring.classList.remove('hover')},{passive:true});


// Smooth red cursor: small glowing light + expanding ring.
(() => {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring || !window.matchMedia('(pointer:fine)').matches) return;
  let x = innerWidth/2, y = innerHeight/2, rx=x, ry=y;
  const move = (e) => { x=e.clientX; y=e.clientY; };
  window.addEventListener('pointermove', move, {passive:true});
  const render = () => {
    rx += (x-rx)*0.18; ry += (y-ry)*0.18;
    dot.style.transform=`translate3d(${x-4}px,${y-4}px,0)`;
    ring.style.transform=`translate3d(${rx-22}px,${ry-22}px,0)`;
    requestAnimationFrame(render);
  };
  render();
  document.querySelectorAll('a,button,.project,.what-grid article,.learning-card,.tiles div').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('hover'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));
  });
  window.addEventListener('pointerdown',()=>{ring.classList.add('click');setTimeout(()=>ring.classList.remove('click'),180)});
})();

// Subtle pointer spotlight on interactive cards.
document.querySelectorAll('.project,.what-grid article,.learning-card,.tiles div').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',`${e.clientX-r.left}px`);
    card.style.setProperty('--my',`${e.clientY-r.top}px`);
  },{passive:true});
});
