const tabs=[...document.querySelectorAll('.room-tab')];
const panels=[...document.querySelectorAll('.gallery-panel')];
function activateRoom(room){
  tabs.forEach(t=>{const on=t.dataset.room===room;t.classList.toggle('active',on);t.setAttribute('aria-selected',on?'true':'false')});
  panels.forEach(p=>p.classList.toggle('active',p.dataset.panel===room));
}
tabs.forEach(t=>t.addEventListener('click',()=>activateRoom(t.dataset.room)));
panels.forEach(panel=>{
  const main=panel.querySelector('.main-photo');
  const thumbs=[...panel.querySelectorAll('.thumb')];
  const current=panel.querySelector('.current');
  let index=0;
  if(!main||!thumbs.length) return;
  const show=i=>{
    index=(i+thumbs.length)%thumbs.length;
    main.src=thumbs[index].querySelector('img').src;
    thumbs.forEach((x,j)=>x.classList.toggle('active',j===index));
    if(current) current.textContent=String(index+1).padStart(2,'0');
  };
  thumbs.forEach((t,i)=>t.addEventListener('click',()=>show(i)));
  panel.querySelector('.prev')?.addEventListener('click',()=>show(index-1));
  panel.querySelector('.next')?.addEventListener('click',()=>show(index+1));
});

document.getElementById('form')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget, note=document.getElementById('note'), button=form.querySelector('button[type=submit]');
  const a=document.getElementById('arrival')?.value, d=document.getElementById('departure')?.value;
  if(!a||!d){ if(note) note.textContent='Please choose arrival and departure dates.'; return; }
  const nights=Math.round((new Date(d+'T12:00:00')-new Date(a+'T12:00:00'))/86400000);
  if(nights<30){ if(note) note.textContent=`Extended stays require at least 30 nights. Your selected stay is ${Math.max(nights,0)} nights.`; return; }
  const payload={name:document.getElementById('name')?.value,email:document.getElementById('email')?.value,phone:document.getElementById('phone')?.value,arrival:a,departure:d,guests:Number((document.getElementById('guests')?.value||'1').match(/\d+/)?.[0]||1),message:document.getElementById('message')?.value,source_page:location.pathname};
  const old=button.textContent; button.disabled=true; button.textContent='Sending inquiry…';
  try{
    const r=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(data.error||'Unable to send inquiry.');
    form.innerHTML=`<div class=\"form-success\"><strong>Thank you.</strong><br>Your ${data.nights}-night inquiry has been sent to the owner. We’ll use the contact information you provided to follow up privately.</div>`;
  }catch(err){ if(note) note.textContent=err.message; button.disabled=false; button.textContent=old; }
});

// Anonymous first-party traffic measurement for the private owner dashboard.
(()=>{
  if(location.pathname.startsWith('/dashboard')) return;
  try{
    let sid=sessionStorage.getItem('lgvc_session');
    if(!sid){sid=(crypto.randomUUID?.()||Math.random().toString(36).slice(2)+Date.now().toString(36));sessionStorage.setItem('lgvc_session',sid)}
    const payload=JSON.stringify({page:location.pathname||'/',session_id:sid,referrer:document.referrer||''});
    fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:payload,keepalive:true}).catch(()=>{});
  }catch{}
})();

// Opening: the approved painting holds the first frame; once the film is ready,
// it dissolves underneath and the live hotel typography replaces the baked-in copy.
(()=>{
  const hero=document.querySelector('.opening-hero');
  const film=hero?.querySelector('.opening-film');
  if(!hero||!film) return;
  const reveal=()=>{hero.classList.add('film-ready');document.documentElement.classList.add('film-ready');};
  if(film.readyState>=3) setTimeout(reveal,700);
  else film.addEventListener('canplay',()=>setTimeout(reveal,700),{once:true});
  film.play().catch(()=>{});
})();

// Play hero films only while they are visible. The opening keeps its final film frame
// as the background state; the second hero loops seamlessly.
(()=>{
  const films=[...document.querySelectorAll('.cinema-film')];
  if(!('IntersectionObserver' in window)){films.forEach(v=>v.play().catch(()=>{}));return;}
  const io=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting,intersectionRatio})=>{
    if(isIntersecting&&intersectionRatio>.12) target.play().catch(()=>{}); else target.pause();
  }),{threshold:[0,.12,.5]});
  films.forEach(v=>io.observe(v));
})();

// Deep-link directly to a room on the dedicated Residence page.
(()=>{ const room=location.hash.replace('#',''); if(room && document.querySelector(`.room-tab[data-room="${room}"]`)){ activateRoom(room); setTimeout(()=>document.getElementById('galleries')?.scrollIntoView({behavior:'smooth'}),80); } })();

// Quiet editorial reveals and a restrained balcony parallax.
(()=>{
  const reveals=[...document.querySelectorAll('.home-page .reveal')];
  if(!('IntersectionObserver' in window)){reveals.forEach(el=>el.classList.add('in-view'));return;}
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -4%'});
  reveals.forEach(el=>io.observe(el));
})();

(()=>{
  const art=document.querySelector('.home-page .parallax-art');
  if(!art || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking=false;
  const update=()=>{
    const r=art.parentElement.getBoundingClientRect();
    const progress=(innerHeight-r.top)/(innerHeight+r.height);
    const y=(Math.max(0,Math.min(1,progress))-.5)*26;
    art.style.transform=`translate3d(0,${y}px,0) scale(1.035)`;
    ticking=false;
  };
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});
  update();
})();

// Extended-stay inquiry drawer.
(()=>{
  const drawer=document.getElementById('stay-drawer');
  if(!drawer) return;
  const open=()=>{drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>drawer.querySelector('input')?.focus(),350)};
  const close=()=>{drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');document.body.style.overflow=''};
  document.querySelectorAll('.stay-trigger').forEach(b=>b.addEventListener('click',open));
  drawer.querySelectorAll('.stay-close').forEach(b=>b.addEventListener('click',close));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer.classList.contains('is-open')) close();});
})();
