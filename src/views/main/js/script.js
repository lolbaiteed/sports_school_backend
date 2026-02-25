/* --- ДЕРЕКТЕР БАЗАСЫ (MOCK DATA) --- */
const translations = {
    kk: {int_wins: "Стипендия иегерлері", athletes_count: "Спортшылар", gold_medals: "Біздің үздіктер", achievements: "Біздің жетістіктер", logot: "ОЖСШМ", login: "Кіру", hero_title: "БОЛАШАҚ ОЛИМПИАДА ЧЕМПИОНДАР ОРТАЛЫҒЫ", hero_subtitle: "Бізбен бірге биік белестерді бағындыр!", pride: "Біздің мақтаныштарымыз", coaches_btn: "Жаттықтырушылар", athletes_btn: "Спортшылар" },
    ru: {int_wins: "Стипендиаты", athletes_count: "Спортсмены", gold_medals: "Наши лучшие", achievements: "Наши достижения", logot: "ОШВСМ по олимпийским видам спорта", login: "Войти", hero_title: "ЦЕНТР БУДУЩИХ ОЛИМПИЙСКИХ ЧЕМПИОНОВ", hero_subtitle: "Покоряй вершины вместе с нами!", pride: "Наши достижения", coaches_btn: "Тренеры", athletes_btn: "Спортсмены" },
    en: {int_wins: "Scholarship holders", athletes_count: "Athletes", gold_medals: "Our best", achievements: "Our achievements", logot: "RSOHSM in Olympic Sports", login: "Login", hero_title: "FUTURE OLYMPIC CHAMPIONS CENTER", hero_subtitle: "Conquer heights with us!", pride: "Our Pride", coaches_btn: "Coaches", athletes_btn: "Athletes" }
};

const sports = [
    { name: "Ауыр атлетика", icon: "" }, { name: "Жеңіл атлетика", icon: "" },
    { name: "Бокс", icon: "" }, { name: "Керлинг", icon: "" },
    { name: "Велоспорт", icon: "" }, { name: "Садақ ату", icon: "" },
    { name: "Грек-рим күресі", icon: "" }, { name: "Спорттық шыңға өрмелеу", icon: "" },
    { name: "Дзюдо", icon: "" }, { name: "Таеквондо", icon: "" },
    { name: "Еркін күрес", icon: "" }
];

// ПАЙДАЛАНУШЫЛАР
// Маңызды өзгеріс: Coach1-ге дайын "event" (жарыс) қосып қойдым, батырма көрінуі үшін.
const users = [
    { id: 1, role: 'admin', user: 'admin', pass: 'admin', name: 'Бас Админ' },
    { 
        id: 101, role: 'coach', user: 'coach1', pass: '123', name: 'Асқар Омаров', sport: 'Бокс', 
        event: { type: 'Жарыс', name: 'ҚР Чемпионаты', loc: 'https://go.2gis.com/example', date: '20.05.2024' } 
    },
    { id: 102, role: 'coach', user: 'coach2', pass: '123', name: 'Серік Сапиев', sport: 'Бокс', event: null },
    { id: 103, role: 'coach', user: 'coach3', pass: '123', name: 'Елена Иванова', sport: 'Гимнастика', event: null }
];

