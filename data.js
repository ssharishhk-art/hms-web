/* data.js - the website's data layer (like PatientData.java).
   DAO = the five actions (add, get, update, delete). 'LIVE MODE' sends them to WebServer.java -> MySQL. */

/* ===== DATA LAYER ("PatientDAO" simulation) ===== */
const DAY=864e5,LOG=[];
const seed=[['Arjun Venkatesh',34,'Male','9841012345','Typhoid fever',9],['Meenakshi Sundaram',52,'Female','9840023456','Hypertension',8],['Rahul Sharma',28,'Male','9811134567','Dengue fever',8],['Priya Lakshmi',41,'Female','9884045678','Migraine',7],['Mohammed Irfan',36,'Male','9790056789','Fractured wrist',6],['Ananya Iyer',23,'Female','9962067890','Viral fever',5],['Suresh Babu',67,'Male','9444078901','Type 2 diabetes',4],['Divya Prakash',31,'Female','9677089012','Appendicitis',3],['Karthik Raja',45,'Male','9500090123','Hypertension',2],['Fatima Begum',58,'Female','9382001234','Asthma',1],['Gurpreet Singh',39,'Male','9876512345','Back pain',0],['Lakshmi Narayanan',72,'Male','9841198765','Pneumonia',0]];
let S;try{S=JSON.parse(localStorage.getItem('hms-v1'))}catch(e){}
if(!S||!S.rows)S={seq:12,rows:seed.map((r,i)=>({id:i+1,name:r[0],age:r[1],gender:r[2],phone:r[3],disease:r[4],date:Date.now()-r[5]*DAY-(12-i)*6e5}))};
const save=()=>{try{localStorage.setItem('hms-v1',JSON.stringify(S))}catch(e){}};
const hl=s=>s.replace(/\b(INSERT INTO|SELECT|FROM|WHERE|UPDATE|SET|DELETE|VALUES|ORDER BY)\b/g,'<span class="k">$1</span>').replace(/\?/g,'<span class="p">?</span>');
function sql(q,p=[]){LOG.unshift({q,p,t:new Date().toLocaleTimeString('en-IN')});LOG.length=Math.min(LOG.length,8);drawSql()}
function drawSql(){$('#sqlb').innerHTML=LOG.length?LOG.map(l=>`<div class="q"><span class="t">${l.t}</span> ${hl(esc(l.q))}<div class="pm">bound: [${l.p.map(x=>`<span class="s">${esc(JSON.stringify(x))}</span>`).join(', ')}]</div></div>`).join(''):'<div class="q">Run any action to see its PreparedStatement.</div>'}
const DAO={
 addPatient(p){const r={...p,id:++S.seq,date:Date.now()};S.rows.push(r);save();sql('INSERT INTO patients (name, age, gender, phone, disease) VALUES (?, ?, ?, ?, ?)',[p.name,p.age,p.gender,p.phone,p.disease]);return r},
 getAllPatients(){sql('SELECT * FROM patients ORDER BY patient_id');return S.rows},
 getPatientById(id){sql('SELECT * FROM patients WHERE patient_id = ?',[id]);return S.rows.find(r=>r.id===id)||null},
 updatePatient(id,p){sql('UPDATE patients SET name = ?, age = ?, gender = ?, phone = ?, disease = ? WHERE patient_id = ?',[p.name,p.age,p.gender,p.phone,p.disease,id]);const r=S.rows.find(x=>x.id===id);if(!r)return 0;Object.assign(r,p);save();return 1},
 deletePatient(id){const n=S.rows.length;S.rows=S.rows.filter(r=>r.id!==id);sql('DELETE FROM patients WHERE patient_id = ?',[id]);save();return n-S.rows.length}
};

/* ===== LIVE MODE: WebServer.java -> JDBC -> MySQL (hospital_db) ===== */
const API='/api/patients',badge=document.createElement('span');
badge.style.cssText='font:600 12px Inter,sans-serif;padding:6px 12px;border-radius:99px;background:var(--card);border:1px solid var(--bd)';
$('.top').insertBefore(badge,$('.chip'));
let online=false;
const sync=()=>fetch(API).then(r=>{if(!r.ok)throw 0;return r.json()}).then(r=>{online=true;S.rows=r;S.seq=Math.max(0,...r.map(x=>x.id));badge.textContent='● MySQL connected';badge.style.color='#0f766e'}).catch(()=>{online=false;badge.textContent='○ Demo mode (server offline)';badge.style.color='#e5604d'});
const send=(m,u,b)=>fetch(u,{method:m,headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b&&new URLSearchParams(b)}).then(r=>{if(!r.ok)throw 0;return r.json()});
const A0=DAO.addPatient,U0=DAO.updatePatient,D0=DAO.deletePatient;
DAO.addPatient=p=>!online?Promise.resolve(A0(p)):send('POST',API,p).then(r=>{S.rows.push(r);S.seq=r.id;sql('INSERT INTO patients (name, age, gender, phone, disease) VALUES (?, ?, ?, ?, ?)',[p.name,p.age,p.gender,p.phone,p.disease]);return r}).catch(()=>{toast('Could not save to MySQL – check the black server window',1);throw 0});
DAO.updatePatient=(id,p)=>{const n=U0(id,p);if(n&&online)send('PUT',API+'/'+id,p).catch(()=>toast('Database error',1));return n};
DAO.deletePatient=id=>{const n=D0(id);if(n&&online)send('DELETE',API+'/'+id).catch(()=>toast('Database error',1));return n};
setInterval(sync,4000);

