let currentLang = 'KZ';

function toggleLang() {
  const title = document.getElementById('formTitle');
  const userInp = document.getElementById('username');
  const passInp = document.getElementById('password');
  const loginBtn = document.querySelector('.login-btn');
  const regLink = document.getElementById('registerLink');
  const langBtn = document.getElementById('langBtn');

  if (currentLang === 'KZ') {
    title.innerText = "Войти в систему";
    userInp.placeholder = "Логин";
    passInp.placeholder = "Пароль";
    loginBtn.innerText = "Войти";
    regLink.innerText = "Регистрация";
    langBtn.innerText = "RU / KZ";
    currentLang = 'RU';
  } else {
    title.innerText = "ЖҮЙЕГЕ КІРУ";
    userInp.placeholder = "Логин";
    passInp.placeholder = "Құпия сөз";
    loginBtn.innerText = "КІРУ";
    regLink.innerText = "Тіркелу";
    langBtn.innerText = "KZ / RU";
    currentLang = 'KZ';
  }
}

function showAlert(resp) {
  switch (currentLang) {
    case "KZ":
      if(!resp.ok) {
        alert("Қате! Логин немесе пароль дұрыс емес.");
      } else {
        alert(`Қош келдіңіз, Админ!`);
      }
      break;
    case "RU":
      if(!resp.ok) {
        alert("Ошибка! Неправильный Логин или пароль.");
      } else {
        alert(`Добро пожаловать, `)
      }
      break;
  }
}

// document.getElementById('loginForm').addEventListener('submit', async function(event) {
//   event.preventDefault(); // Форманың автоматты түрде қайта жүктелуін тоқтатады
//   const userValue = document.getElementById('username').value;
//   const passValue = document.getElementById('password').value;
//
//   const url = "http://localhost:3000";
//   const resp = await fetch(`${url}/auth/login`, {
//     method: 'POST',
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username: userValue, password: passValue}),
//   });
//
//   showAlert(resp);
//
//   console.log(resp);
// });


// document.getElementById('loginForm').addEventListener('submit', function(event) {
//   event.preventDefault(); // Форманың автоматты түрде қайта жүктелуін тоқтатады
//
//   const userValue = document.getElementById('username').value;
//   const passValue = document.getElementById('password').value;
//
//   (async () => {
//     const url = "http://localhost:3000";
//     const resp = await fetch(`${url}/auth/login`, {
//       method: 'POST',
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username: userInp.value, password: passInp.value }),
//     });
//     console.log(resp);
//   })
//
//   // Тексеру шарты
//   if (userValue === 'Admin' && passValue === 'Admin') {
//     alert("Қош келдіңіз, Админ!");
//     // Келесі бетке өту (dashboard.html деген файл болуы керек немесе кез келген сілтеме)
//     window.location.href = "dashboard.html";
//   } else {
//     // Қате болған жағдайда ескерту
//     alert("Қате! Логин немесе пароль дұрыс емес.");
//   }
// });
