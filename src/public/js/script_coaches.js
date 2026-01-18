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
  console.log(dataList);

  document.getElementById('mainTitle').innerText = translations[currentLang].main;
  document.getElementById('addCoachBtnTxt').innerText = translations[currentLang].addC;

  dataList.forEach((c, cIdx) => {
    // Create coach card
    const coachCard = document.createElement("div");
    coachCard.className = "coach-card";

    // --- Coach main info ---
    const coachMainInfo = document.createElement("div");
    coachMainInfo.className = "coach-main-info";

    // Coach avatar
    const coachImg = document.createElement("img");
    coachImg.src = c.coach.avatar || "https://via.placeholder.com/80";
    coachImg.id = "cAvatar";
    coachImg.name = c.coach.avatarId;
    coachImg.className = "coach-img-circle";

    // Hidden coachId input
    const coachIdInput = document.createElement("input");
    coachIdInput.type = "hidden";
    coachIdInput.id = "coachId";
    coachIdInput.value = c.coach.id;

    // Coach name and role
    const coachInfoDiv = document.createElement("div");
    const coachName = document.createElement("h3");
    coachName.textContent = `${c.coach.firstName} ${c.coach.lastName}`;

    const coachRole = document.createElement("p");
    coachRole.style.color = "#aaa";
    coachRole.textContent = c.coach.role;

    coachInfoDiv.appendChild(coachName);
    coachInfoDiv.appendChild(coachRole);

    // Coach action buttons
    const coachActions = document.createElement("div");
    coachActions.style.marginLeft = "auto";

    const coachEdit = document.createElement("i");
    coachEdit.className = "fas fa-edit";
    coachEdit.style = "color:orange; cursor:pointer; margin-right:15px";
    coachEdit.addEventListener("click", () => openCoachModal("PATCH", c.coach, c.events));

    const coachDelete = document.createElement("i");
    coachDelete.className = "fas fa-trash";
    coachDelete.style = "color:red; cursor:pointer";
    coachDelete.addEventListener("click", () => deleteCoach(cIdx));

    coachActions.appendChild(coachEdit);
    coachActions.appendChild(coachDelete);

    // Assemble coach main info
    coachMainInfo.appendChild(coachImg);
    coachMainInfo.appendChild(coachIdInput);
    coachMainInfo.appendChild(coachInfoDiv);
    coachMainInfo.appendChild(coachActions);

    // --- Event details ---
    const eventDetails = document.createElement("div");
    eventDetails.className = "event-details";

    const eventDiv = document.createElement("div");
    eventDiv.innerHTML = `<b>${translations[currentLang].event}</b> ${c.events.eventName}`;
    eventDiv.name = c.events.id;
    eventDiv.id = "cEventId";

    const telDiv = document.createElement("div");
    telDiv.innerHTML = `<b>${translations[currentLang].tel}</b> ${c.coach.phoneNumber}`;

    const dateDiv = document.createElement("div");
    dateDiv.innerHTML = `<b>${translations[currentLang].date}</b> ${c.events.startDate} / ${c.events.endDate}`;
    dateDiv.id = "cEventDate";

    const geoDiv = document.createElement("div");
    geoDiv.innerHTML = `<b>${translations[currentLang].geo}</b> <a href="${c.geo}" target="_blank" class="geo-link">🗺 Карта</a>`;

    eventDetails.appendChild(eventDiv);
    eventDetails.appendChild(telDiv);
    eventDetails.appendChild(dateDiv);
    eventDetails.appendChild(geoDiv);

    // --- Add athlete button ---
    const addAthleteBtn = document.createElement("button");
    addAthleteBtn.className = "save-btn";
    addAthleteBtn.style.width = "auto";
    addAthleteBtn.style.padding = "5px 15px";
    addAthleteBtn.textContent = "+ Спортшы";
    addAthleteBtn.addEventListener("click", () => openAthModal(c.coach.id));

    // --- Athlete grid ---
    const athleteGrid = document.createElement("div");
    athleteGrid.className = "athlete-grid";

    (c.students || []).forEach((a, aIdx) => {
      const athleteCard = document.createElement("div");
      athleteCard.className = "athlete-card";

      // Athlete avatar
      const aImg = document.createElement("img");
      aImg.src = a.photos[0].url || "https://via.placeholder.com/50";
      aImg.id = "aAvatar";
      aImg.name = a.avatarId;
      aImg.className = "athlete-thumb";

      // Athlete info
      const aInfo = document.createElement("div");
      aInfo.style.fontSize = "12px";
      aInfo.innerHTML = `<b>${a.firstName}</b><br>${new Date(a.dateOfBirth).toLocaleDateString()}`;

      // Athlete actions
      const aActions = document.createElement("div");
      aActions.style.marginLeft = "auto";

      const aEdit = document.createElement("i");
      aEdit.className = "fas fa-edit";
      aEdit.style.color = "orange";
      aEdit.style.cursor = "pointer";
      aEdit.addEventListener("click", () => openAthModal(cIdx, aIdx));

      const aDelete = document.createElement("i");
      aDelete.className = "fas fa-trash";
      aDelete.style.color = "red";
      aDelete.style.cursor = "pointer";
      aDelete.addEventListener("click", () => deleteAth(cIdx, aIdx));

      aActions.appendChild(aEdit);
      aActions.appendChild(aDelete);

      athleteCard.appendChild(aImg);
      athleteCard.appendChild(aInfo);
      athleteCard.appendChild(aActions);

      athleteGrid.appendChild(athleteCard);
    });

    // --- Assemble coach card ---
    coachCard.appendChild(coachMainInfo);
    coachCard.appendChild(eventDetails);
    coachCard.appendChild(addAthleteBtn);
    coachCard.appendChild(athleteGrid);

    // Append to main list
    list.appendChild(coachCard);
  });
}

