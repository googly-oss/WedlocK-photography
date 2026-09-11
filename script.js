const nav = document.querySelector('.site-nav');
const menu = document.querySelector('.menu');
const mobile = document.querySelector('.mobile-menu');

window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30), {passive:true});
menu?.addEventListener('click', () => {
  const open = mobile.classList.toggle('open');
  document.body.classList.toggle('menu-open', open);
  menu.setAttribute('aria-expanded', String(open));
  mobile.setAttribute('aria-hidden', String(!open));
});
mobile?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobile.classList.remove('open'); document.body.classList.remove('menu-open');
  menu.setAttribute('aria-expanded','false'); mobile.setAttribute('aria-hidden','true');
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const filters = document.querySelectorAll('.filter button');
const items = [...document.querySelectorAll('.gallery-item')];
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  items.forEach(item => item.classList.toggle('is-hidden', filter !== 'all' && item.dataset.category !== filter));
}));

const lb = document.querySelector('.lightbox');
const lbImg = lb.querySelector('img');
const lbCap = lb.querySelector('figcaption');
let current = 0;
function visibleItems(){ return items.filter(i => !i.classList.contains('is-hidden')); }
function openLb(index){
  const list = visibleItems(); current = Math.max(0, list.indexOf(items[index]));
  const item = list[current]; if(!item) return;
  lbImg.src = item.dataset.full; lbImg.alt = item.querySelector('img').alt; lbCap.textContent = item.querySelector('span').textContent;
  lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.classList.add('menu-open');
}
function step(dir){
  const list = visibleItems(); if(!list.length) return;
  current = (current + dir + list.length) % list.length;
  const item = list[current]; lbImg.src = item.dataset.full; lbImg.alt = item.querySelector('img').alt; lbCap.textContent = item.querySelector('span').textContent;
}
items.forEach((item, index) => item.addEventListener('click', () => openLb(index)));
function closeLb(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); document.body.classList.remove('menu-open'); setTimeout(()=>lbImg.src='',250); }
lb.querySelector('[aria-label="Close gallery"]').addEventListener('click', closeLb);
lb.querySelector('.lb-prev').addEventListener('click', ()=>step(-1));
lb.querySelector('.lb-next').addEventListener('click', ()=>step(1));
lb.addEventListener('click', e => { if(e.target === lb) closeLb(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLb(); if(e.key === 'ArrowLeft') step(-1); if(e.key === 'ArrowRight') step(1); });

const cursor = document.querySelector('.cursor');
if(cursor && matchMedia('(pointer:fine)').matches){
  window.addEventListener('pointermove', e => { cursor.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`; });
  document.querySelectorAll('a,button').forEach(el => el.addEventListener('mouseenter',()=>cursor.classList.add('active')));
  document.querySelectorAll('a,button').forEach(el => el.addEventListener('mouseleave',()=>cursor.classList.remove('active')));
}

document.querySelectorAll('img').forEach(img => img.addEventListener('error',()=>img.closest('.gallery-item,.story-a,.story-b,.story-c,.reel-card,.about-image,.film-bg')?.classList.add('media-error')));

// Motion performance: only play supplied films while they are meaningfully visible.
const motionVideos = [...document.querySelectorAll('.film-bg-video, .portfolio-video')];
if (motionVideos.length && 'IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
      video.play().catch(() => {});
    } else if (!video.controls) {
      video.pause();
    }
  }), {threshold:[0,.35,.7]});
  motionVideos.forEach(video => videoObserver.observe(video));
}


// Reliable footer back-to-top control
const backTop = document.querySelector('.back-top');
backTop?.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
