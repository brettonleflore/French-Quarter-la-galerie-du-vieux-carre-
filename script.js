const tabs=[...document.querySelectorAll(".room-tab")];
const panels=[...document.querySelectorAll(".gallery-panel")];
function activateRoom(room){
 tabs.forEach(t=>{const on=t.dataset.room===room;t.classList.toggle("active",on);t.setAttribute("aria-selected",on?"true":"false")});
 panels.forEach(p=>p.classList.toggle("active",p.dataset.panel===room));
}
tabs.forEach(t=>t.addEventListener("click",()=>activateRoom(t.dataset.room)));
panels.forEach(panel=>{
 const main=panel.querySelector(".main-photo"), thumbs=[...panel.querySelectorAll(".thumb")], current=panel.querySelector(".current");
 let index=0;
 function show(i){index=(i+thumbs.length)%thumbs.length;main.src=thumbs[index].querySelector("img").src;thumbs.forEach((x,j)=>x.classList.toggle("active",j===index));current.textContent=String(index+1).padStart(2,"0")}
 thumbs.forEach((t,i)=>t.addEventListener("click",()=>show(i)));
 panel.querySelector(".prev").addEventListener("click",()=>show(index-1));
 panel.querySelector(".next").addEventListener("click",()=>show(index+1));
});
document.getElementById("form").addEventListener("submit",e=>{e.preventDefault();document.getElementById("note").textContent="This presentation form is ready to connect to your live booking destination.";});
// Interactive painting walkthrough: still oil-painting opening -> slow cinematic passage -> balcony.
(()=>{
 const hero=document.querySelector('.painting-gateway');
 const video=hero?.querySelector('.hero-film');
 const enter=document.getElementById('enterPainting');
 const ui=document.getElementById('walkUi');
 const range=document.getElementById('walkProgress');
 const toggle=document.getElementById('walkToggle');
 const status=document.getElementById('walkStatus');
 const arrive=document.getElementById('arriveBalcony');
 if(!hero||!video||!enter||!range||!toggle||!arrive) return;
 let raf=0, scrubbing=false;
 video.playbackRate=.72;
 const paint=()=>{
   if(video.duration && Number.isFinite(video.duration)){
     const p=Math.max(0,Math.min(1,video.currentTime/video.duration));
     if(!scrubbing) range.value=Math.round(p*1000);
     hero.style.setProperty('--walk',(p*100).toFixed(2));
     hero.classList.toggle('near-arrival',p>.76);
     if(status){
       status.textContent=p<.32?'Passing through the courtyard…':p<.7?'Moving through the residence…':'Approaching the Galerie…';
     }
   }
   if(!video.paused) raf=requestAnimationFrame(paint);
 };
 const start=async()=>{
   hero.classList.add('is-entered');
   ui?.setAttribute('aria-hidden','false');
   video.loop=false;
   video.playbackRate=.72;
   try{await video.play(); toggle.textContent='Pause'; toggle.setAttribute('aria-label','Pause walkthrough'); cancelAnimationFrame(raf); raf=requestAnimationFrame(paint)}catch(e){toggle.textContent='Play'}
 };
 enter.addEventListener('click',start);
 toggle.addEventListener('click',async()=>{
   if(video.paused){try{await video.play();toggle.textContent='Pause';cancelAnimationFrame(raf);raf=requestAnimationFrame(paint)}catch(e){}}else{video.pause();toggle.textContent='Play';cancelAnimationFrame(raf)}
 });
 range.addEventListener('pointerdown',()=>scrubbing=true);
 range.addEventListener('input',()=>{if(video.duration){video.currentTime=(Number(range.value)/1000)*video.duration;paint()}});
 range.addEventListener('change',()=>{scrubbing=false});
 video.addEventListener('ended',()=>{hero.classList.add('near-arrival');toggle.textContent='Replay';if(status)status.textContent='You have arrived at the Galerie.'});
 toggle.addEventListener('click',()=>{if(video.ended){video.currentTime=0;start()}});
 arrive.addEventListener('click',()=>{
   activateRoom('balcony');
   const tab=document.querySelector('.room-tab[data-room="balcony"]');
   tab?.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});
   setTimeout(()=>document.getElementById('galleries')?.scrollIntoView({behavior:'smooth',block:'start'}),150);
 });
})();
