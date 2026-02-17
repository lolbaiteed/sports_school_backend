
let currentCoachId = null;
async function logout() {
  await fetch('/api/auth/logout', {
    method: "POST",
  });
  
  window.location.href = '/login'; 
}

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.onclick = async () => {
  await logout();
}

function showCoaches(sportName, discipline) {
    const tAdm = window.langData;
    document.getElementById('sports-view').classList.add('hidden');
    document.getElementById('coaches-view').classList.remove('hidden');
    document.getElementById('selected-sport-title').innerText = `${sportName} ${tAdm[1]}:`;
    
    const list = document.getElementById('coaches-list-admin');
    const coaches = window.coachesData.filter(coach => coach.discipline === discipline); 

    if (coaches.length > 0) {
        coaches.forEach(c => {
            list.innerHTML += `
                <div class="item" onclick="manageCoach(${c.id})" style="cursor:pointer; padding:15px; border-bottom:1px solid #ddd;">
                    <strong>${c.firstName} ${c.lastName}</strong> <span style="float:right; color:blue;">${tAdm[2]} ></span>
                </div>`;
        });
    } else {
        list.innerHTML += `<p>${tAdm[0]}</p>`;
    }
}

function goBackToSports() {
    document.getElementById('coaches-view').classList.add('hidden');
    document.getElementById('sports-view').classList.remove('hidden');
    localStorage.selectedSport = null;
}

const backToSport = document.getElementById('backToSports-btn');
backToSport.onclick = () => {
  goBackToSports();
}

function goBackToCoaches() {
    document.getElementById('manager-view').classList.add('hidden');
    document.getElementById('coaches-view').classList.remove('hidden');
    localStorage.eventId = null;
}

const backToCoach = document.getElementById('backToCoach-btn');
backToCoach.onclick = () => {
  goBackToCoaches();
}

function exportExcel() { alert("Excel файл жүктелді!"); }
const exelBtn = document.getElementById('exel-btn');
exelBtn.onclick = function() {
  exportExcel();
}

function manageCoach(cId) {
    currentCoachId = cId;
    const coach = window.coachesData.filter(c => c.id === cId);
    document.getElementById('coaches-view').classList.add('hidden');
    document.getElementById('manager-view').classList.remove('hidden');
    document.getElementById('manager-coach-name').innerText = `${coach[0].firstName} ${coach[0].lastName}`;
    const coachIdInput = document.getElementById('CoachId');
    const DisciplineInput = document.getElementById('Discipline');
    DisciplineInput.value = coach[0].discipline;
    coachIdInput.value = coach[0].id;
    renderCoachAthletesTable();
}

function renderCoachAthletesTable() {
    const list = document.getElementById('coach-athletes-table');
    list.innerHTML = '';
    athletes.filter(a => a.coachId === currentCoachId).forEach(a => {
        list.innerHTML += `<div class="item">${a.name} (${a.dob})</div>`;
    });
}

const studentsForm = document.getElementById('studentForm');
studentsForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const sForm = new FormData(studentsForm);
  sForm.set('eventId', Number(localStorage.eventId));
  sForm.set('CoachId', Number(currentCoachId));
  const coachRaw = window.coachesData;
  const coach = coachRaw.filter(c => c.id === currentCoachId)
  sForm.set('discipline', `${coach.discipline}`)
  const resp = await fetch(studentsForm.action, {
    method: studentsForm.method,
    body: new FormData(studentsForm),
  });

  if (resp.ok) {
    console.log(resp.body);
  }
});

const eventForm = document.getElementById('eventForm');
eventForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const eForm = new FormData(eventForm);
  
  eForm.set('CoachId', Number(currentCoachId));

  const resp = await fetch(eventForm.action, {
    method: eventForm.method,
    body: eForm,
    redirect: 'manual'
  });

  if (resp.ok) {
    const event = await resp.json();
    localStorage.eventId = event.message; 
    alert('event added successfully');
  } else {
    console.log(await resp.json());
  }
})

function renderCoachAthletesTable() {
    const list = document.getElementById('coach-athletes-table');
    list.innerHTML = '';
    window.studentsData.filter(a => a.coachId === currentCoachId && eventId === localStorage.eventId).forEach(a => {
        const year = new Date(a.dateOfBirth).getFullYear();
        const month = new Date(a.dateOfBirth).getMonth();
        const day = new Date(a.dateOfBirth).getDay();
        const dateConverted = `${year}-${month}-${day}`;
        list.innerHTML += `<div class="item">${a.firstName} ${a.lastName} (${dateConverted})</div>`;
    });
}

async function addCoach() {
  const coachForm = document.getElementById('coachForm');
  coachForm.style.display = 'flex';
}