document.getElementById('athleteForm').onsubmit = async (e) => {
  e.preventDefault();
  const fullName = document.getElementById('aName').value;
  const firstName = document.getElementById('aFristName');
  const lastName = document.getElementById('aLastName');
  const dateOfBirth = document.getElementById('aDob');
  const coachId = document.getElementById('coachId');
  [firstName.value, lastName.value] = fullName.split(" ");
  fullName.disabled = true;

  const phone = document.getElementById('aPhone');
  const phoneConverted = itiStudent.getNumber();
  phone.value = phoneConverted;
  const imgInput = document.getElementById("aPhoto");

  if (imgInput.files && imgInput.files.length > 0) {
    const img = imgInput.files[0];

    const imgData = new FormData();
    imgData.append("avatar", img);

    const imgResp = await fetch("/api/files/upload", {
      method: "POST",
      body: imgData,
    });

    const imgRespData = await imgResp.json();

    await fetch('/api/auth/registerStudent', {
      method: "POST",
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        dateOfBirth: dateOfBirth.value,
        phoneNumber: phone.value,
        coachId: parseInt(coachId.value),
        image: {
          mimeType: imgRespData.mimeType,
          size: imgRespData.size,
          filename: imgRespData.filename,
          url: imgRespData.url,
        },
      }),
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin"
    });
  }
}

function save() {
  localStorage.setItem('sportDB', JSON.stringify(db));
  render();
  closeModal('coachModal');
  closeModal('athleteModal');
}

