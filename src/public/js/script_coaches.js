let currentLang = 'KZ';
let selectedSport = localStorage.getItem('selectedSport') || 'General';
let db = JSON.parse(localStorage.getItem('sportDB')) || {};

const translations = {
    KZ: { main: "БАСҚАРУ ПАНЕЛІ", addC: "ЖАТТЫҚТЫРУШЫ ҚОСУ", event: "Жарыс:", date: "Мерзімі:", tel: "Тел:", geo: "Орыны:", save: "САҚТАУ" },
    RU: { main: "ПАНЕЛЬ УПРАВЛЕНИЯ", addC: "ДОБАВИТЬ ТРЕНЕРА", event: "Турнир:", date: "Сроки:", tel: "Тел:", geo: "Место:", save: "СОХРАНИТЬ" }
};

function toggleLang() {
    currentLang = currentLang === 'KZ' ? 'RU' : 'KZ';
    render();
}

function render() {
    const list = document.getElementById('coachList');
    list.innerHTML = '';
    const coaches = db[selectedSport] || [];

    document.getElementById('mainTitle').innerText = translations[currentLang].main;
    document.getElementById('addCoachBtnTxt').innerText = translations[currentLang].addC;

    coaches.forEach((c, cIdx) => {
        let athletesHTML = (c.athletes || []).map((a, aIdx) => `
            <div class="athlete-card">
                <img src="${a.photo || 'https://via.placeholder.com/50'}" class="athlete-thumb">
                <div style="font-size:12px">
                    <b>${a.name}</b><br>${a.dob}
                </div>
                <div style="margin-left:auto">
                    <i class="fas fa-edit" style="color:orange; cursor:pointer" onclick="openAthModal(${cIdx}, ${aIdx})"></i>
                    <i class="fas fa-trash" style="color:red; cursor:pointer" onclick="deleteAth(${cIdx}, ${aIdx})"></i>
                </div>
            </div>
        `).join('');

        list.innerHTML += `
            <div class="coach-card">
                <div class="coach-main-info">
                    <img src="${c.photo || 'https://via.placeholder.com/80'}" class="coach-img-circle">
                    <div>
                        <h3>${c.name}</h3>
                        <p style="color:#aaa">${c.rank}</p>
                    </div>
                    <div style="margin-left:auto">
                        <i class="fas fa-edit" style="color:orange; cursor:pointer; margin-right:15px" onclick="openCoachModal(${cIdx})"></i>
                        <i class="fas fa-trash" style="color:red; cursor:pointer" onclick="deleteCoach(${cIdx})"></i>
                    </div>
                </div>
                <div class="event-details">
                    <div><b>${translations[currentLang].event}</b> ${c.event}</div>
                    <div><b>${translations[currentLang].tel}</b> ${c.phone}</div>
                    <div><b>${translations[currentLang].date}</b> ${c.start} / ${c.end}</div>
                    <div><b>${translations[currentLang].geo}</b> <a href="${c.geo}" target="_blank" class="geo-link">🗺 Карта</a></div>
                </div>
                <button class="save-btn" style="width:auto; padding:5px 15px" onclick="openAthModal(${cIdx})">+ Спортшы</button>
                <div class="athlete-grid">${athletesHTML}</div>
            </div>`;
    });
}

// Функционал: Суретті Base64-ке айналдыру
async function toBase64(file) {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(file);
    });
}

document.getElementById('coachForm').onsubmit = async (e) => {
    e.preventDefault();
    const idx = document.getElementById('editCoachIndex').value;
    const photoFile = document.getElementById('cPhoto').files[0];
    let photoBase64 = idx !== "" ? db[selectedSport][idx].photo : null;
    
    if(photoFile) photoBase64 = await toBase64(photoFile);

    const coachData = {
        name: document.getElementById('cName').value,
        rank: document.getElementById('cRank').value,
        phone: document.getElementById('cPhone').value,
        event: document.getElementById('cEvent').value,
        geo: document.getElementById('cGeo').value,
        start: document.getElementById('cStart').value,
        end: document.getElementById('cEnd').value,
        login: document.getElementById('cLogin').value,
        pass: document.getElementById('cPass').value,
        photo: photoBase64,
        athletes: idx !== "" ? db[selectedSport][idx].athletes : []
    };

    if(!db[selectedSport]) db[selectedSport] = [];
    idx !== "" ? db[selectedSport][idx] = coachData : db[selectedSport].push(coachData);
    save();
};

document.getElementById('athleteForm').onsubmit = async (e) => {
    e.preventDefault();
    const cIdx = document.getElementById('targetCIndex').value;
    const aIdx = document.getElementById('editAIndex').value;
    const photoFile = document.getElementById('aPhoto').files[0];
    let photoBase64 = (aIdx !== "" && aIdx !== undefined) ? db[selectedSport][cIdx].athletes[aIdx].photo : null;

    if(photoFile) photoBase64 = await toBase64(photoFile);

    const athData = {
        name: document.getElementById('aName').value,
        dob: document.getElementById('aDob').value,
        photo: photoBase64
    };

    if(aIdx !== "") db[selectedSport][cIdx].athletes[aIdx] = athData;
    else db[selectedSport][cIdx].athletes.push(athData);
    save();
};

function save() { 
    localStorage.setItem('sportDB', JSON.stringify(db)); 
    render(); 
    closeModal('coachModal'); 
    closeModal('athleteModal'); 
}

function openCoachModal(idx = null) {
    document.getElementById('coachModal').style.display = 'block';
    if(idx !== null) {
        const c = db[selectedSport][idx];
        document.getElementById('cName').value = c.name;
        document.getElementById('cRank').value = c.rank;
        document.getElementById('cPhone').value = c.phone;
        document.getElementById('cEvent').value = c.event;
        document.getElementById('cGeo').value = c.geo;
        document.getElementById('cStart').value = c.start;
        document.getElementById('cEnd').value = c.end;
        document.getElementById('cLogin').value = c.login;
        document.getElementById('cPass').value = c.pass;
        document.getElementById('editCoachIndex').value = idx;
    } else {
        document.getElementById('coachForm').reset();
        document.getElementById('editCoachIndex').value = "";
    }
}

function openAthModal(cIdx, aIdx = null) {
    document.getElementById('athleteModal').style.display = 'block';
    document.getElementById('targetCIndex').value = cIdx;
    if(aIdx !== null) {
        const a = db[selectedSport][cIdx].athletes[aIdx];
        document.getElementById('aName').value = a.name;
        document.getElementById('aDob').value = a.dob;
        document.getElementById('editAIndex').value = aIdx;
    } else {
        document.getElementById('athleteForm').reset();
        document.getElementById('editAIndex').value = "";
    }
}

function deleteCoach(i) { if(confirm('Өшіру?')) { db[selectedSport].splice(i,1); save(); } }
function deleteAth(ci, ai) { db[selectedSport][ci].athletes.splice(ai,1); save(); }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

render();