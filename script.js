const links=[...document.querySelectorAll('nav a')];
const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}}),{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>observer.observe(s));
