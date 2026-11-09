/* prescription-data.js - the SAMPLE dataset for the Prescription page (FOR DEMO ONLY).
   DOCTORS : sample doctors, one or more per department.
   RX_DATA : words in the disease text -> department + common adult medicines + advice.
   findRx  : finds the first matching row. If nothing matches, it returns FALLBACK,
             so EVERY entry gets a doctor and a prescription.
   A real doctor must check and edit everything before it is used. */

const DOCTORS = [
  { name: 'Dr. Meera Krishnan',      dept: 'General Medicine' },
  { name: 'Dr. Arvind Raman',        dept: 'Cardiology' },
  { name: 'Dr. Sana Fathima',        dept: 'Orthopaedics' },
  { name: 'Dr. Rohit Menon',         dept: 'Neurology' },
  { name: 'Dr. Lakshmi Priya',       dept: 'Pulmonology' },
  { name: 'Dr. Karthik Subramanian', dept: 'General Surgery' },
  { name: 'Dr. Nivetha Rao',         dept: 'Endocrinology' },
  { name: 'Dr. Imran Basha',         dept: 'ENT' },
  { name: 'Dr. Pooja Nair',          dept: 'Dermatology' },
  { name: 'Dr. Vikram Anand',        dept: 'Gastroenterology' },
  { name: 'Dr. Deepa Chandran',      dept: 'Ophthalmology' },
  { name: 'Dr. Harini Selvam',       dept: 'Dentistry' },
  { name: 'Dr. Ashok Kumar',         dept: 'Urology' },
  { name: 'Dr. Gayathri Mohan',      dept: 'Psychiatry' },
  { name: 'Dr. Revathi Iyer',        dept: 'Gynaecology' },
  { name: 'Dr. Suresh Pillai',       dept: 'Paediatrics' },
  { name: 'Dr. Joseph Antony',       dept: 'Emergency Medicine' }
];

// meds = [ medicine, dose and timing, number of days ]
const PCM = ['Paracetamol 500 mg', '1 tablet up to 3 times a day if pain or fever', '3 days'];
const ORS = ['ORS sachet', '1 sachet in 1 litre of water, sip through the day', '3 days'];

