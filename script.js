
(function(){
  const v=document.querySelector('.hero-video');
  if(!v)return;
  v.muted=true;
  v.setAttribute('muted','');
  const tryPlay=()=>{ const p=v.play(); if(p&&p.catch) p.catch(()=>{}); };
  if(v.readyState>=2) tryPlay();
  else v.addEventListener('loadeddata',tryPlay,{once:true});
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) tryPlay(); });
})();
const RATE=1.25,PROMO_RATE=1.30,PROMO_CODE='GOLDX130',fmt=n=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:2}).format(n);let promoApplied=false;function activeRate(){return promoApplied?PROMO_RATE:RATE}function calc(apply=false){if(apply){const code=(promo.value||'').trim().toUpperCase();if(code===PROMO_CODE){promoApplied=true;promoStatus.textContent='Промокод применён — курс 1,30 ₽ за Gold';promoStatus.classList.add('active')}else{promoApplied=false;promoStatus.textContent=code?'Неверный промокод':'Промокод GOLDX130 даёт курс 1,30 ₽ за Gold';promoStatus.classList.remove('active')}}let g=Math.max(0,Number(gold.value)||0),r=activeRate();rub.value=fmt(g*r);document.querySelector('.rate strong').innerHTML=r===PROMO_RATE?'1 <img alt="GOLD" class="gold-icon" src="assets/gold.png"/> = 1,30 ₽':'1 <img alt="GOLD" class="gold-icon" src="assets/gold.png"/> = 1,25 ₽'}function sync(){let g=Math.max(0,Number(mg.value)||0);mr.value=fmt(g*activeRate())+' ₽'}function syncPromo(){promo.value=mpromo.value;sync();calc()}function openModal(){mg.value=gold.value||1000;mpromo.value=promo.value||'';sync();modal.classList.add('open')}function closeModal(){modal.classList.remove('open')}function send(){const contactValue=(contact.value||'').trim();const text=encodeURIComponent(`Здравствуйте! Хочу создать заявку на обмен Gold. Количество: ${mg.value||0} Gold. Сумма по расчёту: ${mr.value||'—'}. Мой Telegram: ${contactValue||'не указан'}`);window.open(`https://t.me/StandGoldx_official?text=${text}`,'_blank','noopener,noreferrer');closeModal()}function show(t){toast.textContent=t;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)}
const reviews=[...document.querySelectorAll('.reviews-track .review')];
calc();

/* Automatic reviews carousel: no manual scrolling, dragging or pagination. */
(function(){
  const viewport=document.querySelector('.reviews-viewport');
  const track=document.querySelector('.reviews-track');
  if(!viewport||!track||reviews.length<2)return;
  let index=0, step=0, timer=null, busy=false;
  const visible=()=>innerWidth<=540?1:(innerWidth<=850?2:3);
  const setup=()=>{
    track.querySelectorAll('.review-clone').forEach(el=>el.remove());
    const count=Math.min(visible(),reviews.length);
    reviews.slice(0,count).forEach(r=>{const c=r.cloneNode(true);c.classList.add('review-clone');track.appendChild(c)});
    const first=track.querySelector('.review');
    if(!first)return;
    const gap=parseFloat(getComputedStyle(track).gap)||0;
    step=first.getBoundingClientRect().width+gap;
    index=0;
    track.style.transition='none';
    track.style.transform='translate3d(0,0,0)';
  };
  const next=()=>{
    if(busy)return;
    busy=true; index++;
    track.style.transition='transform .75s cubic-bezier(.22,.61,.36,1)';
    track.style.transform=`translate3d(${-index*step}px,0,0)`;
    const onEnd=()=>{
      if(index>=reviews.length){
        index=0;
        track.style.transition='none';
        track.style.transform='translate3d(0,0,0)';
      }
      busy=false;
      track.removeEventListener('transitionend',onEnd);
    };
    track.addEventListener('transitionend',onEnd,{once:true});
  };
  const start=()=>{clearInterval(timer);timer=setInterval(next,3200)};
  setup();
  start();
  addEventListener('resize',()=>{setup();start()});
  viewport.addEventListener('wheel',e=>e.preventDefault(),{passive:false});
  viewport.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});
  viewport.addEventListener('pointerdown',e=>e.preventDefault());
})();

