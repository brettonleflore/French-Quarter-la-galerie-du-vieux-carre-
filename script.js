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

document.getElementById('form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const note=document.getElementById('note');
  const a=document.getElementById('arrival')?.value;
  const d=document.getElementById('departure')?.value;
  if(!a||!d){ if(note) note.textContent='Please choose arrival and departure dates.'; return; }
  const nights=Math.round((new Date(d+'T12:00:00')-new Date(a+'T12:00:00'))/86400000);
  if(nights<30){ if(note) note.textContent=`Extended stays require at least 30 nights. Your selected stay is ${Math.max(nights,0)} nights.`; return; }
  if(note) note.textContent=`Thank you — your ${nights}-night stay qualifies. This inquiry form is ready to connect to your booking inbox or CRM.`;
});

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
