/* pages.js - one function per page: dashboard, register, directory, search, update, discharge, oop, arch, about.
   Each function draws its page and calls DAO when a button is clicked. */

/* ===== SHARED UI PIECES ===== */
const fld=(n,l,t,v)=>`<div><label for="${n}">${l}</label><input id="${n}" type="${t}" value="${esc(v)}" ${t=='number'?'min="0"':''}><div class="err" id="e-${n}" role="alert"></div></div>`;
const form=(p={},b='Register patient')=>`<form id="f" novalidate class="card fg">${fld('name','Full name','text',p.name)}${fld('age','Age','number',p.age)}<div><label for="gender">Gender</label><select id="gender">${['Male','Female','Other'].map(g=>`<option ${p.gender==g?'selected':''}>${g}</option>`).join('')}</select><div class="err"></div></div>${fld('phone','Phone number (10 digits)','tel',p.phone)}${fld('disease','Disease / symptoms','text',p.disease)}<div style="align-self:center"><button class="btn" type="submit">${b}</button></div></form>`;
function read(){const g=i=>$('#'+i).value.trim(),o={name:g('name'),age:g('age'),gender:$('#gender').value,phone:g('phone'),disease:g('disease')},e={};
 if(!o.name)e.name='Name cannot be empty.';
 if(o.age===''||isNaN(o.age)||+o.age<0||+o.age>130)e.age='Enter a valid, non-negative age.';
 if(!/^\d{10}$/.test(o.phone))e.phone='Phone must be exactly 10 digits.';
 if(!o.disease)e.disease='Disease / symptoms is required.';
 ['name','age','phone','disease'].forEach(k=>$('#e-'+k).textContent=e[k]||'');o.age=+o.age;return Object.keys(e).length?null:o}
const pcard=p=>`<div class="card"><div class="row"><span class="av big">${esc(ini(p.name))}</span><div><h2>${esc(p.name)}</h2><span class="tag">ID #${p.id}</span><span class="tag">${esc(p.disease)}</span></div></div><div class="pc"><div><small>Age</small>${p.age}</div><div><small>Gender</small>${esc(p.gender)}</div><div><small>Phone</small>${esc(p.phone)}</div><div><small>Admitted</small>${fmt(p.date)}</div></div></div>`;
let pend=0;
const pid=v=>{const m=String(v).match(/^\d+/);return m?+m[0]:0};
const pick=()=>`<input id="i" type="text" list="plist" autocomplete="off" placeholder="Type a name or ID, then choose from the list" aria-label="Patient"><datalist id="plist">${S.rows.map(r=>`<option value="${r.id} – ${esc(r.name)}">${esc(r.disease)}</option>`).join('')}</datalist>`;