const RX_DATA = [
  // ---- emergencies first ----
  { keys: ['heart', 'cardiac', 'chest pain', 'myocardial'], dept: 'Cardiology', emergency: true,
    meds: [['Aspirin 300 mg (chewable)', 'Chew 1 tablet once now (unless allergic)', 'once']],
    advice: 'Call an ambulance (108) and go to the nearest hospital immediately. ECG and cardiologist needed.' },
  { keys: ['stroke', 'paralysis'], dept: 'Neurology', emergency: true, meds: [],
    advice: 'Note the time the symptoms started and go to the nearest hospital immediately. Give nothing to eat or drink.' },
  { keys: ['bite', 'snake', 'sting'], dept: 'Emergency Medicine', emergency: true, meds: [],
    advice: 'Wash the area with soap and running water for 15 minutes and go to hospital at once for anti-rabies or anti-venom treatment.' },
  // ---- infections and fevers ----
  { keys: ['typhoid'], dept: 'General Medicine',
    meds: [['Azithromycin 500 mg', '1 tablet once a day after food', '7 days'], PCM],
    advice: 'Drink boiled water, eat light food and take rest. Finish the full course.' },
  { keys: ['dengue'], dept: 'General Medicine',
    meds: [['Paracetamol 500 mg', '1 tablet every 6 hours if fever (max 4 a day)', '5 days'], ORS],
    advice: 'Drink plenty of fluids. Do NOT take ibuprofen or aspirin. Repeat the platelet count as advised.' },
  { keys: ['covid', 'corona'], dept: 'General Medicine', meds: [PCM, ORS],
    advice: 'Rest, drink fluids and stay isolated. Go to hospital at once if breathing becomes difficult.' },
  { keys: ['pneumonia'], dept: 'Pulmonology',
    meds: [['Amoxicillin + Clavulanic acid 625 mg', '1 tablet twice a day after food', '5 days'], PCM],
    advice: 'Chest X-ray and doctor review needed. Rest and drink warm fluids.' },
  { keys: ['asthma', 'breath', 'wheez'], dept: 'Pulmonology',
    meds: [['Salbutamol inhaler 100 mcg', '1-2 puffs when breathless (reliever)', 'as needed'],
           ['Montelukast 10 mg', '1 tablet at night', '30 days']],
    advice: 'Avoid dust and smoke. Always carry the inhaler.' },
  { keys: ['aids', 'hiv'], dept: 'General Medicine', meds: [],
    advice: 'Needs specialist care and counselling at an ART centre. Keep the report confidential.' },
  // ---- long-term conditions ----
  { keys: ['hypertension', 'blood pressure'], dept: 'Cardiology',
    meds: [['Amlodipine 5 mg', '1 tablet once a day in the morning', '30 days']],
    advice: 'Low-salt diet, daily walk and regular BP checks. Review in 2 weeks.' },
  { keys: ['diabet', 'sugar'], dept: 'Endocrinology',
    meds: [['Metformin 500 mg', '1 tablet twice a day with meals', '30 days']],
    advice: 'Control sweets and rice portions and walk daily. Check fasting sugar and HbA1c.' },
  // ---- head, ear, eye, throat, teeth ----
  { keys: ['migraine'], dept: 'Neurology',
    meds: [['Ibuprofen 400 mg', '1 tablet at the start of the headache, after food (max 3 a day)', '3 days'],
           ['Domperidone 10 mg', '1 tablet if nausea, up to 3 times a day', '3 days']],
    advice: 'Rest in a dark, quiet room. Do not skip meals. Reduce screen time.' },
  { keys: ['headache', 'head ache', 'giddiness', 'dizz'], dept: 'Neurology', meds: [PCM],
    advice: 'Rest, drink water and sleep well. See a doctor if the headache is sudden and severe.' },
  { keys: ['ear', 'hearing', 'tinnitus'], dept: 'ENT',
    meds: [PCM, ['Ofloxacin 0.3% ear drops', '4 drops in the affected ear twice a day (only if pain or discharge)', '5 days']],
    advice: 'Tilt the head to drain the water and dry the outer ear gently. Do not put cotton buds or fingers inside. Come back if pain, discharge or hearing loss.' },
  { keys: ['throat', 'tonsil', 'nose', 'sinus'], dept: 'ENT', meds: [PCM],
    advice: 'Gargle with warm salt water, drink warm fluids and rest your voice.' },
  { keys: ['eye', 'vision', 'conjunctiv'], dept: 'Ophthalmology',
    meds: [['Moxifloxacin 0.5% eye drops', '1 drop in the affected eye 3 times a day', '5 days']],
    advice: 'Do not rub the eyes. Wash hands often. Avoid screens and dust.' },
  { keys: ['tooth', 'teeth', 'dental', 'gum'], dept: 'Dentistry',
    meds: [PCM, ['Amoxicillin 500 mg', '1 capsule 3 times a day after food', '5 days']],
    advice: 'Rinse with warm salt water. Visit the dentist for examination and cleaning.' },
  // ---- bones, injuries ----
  { keys: ['fracture', 'broken', 'break', 'crack'], dept: 'Orthopaedics',
    meds: [['Paracetamol 500 mg', '1 tablet up to 3 times a day for pain', '5 days'],
           ['Calcium + Vitamin D3', '1 tablet once a day after food', '30 days']],
    advice: 'Do not walk or put weight on the limb. Keep it still and raised. X-ray and orthopaedic review needed.' },
  { keys: ['back pain', 'backache'], dept: 'Orthopaedics',
    meds: [['Ibuprofen 400 mg', '1 tablet twice a day after food', '3 days'], PCM],
    advice: 'Hot compress. Avoid heavy lifting and long sitting.' },
  { keys: ['leg', 'arm', 'knee', 'ankle', 'shoulder', 'joint', 'bone', 'sprain', 'neck', 'hand', 'foot', 'wrist'], dept: 'Orthopaedics',
    meds: [['Ibuprofen 400 mg', '1 tablet twice a day after food', '3 days'], PCM],
    advice: 'Rest and apply ice for 15 minutes, 3 times a day. X-ray if there is swelling or you cannot bear weight.' },
  { keys: ['burn', 'scald'], dept: 'General Surgery',
    meds: [PCM, ['Silver sulfadiazine 1% cream', 'Apply a thin layer once a day', '7 days']],
    advice: 'Cool the burn under running water for 20 minutes. No toothpaste or ice. Go to hospital for large burns.' },
  { keys: ['wound', 'cut', 'injur', 'bleed'], dept: 'General Surgery',
    meds: [PCM, ['Tetanus toxoid 0.5 ml injection', 'Once, if the last dose was more than 5 years ago', 'once']],
    advice: 'Wash with clean water, press with a clean cloth to stop bleeding and keep the wound covered.' },
  { keys: ['appendic'], dept: 'General Surgery', meds: [], emergency: true,
    advice: 'Possible emergency. Do not eat or drink and do not take painkillers. Needs urgent surgical review.' },
  // ---- stomach, urine, skin, mind, women ----
  { keys: ['stomach', 'abdom', 'gastric', 'acidity', 'vomit', 'diarrh', 'loose motion', 'indigestion', 'gastro'], dept: 'Gastroenterology',
    meds: [['Pantoprazole 40 mg', '1 tablet before breakfast', '5 days'], ORS,
           ['Ondansetron 4 mg', '1 tablet if vomiting, up to 3 times a day', '2 days']],
    advice: 'Eat light food and avoid oily or spicy food. Go to hospital if there is blood in stool, severe pain or you cannot drink.' },
  { keys: ['urine', 'urinary', 'uti', 'kidney', 'bladder'], dept: 'Urology',
    meds: [['Nitrofurantoin 100 mg', '1 capsule twice a day after food', '5 days'], PCM],
    advice: 'Drink plenty of water. Urine test needed. Review if fever or back pain.' },
  { keys: ['rash', 'itch', 'allergy', 'skin', 'eczema', 'acne'], dept: 'Dermatology',
    meds: [['Cetirizine 10 mg', '1 tablet at night', '5 days'],
           ['Calamine lotion', 'Apply on the itchy area 2-3 times a day', '5 days']],
    advice: 'Avoid scratching and the thing that causes the allergy. Wear loose cotton clothes.' },
  { keys: ['anxiety', 'depress', 'stress', 'insomnia', 'sleep', 'mental'], dept: 'Psychiatry', meds: [],
    advice: 'Counselling and a sleep routine are advised. The doctor will decide on any treatment after talking to the patient.' },
  { keys: ['pregnan', 'period', 'menstru', 'pcos'], dept: 'Gynaecology', meds: [],
    advice: 'Needs examination and tests by the gynaecologist.' },
  // ---- common cold and fever last ----
  { keys: ['cold', 'cough'], dept: 'General Medicine',
    meds: [['Cetirizine 10 mg', '1 tablet at night', '3 days'], PCM],
    advice: 'Warm fluids, steam inhalation and rest.' },
  { keys: ['fever', 'viral', 'flu', 'weak', 'tired'], dept: 'General Medicine', meds: [PCM, ORS],
    advice: 'Rest and drink plenty of fluids. Come back if fever lasts more than 3 days.' }
];

// Used when no keyword matches, so every entry still gets a doctor and a prescription
const FALLBACK = { keys: [], dept: 'General Medicine', fallback: true, meds: [PCM],
  advice: 'General care only: rest, drink fluids and eat light food. The doctor will examine the patient and enter the final treatment.' };

// Finds the first row whose word appears at the start of a word in the disease text
const findRx = d => {
  const text = String(d).toLowerCase();
  return RX_DATA.find(r => r.keys.some(k => new RegExp('\\b' + k).test(text))) || FALLBACK;
};
