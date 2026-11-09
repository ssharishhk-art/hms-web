/* utils.js - small helper functions used by every page:
   $ finds an element, esc makes text safe, toast shows a message, V draws a page. */

/* ===== UTILITIES ===== */
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const IC={prescription:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6',dashboard:'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',register:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 8v6M22 11h-6',directory:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',search:'M21 21l-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14',update:'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',discharge:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',oop:'M12 2l9 5v10l-9 5-9-5V7zM12 22V12M3 7l9 5 9-5',arch:'M12 2l10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5',about:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8'};
const ico=n=>`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[n]}"/></svg>`;
const ini=n=>n.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
const fmt=d=>new Date(d).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
const toast=(m,bad)=>{const t=document.createElement('div');t.className='toast'+(bad?' bad':'');t.textContent=m;$('#toasts').append(t);setTimeout(()=>t.remove(),3400)};
const V=h=>{$('#view').innerHTML=h};
const head=(t,s)=>`<div class="ph"><h1>${t}</h1><p>${s}</p></div>`;

