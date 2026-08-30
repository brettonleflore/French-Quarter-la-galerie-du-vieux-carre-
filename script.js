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