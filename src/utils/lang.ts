interface Translations {
  [lang: string]: { [key: string]: string };
}

export const disciplineTranslations: Translations = {
  ru: {
    Weightlifting: "Тяжёлая атлетика",
    Boxing: "Бокс",
    Athletics: "Лёгкая атлетика",
    Taekwondo: "Тхэквондо",
    SportsClimbing: "Скалолазание",
    GrecoRomanWrestling: "Греко-римская борьба",
    Judo: "Дзюдо",
    Curling: "Кёрлинг",
    CycleSport: "Велоспорт",
    Archery: "Стрельба из лука",
    FreestyleWrestling: "Вольная борьба"
  },
  kk: {
    Weightlifting: "Ауыр атлетика",
    Boxing: "Бокс",
    Athletics: "Жеңіл атлетика",
    Taekwondo: "Тхэквондо",
    SportsClimbing: "Спорттық құзға өрмелеу",
    GrecoRomanWrestling: "Грек-рим күресі",
    Judo: "Дзюдо",
    Curling: "Кёрлинг",
    CycleSport: "Велоспорт",
    Archery: "Садақ ату",
    FreestyleWrestling: "Еркін күрес"
  },
};

export const adminTranslations: Translations = {
  ru: {
    adminPanel: "Панель администратора",
    PickSport: "Выберите вид спорта",
    logout: "Выход",
    chs: "тренеры",
    chsEmpty: "Тренеров нет",
    backToSports: "← Назад к дисциплинам",
    control: "Управление",
    EventSelector: "Назначение соревнований/сборов",
    EventType1: "Учебно-тренировочный сбор",
    EventType2: "Соревнование",
    EventName: "Название события",
    EventPlace: "Место проведения (ссылка на Yandex карты)",
    EventDate: "Время (ПК.АА-КК.АА)",
    EventRules: "Правило (PDF):",
    Protocol: "Протокол (PDF):",
    AddEvent: "Добавить событие",
    AddStudent: "Добавить спортсмена",
    addCoach: "Добавить тренера",
    Add: "Добавить",
    StudentList: "Список зарегистрированных спортсменов",
    GoBack: "← Назад",
    studentFirstName: "Имя",
    studentLastName: "Фамилия",
    studentMiddleName: "Отчество",
    studentPhoneNumber: "Номер телефона"
  },
  kk: {
    adminPanel: "Админ Панелі",
    PickSport: "Спорт түрін таңдаңыз",
    logout: "Шығу",
    chs: "бапкерлері",
    chsEmpty: "Бапкер жоқ",
    backToSports: "← Спорт түрлеріне қайту",
    control: "Басқару",
    EventSelector: "Жарыс/Жиын тағайындау",
    EventType1: "Оқу-жаттығу жиыны",
    EventType2: "Жарыс",
    EventName: "Атауы",
    EventPlace: "Өтетін жері (Yandex сілтемесі)",
    EventDate: "Уақыты (КК.АА - КК.АА)",
    EventRules: "Ереже (PDF):",
    Protocol: "Хаттама (PDF):",
    AddEvent: "Тағайындау",
    AddStudent: "Спортшы қосу",
    addCoach: "Жаттықтырушы қосыңыз",
    Add: "Қосу",
    StudentList: "Тіркелген спортшылар тізімі",
    GoBack: "← Артқа",
    studentFirstName: "Аты",
    studentLastName: "Тегі",
    studentMiddleName: "Әкесінің аты",
    studentPhoneNumber: "Телефон нөмірі"
  },
}

export const loginTranslations: Translations = {
  ru: {
    logInSystem: "Войдите в систему",
    passwd: "Пароль",
    login: "Войти",
    BackToSite: "← Вернуться на сайт"
  },
  kk: {
    logInSystem: "Жүйеге кіру",
    passwd: "Құпия сөз",
    login: "Кіру",
    BackToSite: "← Сайтқа қайту"
  }
}