/* ===== PAGES ===== */
function dashboard(){
 const r=DAO.getAllPatients(),t0=new Date().setHours(0,0,0,0),cnt={};r.forEach(x=>cnt[x.disease]=(cnt[x.disease]||0)+1);
 const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0];
 const days=[...Array(7)].map((_,i)=>{const s=t0-(6-i)*DAY;return{l:new Date(s).toLocaleDateString('en-IN',{weekday:'short'}),n:r.filter(x=>x.date>=s&&x.date<s+DAY).length}}),mx=Math.max(1,...days.map(d=>d.n));
 const bars=days.map((d,i)=>{const h=d.n/mx*100;return `<rect x="${i*50+12}" y="${120-h}" width="30" height="${h}" rx="6" fill="var(--pr)" opacity=".85"/><text x="${i*50+27}" y="${114-h}" text-anchor="middle" font-size="11" font-weight="600">${d.n}</text><text x="${i*50+27}" y="138" text-anchor="middle" font-size="11" class="mu">${d.l}</text>`}).join('');
 V(`<section class="hero"><div><small>HOSPITAL MANAGEMENT SYSTEM</small><h1>Patient care, <span>organised</span> end to end.</h1><p>A Java, JDBC and MySQL system built on clean OOP and the DAO pattern. Every module is live in this prototype.</p><a class="btn" href="#register">+ Register patient</a><a class="btn gh" href="#oop">Explore the OOP design</a></div><div class="hero-art"><svg viewBox="0 0 320 100" width="100%" aria-hidden="true"><polyline class="ecg" points="0,60 70,60 90,60 105,16 125,92 142,36 156,60 320,60"/></svg><b>${r.length}</b><small>patients on record</small></div></section>`+`<div class="grid"><div class="card stat"><span>Total patients</span><b>${r.length}</b></div><div class="card stat"><span>Admitted today</span><b>${r.filter(x=>x.date>=t0).length}</b></div><div class="card stat"><span>Average age</span><b>${r.length?(r.reduce((a,x)=>a+x.age,0)/r.length).toFixed(1):'–'}</b></div><div class="card stat"><span>Most common condition</span><b style="font-size:20px">${top?esc(top[0]):'–'}</b></div></div><div class="two"><div class="card"><h3>Admissions · last 7 days</h3><svg viewBox="0 0 360 145" width="100%" role="img" aria-label="Admissions per day bar chart">${bars}</svg></div><div class="card"><h3>Recent admissions</h3><ul class="list">${[...r].sort((a,b)=>b.date-a.date).slice(0,5).map(x=>`<li><span class="av">${esc(ini(x.name))}</span>${esc(x.name)}<em>${esc(x.disease)}</em></li>`).join('')}</ul></div></div>`)}

function register(){
 V(head('Register patient','Module 1 · Create — calls addPatient(p)')+form());
 $('#f').onsubmit=e=>{e.preventDefault();const o=read();if(!o)return;DAO.addPatient(o).then(r=>{toast(`Patient registered · ID ${r.id}`);$('#f').reset()})}}

let st={q:'',k:'id',d:1,pg:0};
function directory(){
 const all=DAO.getAllPatients();
 V(head('Patient directory','Module 2 · Read — SELECT * FROM patients')+`<div class="card"><input id="q" type="search" placeholder="Filter by name, condition, phone…" aria-label="Filter patients" value="${esc(st.q)}"><div class="tw" id="tb"></div><div class="pgr" id="pg"></div></div>`);
 const cols=[['id','ID'],['name','Name'],['age','Age'],['gender','Gender'],['phone','Phone'],['disease','Condition'],['date','Admitted']];
 const draw=()=>{const q=st.q.toLowerCase();let r=all.filter(x=>(x.name+x.disease+x.phone+x.id).toLowerCase().includes(q));
  r.sort((a,b)=>(a[st.k]>b[st.k]?1:a[st.k]<b[st.k]?-1:0)*st.d);
  const pages=Math.max(1,Math.ceil(r.length/7));st.pg=Math.min(st.pg,pages-1);const s=r.slice(st.pg*7,st.pg*7+7);
  $('#tb').innerHTML=r.length?`<table><thead><tr>${cols.map(([k,l])=>`<th scope="col" tabindex="0" data-k="${k}" aria-sort="${st.k==k?(st.d>0?'ascending':'descending'):'none'}">${l}${st.k==k?(st.d>0?' ▲':' ▼'):''}</th>`).join('')}</tr></thead><tbody>${s.map(x=>`<tr><td>${x.id}</td><td><span class="av">${esc(ini(x.name))}</span>${esc(x.name)}</td><td>${x.age}</td><td>${esc(x.gender)}</td><td>${esc(x.phone)}</td><td>${esc(x.disease)}</td><td>${fmt(x.date)}</td></tr>`).join('')}</tbody></table>`:'<div class="empty">No patients match your filter.</div>';
  $('#pg').innerHTML=`<span>${r.length} record(s) · page ${st.pg+1}/${pages}</span><button class="btn gh" id="pv" ${st.pg?'':'disabled'}>Prev</button><button class="btn gh" id="nx" ${st.pg<pages-1?'':'disabled'}>Next</button>`;
  $('#pv').onclick=()=>{st.pg--;draw()};$('#nx').onclick=()=>{st.pg++;draw()};
  document.querySelectorAll('th[data-k]').forEach(h=>{const f=()=>{const k=h.dataset.k;st.d=st.k==k?-st.d:1;st.k=k;draw()};h.onclick=f;h.onkeydown=e=>{if(e.key=='Enter')f()}})};
 $('#q').oninput=e=>{st.q=e.target.value;st.pg=0;draw()};draw()}

