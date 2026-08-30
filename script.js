window.addEventListener("load",()=>setTimeout(()=>document.getElementById("prelude").classList.add("hide"),1350));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
const hero=document.querySelector(".hero-paint");
window.addEventListener("scroll",()=>{const y=Math.min(window.scrollY,window.innerHeight);if(hero)hero.style.opacity=String(Math.max(.08,.52-(y/window.innerHeight)*.44));},{passive:true});
document.getElementById("inquiryForm").addEventListener("submit",e=>{e.preventDefault();document.getElementById("formNote").textContent="The editorial experience is ready; connect this form to your booking platform or inquiry inbox before launch."});