function openCoachModal(reqMethod, coach, events) {

  if (reqMethod === "PATCH") {
    if (!document.getElementById('passRepeat')) {
      const passRepeat = document.createElement('input');
      passRepeat.type = "password";
      passRepeat.id = "passRepeat";
      passRepeat.placeholder = "repeat password";
      const authBox = document.getElementById('credentials');
      authBox.appendChild(passRepeat);
    }
  }

  document.getElementById('coachModal').style.display = 'block';

  const fullName = `${coach.firstName} ${coach.lastName}`;
  const geo = `${events.latitule} ${events.longitude}`

  document.getElementById('cName').value = fullName;
  document.getElementById('cRole').value = coach.role;
  document.getElementById('cPhone').value = coach.phoneNumber;
  document.getElementById('cEvent').value = events.eventName;
  document.getElementById('cGeo').value = geo;
  document.getElementById('cStart').value = events.startDate;
  document.getElementById('cEnd').value = events.endDate;
  document.getElementById('cLogin').value = coach.username;

  document.getElementById('coachForm').onsubmit = async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('cName').value;
    const username = document.getElementById('cLogin').value;
    const password = document.getElementById('cPass').value;
    const role = document.getElementById('cRole').value;
    const eventName = document.getElementById('cEvent').value;
    const startDate = document.getElementById('cStart').value;
    const endDate = document.getElementById('cEnd').value;
    const geo = document.getElementById('cGeo').value;
    const latitule = document.getElementById('cLatitule');
    const longitude = document.getElementById('cLongitute');
    const firstName = document.getElementById('cFristName');
    const lastName = document.getElementById('cLastName');
    const phone = document.getElementById('cPhone');
    const eventId= document.getElementById('cEventId').name;
    phone.value = itiCoach.getNumber();
    [firstName.value, lastName.value] = fullName.split(" ");
    [latitule.value, longitude.vale] = geo.split(" ");

    fullName.disabled = true;

    if (reqMethod === 'PATH') {
      const imgInput = document.getElementById("cPhoto");

      if (imgInput.files && imgInput.files.length > 0) {
        const img = imgInput.files[0];

        const imgData = new FormData();
        imgData.append("avatar", img);

        const imgResp = await fetch("/api/files/upload", {
          method: reqMethod,
          body: imgData,
        });

        const imgRespData = await imgResp.json();

        await fetch('/api/auth/register', {
          method: reqMethod,
          body: JSON.stringify({
            username: username,
            password: password,
            role: role,
            firstName: firstName.value,
            lastName: lastName.value,
            phoneNumber: phone.value,
            image: {
              mimeType: imgRespData.mimeType,
              filename: imgRespData.filename,
              size: imgRespData.size,
              url: imgRespData.url,
            },
          }),
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin"
        });
      } else {
        await fetch('/api/auth/register', {
          method: reqMethod,
          body: JSON.stringify({
            username: username,
            password: password,
            role: role,
            firstName: firstName.value,
            lastName: lastName.value,
            phoneNumber: phone.value,
          }),
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin"
        });
        await fetch('/api/admin/addEvent', {
          method: reqMethod,
          body: {
            eventName: eventName,
            eventId: eventId,
            latitule: latitule,
            longitude: longitude,
            startDate: startDate,
            endDate: endDate,
          },
        });
      };
    } else {
      await fetch('/api/auth/register', {
        method: reqMethod,
        body: JSON.stringify({
          username: username,
          password: password,
          role: role,
          firstName: firstName.value,
          lastName: lastName.value,
          phoneNumber: phone.value,
          image: {
            mimeType: imgRespData.mimeType,
            filename: imgRespData.filename,
            size: imgRespData.size,
            url: imgRespData.url,
          },
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin"
      });
      await fetch('/api/admin/eventUpdate', {
        method: reqMethod,
        body: {
          eventName: eventName,
          latitule: latitule,
          longitude: longitude,
          startDate: startDate,
          endDate: endDate,
        },
      });
    };
  }
}

function openAthModal(cIdx, aIdx = null) {
  document.getElementById('athleteModal').style.display = 'block';
  document.getElementById('targetCIndex').value = cIdx;
  if (aIdx !== null) {
    const a = db[selectedSport][cIdx].athletes[aIdx];
    document.getElementById('aName').value = a.name;
    document.getElementById('aDob').value = a.dob;
    document.getElementById('editAIndex').value = aIdx;
  } else {
    document.getElementById('athleteForm').reset();
    document.getElementById('editAIndex').value = "";
  }
}

function deleteCoach(i) { if (confirm('Өшіру?')) { db[selectedSport].splice(i, 1); save(); } }
function deleteAth(ci, ai) { db[selectedSport][ci].athletes.splice(ai, 1); save(); }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

render();