function search(){
 V(head('Search by ID','Module 3 · Search — calls getPatientById(id)')+`<div class="card row">${pick()}<button class="btn" id="go">Search</button></div><div id="out"></div>`);
 const go=()=>{const v=$('#i').value.trim(),m=v.match(/^\d+/);if(v&&!m){st.q=v;st.pg=0;location.hash='#directory';return}const p=DAO.getPatientById(m?+m[0]:0);$('#out').innerHTML=p?pcard(p):'<div class="card empty">Patient ID not found</div>'};
 $('#go').onclick=go;$('#i').onkeydown=e=>{if(e.key=='Enter')go()};if(pend){$('#i').value=pend;pend=0;go()}}

function update(){
 V(head('Update record','Module 4 · Update — calls updatePatient(id, p)')+`<div class="card row">${pick()}<button class="btn" id="ld">Load patient</button></div><div id="out"></div>`);
 $('#ld').onclick=()=>{const id=pid($('#i').value),p=DAO.getPatientById(id);
  if(!p){$('#out').innerHTML='<div class="card empty">Patient ID not found</div>';return}
  $('#out').innerHTML=form(p,'Save changes');
  $('#f').onsubmit=e=>{e.preventDefault();const o=read();if(!o)return;toast(`${DAO.updatePatient(id,o)} row(s) updated`)}}}

function discharge(){
 V(head('Discharge patient','Module 5 · Delete — calls deletePatient(id)')+`<div class="card row">${pick()}<button class="btn co" id="dc">Discharge…</button></div><p style="color:var(--mu)">A confirmation dialog shows the patient summary before the record is removed.</p>`);
 $('#dc').onclick=()=>{const id=pid($('#i').value),p=S.rows.find(x=>x.id===id);
  if(!p){DAO.deletePatient(id);toast('Invalid patient ID',1);return}
  const d=$('#dlg');d.innerHTML=`<h2 id="dt">Confirm discharge</h2><p><b>${esc(p.name)}</b> · ID #${p.id}<br>${p.age} yrs · ${esc(p.gender)} · ${esc(p.disease)}</p><p style="color:var(--mu)">This removes the record from the patients table.</p><div class="row"><button class="btn co" id="ok">Yes, discharge</button><button class="btn gh" id="no">Cancel</button></div>`;
  d.showModal();$('#no').onclick=()=>d.close();
  $('#ok').onclick=()=>{d.close();toast(DAO.deletePatient(id)?'Patient discharged successfully':'Invalid patient ID')}}}