let athletes = [
    { id: 1, name: "Алихан Смаилов", dob: "2005-05-10", coachId: 101, img: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Бекзат Нұрғали", dob: "2006-02-15", coachId: 101, img: "https://randomuser.me/api/portraits/men/2.jpg" }
];

/* --- 1. СЛАЙДЕРДІ ІСКЕ ҚОСУ (МАҚТАНЫШТАР) --- */
// Бұл код міндетті түрде жұмыс істеуі керек
document.addEventListener("DOMContentLoaded", function() {
    initSliders();
    
    // Егер Dashboard-та болсақ, алдыңғы логинді тексереміз (қалау бойынша)
    const savedLang = localStorage.getItem('lang') || 'kk';
    changeLang(savedLang);
});

function initSliders() {
    const cTrack = document.getElementById('coaches-track');
    const aTrack = document.getElementById('athletes-track');

    // Егер бұл элементтер табылмаса (мысалы dashboard.html-де), функция тоқтайды
    if (!cTrack || !aTrack) return;

    // Слайдерді тазалау
    cTrack.innerHTML = "";
    aTrack.innerHTML = "";

    // 10 рет қайталап салу (Демо)
    for(let i=0; i<1; i++) {
        cTrack.innerHTML += `
            <div class="slide-card">
                <div class="slide-img"><img src="./media/coaches/trener/05erken.jpeg"></div>
                <div class="slide-info">
                    <h4>Сепбосынов Еркен Маратулы</h4>
                    <p style="color:#777">Жеңіл атлетикадан біліктілігі жоғары деңгейдегі жоғары санатты жаттықтырушы</p>
                </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/coaches/trener/sedov.jpeg"></div>
                <div class="slide-info">
                    <h4>Седов Сергей Владимирович</h4>
                    <p style="color:#777">Жеңіл атлетика</p>
                </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/coaches/trener/03tadjikov.jpeg"></div>
                <div class="slide-info">
                    <h4>Тажиков Ерлан</h4>
                    <p style="color:#777">бокстан біліктілігі жоғары деңгейдегі жоғары санатты жаттықтырушы</p>
                </div>
            </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/coaches/trener/11nurgaliev.jpeg"></div>
                <div class="slide-info">
                    <h4>Нұрғалиев Нұртай</h4>
                    <p style="color:#777">Ауыр атлетика</p>
                </div>
            </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/coaches/trener/02zhaksyjol.jpeg"></div>
                <div class="slide-info">
                    <h4>Көрпебаев Жақсыжол Жолдыбаевич</h4>
                    <p style="color:#777">Еркін күрестен Қазақстан Республикасына еңбек сіңірген жаттықтырушы</p>
                </div>
            </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/coaches/trener/08artem.jpeg"></div>
                <div class="slide-info">
                    <h4>Кичкин Артём Николаевич</h4>
                    <p style="color:#777">Садақ атудан біліктілігі жоғары деңгейдегі жоғары санатты жаттықтырушы</p>
                </div>
            </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/coaches/trener/10maratT.jpeg"></div>
                <div class="slide-info">
                    <h4>Таласпаев Манат Рыстаевич</h4>
                    <p style="color:#777">Велоспорттан Қазақстан Республикасына еңбек сіңірген жаттықтырушы</p>
                </div>
            </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/coaches/trener/09maulen.jpeg"></div>
                <div class="slide-info">
                    <h4>Есимханов Маулен Кажимуханович</h4>
                    <p style="color:#777">спорттық шыңға өрмелеуден біліктілігі жоғары деңгейдегі жоғары санатты жаттықтырушы</p>
                </div>
            </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/coaches/trener/04ahmetov.jpeg"></div>
                <div class="slide-info">
                    <h4>Ахметов Жанкелді Әлімжанұлы</h4>
                    <p style="color:#777">Бокстан Қазақстан Республикасына еңбек сіңірген жаттықтырушы</p>
                </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/coaches/trener/11muhammed.jpeg"></div>
                <div class="slide-info">
                    <h4>Нугуманов Мухамет Курбаевич</h4>
                    <p style="color:#777">Грек-рим күресінен біліктілігі жоғары деңгейдегі жоғары санатты жаттықтырушы</p>
                </div>
            </div>`;
        
        aTrack.innerHTML += `
            <div class="slide-card">
                <div class="slide-img"><img src="./media/athletes/11/34.jpg"></div>
                <div class="slide-info">
                    <h4>Курбаев Исхар Мухаметович${i+1}</h4>
                    <p style="color:#777">Грек-рим күресінен U-23 жасқа дейінгі ересектер арасында Азия чемпионатының жеңімпазы</p>
                </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/athletes/01/02.jpg"></div>
                <div class="slide-info">
                    <h4>Әскербай Әлихан Аманкелдіұлы ${i+1}</h4>
                    <p style="color:#777">Жасөспірімдер арасында 2025 жылғы Азия ойындарының жеңімпазы</p>
                </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/athletes/01/01.jpg"></div>
                <div class="slide-info">
                    <h4>Құрманбек Ақжол ${i+1}</h4>
                    <p style="color:#777">Жастар арасында Азия чемпиоантының күміс жүлдегері</p>
                </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/athletes/01/13.png"></div>
                <div class="slide-info">
                    <h4>Горичева Карина Хаважевна${i+1}</h4>
                    <p style="color:#777">2016 жылғы Рио-да-Жанейрода өткен Олимпиада ойындарының қола жүлдегері</p>
                </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/athletes/08/01.jpg"></div>
                <div class="slide-info">
                    <h4>Абдуллин Ильфат ${i+1}</h4>
                    <p style="color:#777">Спорт шебері <br>	Садақ атудан Ересектер арасында Азия чемпионатының күміс </p>
                </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/athletes/08/02.jpg"></div>
                <div class="slide-info">
                    <h4>Жаңбырбай Дәулеткелді${i+1}</h4>
                    <p style="color:#777">Спорт шебері <br>Садақ атудан Ересектер арасында Азия чемпионатының күміс </p>
                </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/athletes/04/33.jpg"></div>
                <div class="slide-info">
                    <h4>Егінбайқызы Құралай${i+1}</h4>
                    <p style="color:#777">Халықаралық дәрежедегі спорт шебері<br>Бокстан Жастар арасында Азия чемпионатының женімпазы</p>
                </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/athletes/03/16.jpg"></div>
                <div class="slide-info">
                    <h4>Берліқаш Камила Талғатқызы ${i+1}</h4>
                    <p style="color:#777">Дзюдо спорт түрінен Қазақстан республикасының чемпионатының күміс жүлдегері</p>
                </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/athletes/05/01.jpg"></div>
                <div class="slide-info">
                    <h4>Жаңабек Есенбол${i+1}</h4>
                    <p style="color:#777">2025 жылғы ересектер арасында Кросстан Қазақстан Республикасының жеңімпазы</p>
                </div>
            </div>
            <div class="slide-card">
                <div class="slide-img"><img src="./media/athletes/10/05.jpg"></div>
                <div class="slide-info">
                    <h4>Федоров Евгений${i+1}</h4>
                    <p style="color:#777">2025 жылғы ересектер арасында Азия чемпионатының жеңімпазы</p>
                </div>
            </div>`;
    }
}

function showSlider(type) {
    // Барлық батырмалардан active алу
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    // Басылғанға active беру (event арқылы)
    if(event) event.target.classList.add('active');

    const cSlider = document.getElementById('coaches-slider');
    const aSlider = document.getElementById('athletes-slider');

    if(type === 'coaches') {
        cSlider.classList.remove('hidden-slider');
        cSlider.classList.add('active-slider');
        aSlider.classList.add('hidden-slider');
        aSlider.classList.remove('active-slider');
    } else {
        cSlider.classList.add('hidden-slider');
        cSlider.classList.remove('active-slider');
        aSlider.classList.remove('hidden-slider');
        aSlider.classList.add('active-slider');
    }
}

function scrollSlider(id, val) {
    document.getElementById(id).scrollBy({left: val, behavior: 'smooth'});
}

/* --- 2. ЛОГИН ЖӘНЕ ПАНЕЛЬДЕР --- */

function changeLang(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
    localStorage.setItem('lang', lang);
}

function handleLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const user = users.find(x => x.user === u && x.pass === p);

    if (user) {
        document.getElementById('login-section').classList.add('hidden');
        if (user.role === 'admin') {
            document.getElementById('admin-panel').classList.remove('hidden');
            renderSportsAdmin();
        } else {
            document.getElementById('coach-panel').classList.remove('hidden');
            initCoachPanel(user);
        }
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

/* --- 3. АДМИН ЛОГИКАСЫ --- */

function renderSportsAdmin() {
    const grid = document.getElementById('sports-grid-admin');
    grid.innerHTML = '';
    sports.forEach(s => {
        grid.innerHTML += `
            <div class="sport-item" onclick="showCoaches('${s.name}')">
                <i class="fa-solid ${s.icon}"></i>
                <h4>${s.name}</h4>
            </div>`;
    });
}

function showCoaches(sportName) {
    document.getElementById('sports-view').classList.add('hidden');
    document.getElementById('coaches-view').classList.remove('hidden');
    document.getElementById('selected-sport-title').innerText = `${sportName} бапкерлері:`;
    
    const list = document.getElementById('coaches-list-admin');
    list.innerHTML = '';
    const coaches = users.filter(u => u.role === 'coach' && u.sport === sportName);

    if (coaches.length > 0) {
        coaches.forEach(c => {
            list.innerHTML += `
                <div class="item" onclick="manageCoach(${c.id})" style="cursor:pointer; padding:15px; border-bottom:1px solid #ddd;">
                    <strong>${c.name}</strong> <span style="float:right; color:blue;">Басқару ></span>
                </div>`;
        });
    } else {
        list.innerHTML = '<p>Бапкер жоқ.</p>';
    }
}

function goBackToSports() {
    document.getElementById('coaches-view').classList.add('hidden');
    document.getElementById('sports-view').classList.remove('hidden');
}

let currentCoachId = null;
function manageCoach(cId) {
    currentCoachId = cId;
    const coach = users.find(u => u.id === cId);
    document.getElementById('coaches-view').classList.add('hidden');
    document.getElementById('manager-view').classList.remove('hidden');
    document.getElementById('manager-coach-name').innerText = coach.name;
    renderCoachAthletesTable();
}

function goBackToCoaches() {
    document.getElementById('manager-view').classList.add('hidden');
    document.getElementById('coaches-view').classList.remove('hidden');
}

function saveEvent() {
    const name = document.getElementById('event-name').value;
    const loc = document.getElementById('event-loc').value;
    const date = document.getElementById('event-dates').value;
    const type = document.getElementById('event-type').value;

    const coach = users.find(u => u.id === currentCoachId);
    coach.event = { type, name, loc, date };
    alert("Тапсырма бапкерге жіберілді!");
}

function addAthleteToCoach() {
    const name = document.getElementById('new-ath-name').value;
    const dob = document.getElementById('new-ath-dob').value;
    if(name) {
        athletes.push({ id: Date.now(), name, dob, coachId: currentCoachId, img: "https://randomuser.me/api/portraits/lego/1.jpg" });
        alert("Спортшы қосылды!");
        renderCoachAthletesTable();
        document.getElementById('new-ath-name').value = '';
    }
}

function renderCoachAthletesTable() {
    const list = document.getElementById('coach-athletes-table');
    list.innerHTML = '';
    athletes.filter(a => a.coachId === currentCoachId).forEach(a => {
        list.innerHTML += `<div class="item">${a.name} (${a.dob})</div>`;
    });
}

function exportExcel() { alert("Excel файл жүктелді!"); }

/* --- 4. БАПКЕР ЛОГИКАСЫ --- */

function initCoachPanel(user) {
    document.getElementById('coach-welcome').innerText = `Бапкер: ${user.name}`;
    const eventBox = document.getElementById('c-event-info');
    const mapLink = document.getElementById('c-map-link');
    const checkBlock = document.getElementById('admin-check-block');

    // Бапкерде оқиға бар ма? (Бар болса, батырманы көрсетеміз)
    if(user.event) {
        eventBox.innerHTML = `<strong>${user.event.type}:</strong> ${user.event.name}<br><strong>Уақыты:</strong> ${user.event.date}`;
        if(user.event.loc) {
            mapLink.href = user.event.loc;
            mapLink.classList.remove('hidden');
            checkBlock.classList.remove('hidden'); // <-- БҰЛ ЖЕРДЕ БАТЫРМА ШЫҒАДЫ
        }
    } else {
        eventBox.innerText = "Әзірге іс-шара жоқ.";
        mapLink.classList.add('hidden');
        checkBlock.classList.add('hidden');
    }

    // Спортшылар тізімі
    const list = document.getElementById('my-athletes-list');
    list.innerHTML = '';
    athletes.filter(a => a.coachId === user.id).forEach(a => {
        list.innerHTML += `
            <div class="item">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${a.img}" style="width:40px; height:40px; border-radius:50%;">
                    <div>${a.name}</div>
                </div>
                <div class="photo-btn-group">
                    <label for="f-${a.id}" class="verify-label" id="l-${a.id}">📸 Растау</label>
                    <input type="file" id="f-${a.id}" accept="image/*" capture="camera" onchange="verified(${a.id})" style="display:none;">
                </div>
            </div>`;
    });
}

function confirmArrival() {
    const btn = document.getElementById('arrive-btn');
    btn.innerText = "✅ Расталды";
    btn.style.background = "green";
    alert("Орналасқан жеріңіз Админге жіберілді!");
}

function verified(id) {
    const lbl = document.getElementById(`l-${id}`);
    lbl.innerText = "✅ Фото жіберілді";
    lbl.style.background = "green";
}

function logout() { location.reload(); }