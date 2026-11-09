/* main.js - the router: shows the page that matches the address (#register, #directory...) and starts the app. */

/* ===== ROUTER & BOOT ===== */
const R={dashboard,register,directory,search,update,discharge,prescription,oop,arch,about};
const NAV=[['dashboard','Dashboard'],['register','Register'],['directory','Directory'],['search','Search by ID'],['update','Update'],['discharge','Discharge'],['prescription','Prescription'],['oop','OOP Lab'],['arch','Architecture &amp; DB'],['about','About']];
$('#nav').innerHTML=NAV.map(([k,l])=>`<a href="#${k}" data-k="${k}">${ico(k)}<span>${l}</span></a>`).join('');
function route(){const k=R[location.hash.slice(1)]?location.hash.slice(1):'dashboard';
 document.querySelectorAll('#nav a').forEach(a=>a.dataset.k==k?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));sync().finally(()=>{R[k]();window.scrollTo(0,0)})}
addEventListener('hashchange',route);
$('#gs').onkeydown=e=>{if(e.key!='Enter')return;const v=e.target.value.trim();if(/^\d+$/.test(v)){pend=+v;location.hash==='#search'?route():location.hash='#search'}else{st.q=v;st.pg=0;location.hash==='#directory'?route():location.hash='#directory'}};
$('#th').onclick=()=>{const d=document.documentElement,dark=d.dataset.theme?d.dataset.theme=='dark':matchMedia('(prefers-color-scheme: dark)').matches;d.dataset.theme=dark?'light':'dark'};
$('#sqlt').onclick=()=>{const o=$('#sql').classList.toggle('open');$('#sqlt').setAttribute('aria-expanded',o);$('#sqlt').textContent=(o?'▾':'▸')+' SQL Console · Parameterized query – SQL injection safe'};
drawSql();route();