const PILL={Encapsulation:'private int age;\npublic void setAge(int age) {\n  if (age < 0) throw new IllegalArgumentException();\n  this.age = age;\n}',Inheritance:'public abstract class Person implements Displayable { ... }\npublic class Patient extends Person {\n  Patient(...) { super(id, name, age, gender, phone); }\n}',Abstraction:'public abstract void displayDetails();\n// SQL hidden behind the DAO layer\nIPatientDAO dao = new PatientDAO();',Polymorphism:'Person p = new Patient(...);\np.displayDetails();   // Patient version\np = new Doctor(...);\np.displayDetails();   // Doctor version',Interfaces:'interface IPatientDAO { void addPatient(Patient p); List<Patient> getAllPatients(); ... }\ninterface Displayable { void displayDetails(); }\ninterface Billable { double calculateTotalBill(); void printInvoice(); }'};
const POLY=[['new Patient(1, "Arjun", 34, "Male", "9841012345", "Typhoid")','Patient → ID: 1 | Name: Arjun | Age: 34 | Disease: Typhoid'],['new Doctor(7, "Dr. Meera", 45, "Female", "9840011223", "Cardiology")','Doctor → ID: 7 | Name: Dr. Meera | Specialization: Cardiology']];
function oop(){
 const B=(x,y,w,h,t,s,c)=>`<rect class="bx ${c||''}" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/><text x="${x+w/2}" y="${y+22}" text-anchor="middle" font-weight="700" font-size="14">${t}</text><text x="${x+w/2}" y="${y+40}" text-anchor="middle" font-size="11" class="mu">${s}</text>`;
 const L=(a,b,c,d,x)=>`<line class="ln" x1="${a}" y1="${b}" x2="${c}" y2="${d}" ${x?'stroke-dasharray="5 4"':''} marker-end="url(#ar)"/>`;
 const svg=`<svg viewBox="0 0 760 310" width="100%" role="img" aria-label="Class diagram"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--pr)"/></marker></defs>${B(20,10,160,52,'Displayable','«interface»','i')}${B(230,10,150,52,'Billable','«interface»','i')}${B(430,10,170,52,'IPatientDAO','«interface»','i')}${B(640,10,110,52,'Main','controller')}${B(20,115,160,60,'Person','«abstract»')}${B(10,240,150,52,'Patient','disease')}${B(190,240,150,52,'Doctor','specialization')}${B(430,115,170,60,'PatientDAO','JDBC + SQL')}${B(430,240,170,52,'DBConnection','connection factory')}${L(100,115,100,62,1)}${L(85,240,85,175)}${L(265,240,150,175)}${L(515,115,515,62,1)}${L(515,175,515,240,1)}${L(640,36,600,36,1)}</svg>`;
 V(head('OOP Lab','Module 6 · Class design and runtime polymorphism')+`<div class="card"><h3>Class diagram</h3>${svg}<p style="color:var(--mu);font-size:13px;margin:0">Solid arrow = extends · dashed arrow = implements / uses</p></div><div class="card"><h3>Polymorphism demo</h3><p style="color:var(--mu)">One <code>Person</code> reference, two different objects. Each click swaps the object at runtime.</p><button class="btn" id="pd">Call displayDetails()</button><pre class="code" id="pj"></pre><pre class="code" id="po" style="color:#fcd34d">// output appears here</pre></div><div class="card"><h3>Five pillars</h3><div class="tabs" role="tablist" id="pt">${Object.keys(PILL).map((k,i)=>`<button role="tab" aria-selected="${!i}" data-k="${k}">${k}</button>`).join('')}</div><pre class="code" id="pc"></pre></div>`);
 let i=0;$('#pd').onclick=()=>{const p=POLY[i++%2];$('#pj').textContent=`Person p = ${p[0]};\np.displayDetails(); // resolved at runtime`;$('#po').textContent=p[1]};
 const show=k=>{$('#pc').textContent=PILL[k];document.querySelectorAll('#pt button').forEach(b=>b.setAttribute('aria-selected',b.dataset.k==k))};
 document.querySelectorAll('#pt button').forEach(b=>b.onclick=()=>show(b.dataset.k));show('Encapsulation')}