/* STANDGOLDX — GAMING PARALLAX ENGINE */
(function(){
  const hero=document.querySelector('.hero'), content=document.querySelector('.hero-content'), trust=document.querySelector('.trust');
  if(!hero)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  let target=0,current=0,running=false;
  function targetY(){
    if(reduce.matches)return 0;
    const r=hero.getBoundingClientRect(), vh=innerHeight||800;
    if(r.bottom<0||r.top>vh)return 0;
    const progress=((vh*.5)-(r.top+r.height*.5))/vh;
    return Math.max(-75,Math.min(75,progress*85));
  }
  function frame(){
    current+=(target-current)*.075;
    hero.style.setProperty('--parallax-y',current.toFixed(2)+'px');
    if(content)content.style.setProperty('--content-y',(current*.16).toFixed(2)+'px');
    if(trust)trust.style.transform=`translate3d(0,${(current*-.08).toFixed(2)}px,0)`;
    if(Math.abs(target-current)>.05)requestAnimationFrame(frame);else running=false;
  }
  function scroll(){target=targetY();if(!running){running=true;requestAnimationFrame(frame)}}
  addEventListener('scroll',scroll,{passive:true});
  addEventListener('resize',scroll,{passive:true});
  reduce.addEventListener?.('change',scroll);
  scroll();

  // Subtle cursor-driven lighting for a gaming feel.
  hero.addEventListener('pointermove',e=>{
    if(reduce.matches)return;
    const r=hero.getBoundingClientRect();
    hero.style.setProperty('--glow-x',(((e.clientX-r.left)/r.width)*100).toFixed(1)+'%');
    hero.style.setProperty('--glow-y',(((e.clientY-r.top)/r.height)*100).toFixed(1)+'%');
  });
  hero.addEventListener('pointerleave',()=>{
    hero.style.setProperty('--glow-x','50%');
    hero.style.setProperty('--glow-y','50%');
  });
})();

// Smooth reveal without fighting hover transforms.
(function(){
  const items=document.querySelectorAll('.stat,.step,.about,.review,.faq details,.trust>div');
  if(!items.length||!('IntersectionObserver' in window))return;
  items.forEach((el,i)=>{
    el.style.opacity='0';
    el.style.transition='opacity .55s ease, border-color .25s ease, box-shadow .25s ease';
    el.style.transitionDelay=Math.min(i*35,180)+'ms';
  });
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){e.target.style.opacity='1';io.unobserve(e.target)}
  }),{threshold:.12,rootMargin:'0px 0px -30px'});
  items.forEach(el=>io.observe(el));
})();


/* STANDGOLDX — MOBILE MENU + PARTICLES */
(function(){
  const menu=document.getElementById('mobileMenu'), nav=document.getElementById('siteNav');
  if(!menu||!nav)return;
  menu.addEventListener('click',()=>{
    const open=nav.classList.toggle('mobile-open');
    menu.classList.toggle('open',open); menu.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('mobile-open');menu.classList.remove('open');menu.setAttribute('aria-expanded','false');
  }));
  addEventListener('resize',()=>{if(innerWidth>850){nav.classList.remove('mobile-open');menu.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
})();
(function(){
  const hero=document.querySelector('.hero');
  if(!hero)return;
  const layer=document.createElement('div');layer.className='hero-particles';hero.prepend(layer);
  const count=innerWidth<540?14:28;
  for(let i=0;i<count;i++){
    const p=document.createElement('span');p.className='hero-particle';
    p.style.left=(Math.random()*100)+'%';p.style.top=(15+Math.random()*80)+'%';
    p.style.setProperty('--dx',((Math.random()-.5)*120)+'px');
    p.style.animationDuration=(3.5+Math.random()*5)+'s';p.style.animationDelay=(-Math.random()*6)+'s';
    layer.appendChild(p);
  }
})();