function arch(){
 const col=[['patient_id','INT','PRIMARY KEY, AUTO_INCREMENT'],['name','VARCHAR(100)','NOT NULL'],['age','INT','NOT NULL'],['gender','VARCHAR(10)','–'],['phone','VARCHAR(20)','–'],['disease','VARCHAR(150)','–'],['admitted_date','TIMESTAMP','DEFAULT CURRENT_TIMESTAMP']];
 const T=(x,y,w,t,f)=>`<rect class="bx" x="${x}" y="${y}" width="${w}" height="${34+f.length*16}" rx="10"/><text x="${x+10}" y="${y+22}" font-weight="700" font-size="13">${t}</text>${f.map((a,i)=>`<text x="${x+10}" y="${y+46+i*16}" font-size="11.5" class="${/PK|FK/.test(a)?'':'mu'}">${a}</text>`).join('')}`;
 const L=(a,b,c,d)=>`<line class="ln" x1="${a}" y1="${b}" x2="${c}" y2="${d}" marker-end="url(#ar)"/>`;
 const er=`<svg viewBox="0 0 770 330" width="100%" role="img" aria-label="ER diagram"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--pr)"/></marker></defs>${T(20,10,170,'patients',['patient_id PK','name','age','gender','phone','disease','admitted_date'])}${T(290,10,190,'appointments',['appointment_id PK','patient_id FK','doctor_id FK','appointment_date','status'])}${T(580,10,170,'doctors',['doctor_id PK','name','specialization','department','phone','consultation_fee'])}${T(20,185,190,'bills',['bill_id PK','patient_id FK','consultation_fee','medicine_charge','room_charge','total_amount','payment_status'])}${L(290,60,190,60)}${L(480,76,580,76)}${L(115,185,115,156)}</svg>`;
 V(head('Architecture &amp; database','Layered DAO design and the hospital_db schema')+`<div class="card"><h3>Layered architecture</h3><div class="flow"><div class="lay"><b>Presentation</b><small>Main.java · Scanner menu</small></div><div class="lay"><b>Service / DAO</b><small>IPatientDAO → PatientDAO</small></div><div class="lay"><b>JDBC</b><small>DBConnection · PreparedStatement</small></div><div class="lay"><b>MySQL</b><small>hospital_db</small></div></div></div><div class="card"><h3>Active table: patients</h3><div class="tw"><table><thead><tr><th>Column</th><th>Type</th><th>Constraint</th></tr></thead><tbody>${col.map(c=>`<tr><td><code>${c[0]}</code></td><td>${c[1]}</td><td>${c[2]}</td></tr>`).join('')}</tbody></table></div></div><div class="card"><h3>Planned extension (ER diagram)</h3>${er}</div>`)}

function about(){
 const m=[['Harish Kumar S','251801090'],['Kamaleshwaran G','251801125'],['Kanish S','251801126'],['Vignesh M','251801504']];
 const fut=['Spring Boot web portal (Thymeleaf / React)','Multi-role login: Admin, Doctor, Receptionist, Patient','Online appointment booking and doctor scheduling','Automated billing and PDF invoices','Bed / ward occupancy tracking'];
 V(head('About the project','Hospital Management System · End-semester project')+`<div class="card"><h3>Hospital Management System (HMS)</h3><p>An enterprise Java console application that digitizes patient registration, search, update and discharge, built on clean OOP design, the DAO pattern and a MySQL database.</p>${['Java SE','JDBC','MySQL 8','DAO pattern','OOP','PreparedStatement','run.bat'].map(t=>`<span class="tag">${t}</span>`).join('')}<p style="color:var(--mu);margin-bottom:0">B.Tech Artificial Intelligence and Data Science · Rajalakshmi Engineering College · October 2026</p></div><div class="team">${m.map(x=>`<div class="card"><div class="av">${esc(ini(x[0]))}</div><b>${esc(x[0])}</b><br><span style="color:var(--mu)">${x[1]}</span></div>`).join('')}</div><div class="card" style="margin-top:16px"><h3>Future scope</h3><ul class="tl" style="margin-top:14px">${fut.map(f=>`<li>${f}</li>`).join('')}</ul></div>`)}


/* ---- Prescription page: patient + dataset (prescription-data.js) -> editable, printable prescription ---- */
function prescription(){
 V(head('Prescription','Pick a patient, check the suggested medicines, edit if needed, then print')+`<div class="card row">${pick()}<button class="btn" id="ld">Load patient</button></div><div id="rxbox"></div>`);
 $('#ld').onclick=()=>{const p=DAO.getPatientById(pid($('#i').value));if(!p){$('#rxbox').innerHTML='<div class="card empty">Patient ID not found</div>';return}rxStart(p)}}
function rxStart(p){
 const adult=p.age>=18,R={dx:p.disease,doc:0,meds:[],advice:''};
 $('#rxbox').innerHTML=`<div class="card"><div id="nt"></div><div class="fg"><div><label for="dx">Diagnosis (type any disease and the doctor and medicines change)</label><input id="dx" value="${esc(p.disease)}" autocomplete="off"></div><div><label for="dsel">Doctor (chosen from the diagnosis)</label><select id="dsel">${DOCTORS.map((d,i)=>`<option value="${i}">${esc(d.name)} · ${esc(d.dept)}</option>`).join('')}</select></div><div><label for="adv">Advice</label><input id="adv"></div></div><div class="tw"><table style="min-width:560px"><thead><tr><th>Medicine</th><th>Dose and timing</th><th>Days</th><th></th></tr></thead><tbody id="mb"></tbody></table></div><div class="row" style="margin-top:12px"><button class="btn gh" id="am">+ Add medicine</button><button class="btn" id="pr">Print prescription</button></div></div><div class="card" id="rx"></div>`;
 const rows=()=>{$('#mb').innerHTML=R.meds.map((m,i)=>`<tr>${[0,1,2].map(k=>`<td><input data-i="${i}" data-k="${k}" value="${esc(m[k])}" aria-label="Medicine detail"></td>`).join('')}<td><button class="btn gh" data-x="${i}" aria-label="Remove medicine">✕</button></td></tr>`).join('')||'<tr><td colspan="4" class="empty">No medicines yet. Click “+ Add medicine”.</td></tr>'};
 const sheet=()=>{const d=DOCTORS[R.doc];$('#rx').innerHTML=`<div class="sheet"><div class="sh-h"><div><h2>HMS Hospital</h2><small>Sample prescription · FOR DEMO ONLY</small></div><div>${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div></div><div class="pc"><div><small>Patient</small><b>${esc(p.name)}</b></div><div><small>Patient ID</small>${p.id}</div><div><small>Age / Gender</small>${p.age} / ${esc(p.gender)}</div><div><small>Diagnosis</small>${esc(R.dx)}</div></div><h3 class="rxs">℞</h3><ol>${R.meds.filter(m=>m[0]).map(m=>`<li><b>${esc(m[0])}</b> — ${esc(m[1])}${m[2]?` · ${esc(m[2])}`:''}</li>`).join('')||'<li>—</li>'}</ol>${R.advice?`<p><b>Advice:</b> ${esc(R.advice)}</p>`:''}<div class="sig"><div class="sg">${esc(d.name.replace('Dr. ',''))}</div><div><b>${esc(d.name)}</b><br><small>${esc(d.dept)}</small></div></div><p class="disc">Sample prescription made for an academic demo. It is not a real medical document. Check allergies, pregnancy, kidney and liver problems before use.</p></div>`};
 // match = look up the diagnosis in the dataset, then fill doctor, medicines and advice
 const match=()=>{const rx=findRx(R.dx);
  R.doc=Math.max(0,DOCTORS.findIndex(d=>d.dept==(adult?rx.dept:'Paediatrics')));
  R.meds=adult?rx.meds.map(m=>m.slice()):[];R.advice=rx.advice;
  const note=(rx.emergency?'EMERGENCY: take the patient to a hospital immediately. This sample prescription does not replace emergency care. ':'')+(rx.fallback?'This diagnosis is not in the sample dataset, so only general care is suggested. ':'')+(!adult?'Patient is under 18: adult sample doses were not filled in, the doctor must enter child doses. ':'');
  $('#nt').innerHTML=note?`<p class="err" style="min-height:0">${note}</p>`:'';
  $('#dsel').value=R.doc;$('#adv').value=R.advice;rows();sheet()};
 $('#dx').oninput=e=>{R.dx=e.target.value;match()};
 $('#dsel').onchange=e=>{R.doc=+e.target.value;sheet()};
 $('#adv').oninput=e=>{R.advice=e.target.value;sheet()};
 $('#mb').oninput=e=>{const t=e.target;if(t.dataset.i!=null){R.meds[+t.dataset.i][+t.dataset.k]=t.value;sheet()}};
 $('#mb').onclick=e=>{const b=e.target.closest('[data-x]');if(b){R.meds.splice(+b.dataset.x,1);rows();sheet()}};
 $('#am').onclick=()=>{R.meds.push(['','','']);rows();sheet()};
 $('#pr').onclick=()=>window.print();
 match()}
