// implement input time and date
const time = document.querySelector(".time");
const dateContent = document.querySelector(".date");
let leng = "en";
leng = localStorage.getItem("lenguage");
let hash;

function showData() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  let currentDate;
  if (hash === "ru") {
    currentDate = date.toLocaleDateString("ru-RU", options);
  } else {
    currentDate = date.toLocaleDateString("en-US", options);
  }
  time.textContent = currentTime;
  dateContent.textContent = currentDate;
  setTimeout(showData, 1000);
}
showData();

//implement input greetings
const greet = document.querySelector(".greeting");
let n;

function getTimeOfDay() {
  const hours = new Date().getHours();
  const timesOfDay = ["night", "morning", "afternoon", "evening"];
  n = Math.floor(hours / 6);
  const timesOfDayRu = [
    "Доброй ночи",
    "Доброго утра",
    "Добрый день",
    "Добрый вечер",
  ];
  if (hash === "ru") {
    greet.textContent = `${timesOfDayRu[n]}`;
  } else {
    greet.textContent = `Good ${timesOfDay[n]}`;
  }
  setTimeout(getTimeOfDay, 1000);
}
getTimeOfDay();
//вывесть время суток без записи
function getTimeOfDay2() {
  const hours = new Date().getHours();
  const timesOfDay = ["night", "morning", "afternoon", "evening"];
  n = Math.floor(hours / 6);
  return timesOfDay[n];
}

//implement input name
const name = document.querySelector(".name");

function setLocalStorage() {
  localStorage.setItem("name", name.value);
}
window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem("name")) {
    name.value = localStorage.getItem("name");
  }
}
window.addEventListener("load", getLocalStorage);

////implement slider
const body = document.querySelector("body");
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");
let randomNum;

const getRandomNum = () => {
  let ramdom = Math.floor(Math.random() * (21 - 1) + 1);
  ramdom = String(ramdom).padStart(2, "0");
  return ramdom;
};
let numberPhoto = getRandomNum();

//Getting background image from gitHab

const setBg = (number) => {
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/FilMaxim/Photo_Momentum/assets/images/${getTimeOfDay2()}/${number}.jpg`;
  img.onload = () => {
    body.style.backgroundImage = `url('https://raw.githubusercontent.com/FilMaxim/Photo_Momentum/assets/images/${getTimeOfDay2()}/${number}.jpg')`;
  };
  console.log(img.src)
};
const getSlideNextGitHub = () => {
  numberPhoto = Number(numberPhoto) + 1;
  numberPhoto = String(numberPhoto).padStart(2, "0");
  if (numberPhoto === "21") {
    numberPhoto = "01";
  }
  setBg(numberPhoto);
};

const getSlidePrevGitHub = () => {
  numberPhoto = Number(numberPhoto) - 1;
  numberPhoto = String(numberPhoto).padStart(2, "0");
  if (numberPhoto === "00") {
    numberPhoto = "20";
  }
  setBg(numberPhoto);
};

//Getting background image from Unsplash API
async function getLinkToImageUnsplash() {
  console.log("loading Unsplash API");
  const url = `https://api.unsplash.com/photos/random?query=${getTag()}&client_id=MJNOnrkkvdQ4ROsPpbqcYtfMIay0c5mM8OJBL4YVX3o`;
  const res = await fetch(url);
  const data = await res.json();
  const img = new Image();
  img.src = data.urls.regular;

  img.onload = () => {
    body.style.backgroundImage = `url('${data.urls.regular}')`;
    console.log(url);
  };
  //setTimeout(getLinkToImageUnsplash, 3000);
}

const getSlideNextUnsplash = () => {
  getLinkToImageUnsplash();
};

const getSlidePrevUnsplash = () => {
  getLinkToImageUnsplash();
};

//Getting background image from с Flickr API
const getRandomNumFlickr = () => {
  let ramdom = Math.floor(Math.random() * (100 - 1) + 1);
  return ramdom;
};
let numberPhotoFlickr = getRandomNumFlickr();

async function getLinkToImageFlickr(numberPhotoFlickr) {
  console.log("loading Flickr API");
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=f45557732f991d0c5b92eedaba1c3014&tags=${getTag()}&extras=url_l&format=json&nojsoncallback=1`;
  const res = await fetch(url);
  const data = await res.json();
  const img = new Image();
  img.src = data.photos.photo[numberPhotoFlickr].url_l;

  img.onload = () => {
    body.style.backgroundImage = `url('${data.photos.photo[numberPhotoFlickr].url_l}')`;
  };
  console.log(url);
}

const getSlideNextFlickr = () => {
  numberPhotoFlickr += 1;
  if (numberPhotoFlickr === 99) {
    numberPhotoFlickr = 0;
  }
  getLinkToImageFlickr(numberPhotoFlickr);
};

const getSlidePrevFlickr = () => {
  numberPhotoFlickr -= 1;
  if (numberPhotoFlickr === 0) {
    numberPhotoFlickr = 99;
  }
  getLinkToImageFlickr(numberPhotoFlickr);
};

//получить выбранное поьзователем фото ресурc
const settingApi = document.querySelector(".selectApi");
let dataApi = document.querySelector(".selectApi").value;

const returnApi = () => {
  dataApi = document.querySelector(".selectApi").value;
  document.querySelector(".selectApi").value = dataApi;
  updateBG();
};
settingApi.addEventListener("change", returnApi);

function updateBG() {
  if (dataApi === "Unsplash API") {
    getLinkToImageUnsplash();
    slideNext.onclick = getSlideNextUnsplash;
    slidePrev.onclick = getSlidePrevUnsplash;
    document.querySelector(".input_tags").disabled = 0;
  } else if (dataApi === "Flickr API") {
    getLinkToImageFlickr(numberPhotoFlickr);
    slideNext.onclick = getSlideNextFlickr;
    slidePrev.onclick = getSlidePrevFlickr;
    document.querySelector(".input_tags").disabled = 0;
  } else {
    setBg(numberPhoto);
    slideNext.onclick = getSlideNextGitHub;
    slidePrev.onclick = getSlidePrevGitHub;
    document.querySelector(".input_tags").value = "";
    document.querySelector(".input_tags").disabled = 1;
  }
}

// теги для фото
const tegsPhoto = document.querySelector(".input_tags").value;

let tegs;
function getTag() {
  tegs = getTimeOfDay2();
  if (document.querySelector(".input_tags").value) {
    tegs = document.querySelector(".input_tags").value;
  }
  return tegs;
}
document.querySelector(".input_tags").addEventListener("change", getTag);

//weather widget
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const error = document.querySelector(".weather-error");
const city = document.querySelector(".city");

async function getWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${hash}&appid=2cab9818f85d7682be1992f8fa802fe4&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    if (hash === "ru") {
      wind.textContent = `Скорость ветра: ${Math.round(data.wind.speed)}м/с`;
      humidity.textContent = `Влажность: ${data.main.humidity}%`;
    } else {
      wind.textContent = `Wind speed: ${Math.round(data.wind.speed)}m/s`;
      humidity.textContent = `Humidity: ${data.main.humidity}%`;
    }

    error.textContent = ``;
  } catch (e) {
    error.textContent = `Error! city not found for ${city.value}!`;
    alert("ERROR: Specify Existing City");
    temperature.textContent = "";
    weatherDescription.textContent = "";
    wind.textContent = ``;
    humidity.textContent = ``;
  }
}

city.addEventListener("change", getWeather);

function setLocalStorageCity() {
  localStorage.setItem("city", city.value);
}
window.addEventListener("beforeunload", setLocalStorageCity);

function getLocalStorageCity() {
  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
    getWeather();
  }
}
window.addEventListener("load", getLocalStorageCity);

//quote of the Day
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const change = document.querySelector(".change-quote");
let randomQuote;

const randomQuoteFun = () => {
  randomQuote = Math.floor(Math.random() * (101 - 0) + 0);
};
randomQuoteFun();

async function getQuotes() {
  const quotes = `data${leng}.json`;
  const res = await fetch(quotes);
  const data = await res.json();
  quote.textContent = `${data[randomQuote].quote}`;
  author.textContent = `${data[randomQuote].author}`;
}

getQuotes();
change.addEventListener("click", function onloadQuate() {
  randomQuoteFun();
  getQuotes();
});

//Audioplayer
const play = document.querySelector(".play");
const playNextBtn = document.querySelector(".play-next");
const playPrevBtn = document.querySelector(".play-prev");
let isPlay = false;
let playNum = 0;
let timePause = 0;
const audio = new Audio();

function playAudio() {
  if (!isPlay) {
    audio.src = playList[playNum].src;
    audio.currentTime = timePause;
    audio.play();
    isPlay = true;
    play.classList.add("pause");
  } else if (isPlay) {
    audio.pause();
    isPlay = false;
    timePause = audio.currentTime;
    play.classList.remove("pause");
  }
  addActiveLi(playNum);
}
play.addEventListener("click", playAudio);

const playNext = () => {
  playNum += 1;
  if (playNum === playList.length) {
    playNum = 0;
  }
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  audio.play();
  play.classList.add("pause");
  isPlay = true;
  addActiveLi(playNum);
};
const playPrev = () => {
  playNum -= 1;
  if (playNum === -1) {
    playNum = playList.length - 1;
  }
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  audio.play();
  play.classList.add("pause");
  isPlay = true;
  addActiveLi(playNum);
};

playNextBtn.addEventListener("click", playNext);
playPrevBtn.addEventListener("click", playPrev);
audio.addEventListener("ended", playNext);

//playlist
import playList from "./playList.js";
const playListContainer = document.querySelector(".play-list");

const addList = () => {
  for (let i = 0; i < playList.length; i++) {
    const li = document.createElement("li");
    li.classList.add("play-item");
    playListContainer.append(li);
    li.textContent = `${playList[i].title}`;
  }
};
addList();

const liElem = document.querySelector(".play-list").children;

//добавляем классы li
const addActiveLi = (playNum) => {
  for (let i = 0; i < liElem.length; i++) {
    if (i === playNum) {
      liElem[i].classList.add("item-active");
    } else {
      liElem[i].classList.remove("item-active");
    }
  }
};

//зупуск и остановка li
const playLi = () => {
  for (let i = 0; i < liElem.length; i++) {
    isPlay = false;
    liElem[i].addEventListener("click", (e) => {
      playNum = i;

      if (liElem[playNum].classList.contains("item-active")) {
        isPlay = true;

        playAudio();
        liElem[playNum].classList.remove("item-active");
      } else {
        isPlay = false;
        playAudio();
      }
    });
  }
};
playLi();

playNum = 0;

//advanced player
setInterval(() => {
  const progressBar = document.querySelector(".progress");
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  document.querySelector(".current").textContent = getTimeCodeFromNum(
    audio.currentTime
  );
}, 500);

function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;
  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}

audio.addEventListener(
  "loadeddata",
  () => {
    document.querySelector(".length").textContent = getTimeCodeFromNum(
      audio.duration
    );
    audio.volume = 0.75;
    document.querySelector(
      ".name_track"
    ).textContent = `${playList[playNum].title}`;
  },
  false
);

//click on timeline to skip around
const timeline = document.querySelector(".timeline");
timeline.addEventListener(
  "click",
  (e) => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
    audio.currentTime = timeToSeek;
  },
  false
);

//click volume slider to change volume
document.querySelector(".volume-button").addEventListener("click", () => {
  const volumeEl = document.querySelector(".volume");
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeEl.classList.remove("icono-volumeMedium");
    volumeEl.classList.add("icono-volumeMute");

    document.querySelector(".volume-percentage").style.width = 0 + "%";
  } else {
    volumeEl.classList.add("icono-volumeMedium");
    volumeEl.classList.remove("icono-volumeMute");
    document.querySelector(".volume-percentage").style.width = 75 + "%";
  }
});

//click volume slider to change volume
const volumeSlider = document.querySelector(".volume-slider");
volumeSlider.addEventListener(
  "click",
  (e) => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    document.querySelector(".volume-percentage").style.width =
      newVolume * 100 + "%";
  },
  false
);

document
  .querySelector(".volume_container")
  .addEventListener("mouseover", () => {
    volumeSlider.classList.add("hover_volume");
  });
document.querySelector(".volume_container").addEventListener("mouseout", () => {
  volumeSlider.classList.remove("hover_volume");
});

//setting
const setting = document.querySelector(".container_settings");

let enableDiv = "on";
let disableDiv = "off";

const checkClick = (event) => {
  event.preventDefault()
  const hideElement = (element) => {

    if (
      !document.querySelector(`.${element}`).classList.contains("remove_div") &&
      event.target.closest(`.${element}_btn`)
    ) {
      event.target.textContent = disableDiv;
      document.querySelector(`.${element}`).classList.add("remove_div");
    } else if (event.target.closest(`.${element}_btn`)) {
      event.target.textContent = enableDiv;
      document.querySelector(`.${element}`).classList.remove("remove_div");
    }
  };
  hideElement("weather");
  hideElement("player");
  hideElement("quotes");
  hideElement("time");
  hideElement("date");
  hideElement("welcome");
};

setting.addEventListener("click", checkClick);

//save setting load
const settingBtnWeather = document.querySelector(`.weather_btn`);
const settingBtnPlayer = document.querySelector(`.player_btn`);
const settingBtnQuotes = document.querySelector(`.quotes_btn`);
const settingBtnTime = document.querySelector(`.time_btn`);
const settingBtnDate = document.querySelector(`.date_btn`);
const settingBtnWelcome = document.querySelector(`.welcome_btn`);
const settingBtnLang = document.querySelector(`.lang_btn`);
const listNotes = document.querySelector(".list_notes");

function setLocalStorage2() {
  localStorage.setItem("settingBtnWeather", settingBtnWeather.innerHTML);
  localStorage.setItem("settingBtnPlayer", settingBtnPlayer.innerHTML);
  localStorage.setItem("settingBtnQuotes", settingBtnQuotes.innerHTML);
  localStorage.setItem("settingBtnTime", settingBtnTime.innerHTML);
  localStorage.setItem("settingBtnDate", settingBtnDate.innerHTML);
  localStorage.setItem("settingBtnWelcome", settingBtnWelcome.innerHTML);
  localStorage.setItem("settingBtnLang", settingBtnLang.innerHTML);
  localStorage.setItem("lenguage", leng);
  localStorage.setItem("dataApi", dataApi);
  localStorage.setItem("tegs", tegs);
  //  localStorage.setItem("listNotes", listNotes.innerHTML);
}
window.addEventListener("beforeunload", setLocalStorage2);

function getLocalStorage2() {
  if (localStorage.getItem("settingBtnWeather")) {
    settingBtnWeather.innerHTML = localStorage.getItem("settingBtnWeather");
  }
  if (localStorage.getItem("settingBtnPlayer")) {
    settingBtnPlayer.innerHTML = localStorage.getItem("settingBtnPlayer");
  }
  if (localStorage.getItem("settingBtnQuotes")) {
    settingBtnQuotes.innerHTML = localStorage.getItem("settingBtnQuotes");
  }
  if (localStorage.getItem("settingBtnTime")) {
    settingBtnTime.innerHTML = localStorage.getItem("settingBtnTime");
  }
  if (localStorage.getItem("settingBtnDate")) {
    settingBtnDate.innerHTML = localStorage.getItem("settingBtnDate");
  }
  if (localStorage.getItem("settingBtnWelcome")) {
    settingBtnWelcome.innerHTML = localStorage.getItem("settingBtnWelcome");
  }
  if (localStorage.getItem("settingBtnLang")) {
    settingBtnLang.innerHTML = localStorage.getItem("settingBtnLang");
  }
  if (localStorage.getItem("dataApi")) {
    document.querySelector(".selectApi").value =
      localStorage.getItem("dataApi");
    dataApi = localStorage.getItem("dataApi");
  }
  if (localStorage.getItem("tegs")) {
    tegs = localStorage.getItem("tegs");
    document.querySelector(".input_tags").value = tegs;
  }
  //  if (localStorage.getItem("listNotes")) {
  //    listNotes.innerHTML = localStorage.getItem("listNotes");
  // }
}
window.addEventListener("load", getLocalStorage2);

function showElement(settingBtn) {
  if (document.querySelector(`.${settingBtn}_btn`).innerHTML === disableDiv) {
    document.querySelector(`.${settingBtn}`).classList.add("remove_div");
  }
  // setTimeout(showData, 10000);
}
window.onload = function () {
  showElement("weather");
  showElement("player");
  showElement("quotes");
  showElement("time");
  showElement("date");
  showElement("welcome");
  updateBG();
  getTag();
};

//translate
//click on buttom lang

const checkClickLang = (event) => {

  if (
    event.target.closest(".lang_btn") &&
    settingBtnLang.innerHTML === "english"
  ) {
    event.target.textContent = "русский";
    leng = "ru";
  } else if (event.target.closest(".lang_btn")) {
    event.target.textContent = "english";
    leng = "en";
  }
  changeURLLanguage();
};
setting.addEventListener("click", checkClickLang);

// перенаправить на url указанный язык
function changeURLLanguage() {
  location.href = window.location.pathname + "#" + leng;
  // location.reload();
  changeLanguage();
}
function changeLanguage() {
  hash = window.location.hash;
  hash = hash.substr(1);

  if (hash === '') {return}

  for (let key in langArr) {
    document.querySelector(".lang_" + key).innerHTML = langArr[key][hash];
  }
  getWeather();
  document.querySelector(".name").placeholder = langArr2["name"][hash];
  document.querySelector(".lang_notes").placeholder = langArr["notes"][hash];


  if (
    document.querySelector(".city").value === "Minsk" ||
    document.querySelector(".city").value === "Минск"
  ) {
    document.querySelector(".city").value = langArr2["cityMinsk"][hash];
  }

  getQuotes();
  showData();
  getTimeOfDay();
}
changeLanguage();

// add list notes
const input = document.querySelector(".input_notes");
const btn = document.querySelector(".lang_btn_notes");
const result = document.querySelector(".list_notes");
let arrNote = []; //создаем массив из заметок
let arrCheckbox = []; //создаем массив из checkbox (false или True)

btn.addEventListener("click", addNotes);

function addNotes(event) {
  event.preventDefault();
  if (input.value === "") {
    return;
  }
  createDeleteElements(input.value, false);
  input.value = "";
}
function createDeleteElements(value, bool = false) {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  const control = document.createElement("input");
  const span = document.createElement("span");
  //присваем класс li и вставляем span
  li.className = "li_note"; //
  span.className = "li_note_name";
  span.textContent = value;
  li.appendChild(span);
  arrNote.push(span.textContent); // формируем массив из заметок

  // создаем imput checkbox
  control.type = "checkbox";
  control.id = "input_note_control";
  control.checked = bool;
  arrCheckbox.push(control.checked);
  li.prepend(control);
  if (bool) {
    span.classList.add("noActive");
  } else {span.classList.remove("noActive");}

  //создаем кнопку для удаления заметок
  btn.className = "remove_li";
  li.appendChild(btn);

  //слушатель на кнопку для удаления
  btn.addEventListener("click", (e) => {
    result.removeChild(li);
    let i = arrNote.indexOf(span.textContent);
    if (i >= 0) {
      //удаляем чекбоксы и заметки из массивов
      arrNote.splice(i, 1);
      arrCheckbox.splice(i, 1);
    }
  });
  //слушатель на Checkbox
  control.addEventListener("change", (e) => {

    if (control.checked) {
      span.classList.add("noActive");
      let i = arrNote.indexOf(span.textContent);
      if (i >= 0) {
        arrCheckbox[i] = true;
      }

    } else {
      span.classList.remove("noActive");
      let j = arrNote.indexOf(span.textContent);
      if (j >= 0) {
        arrCheckbox[j] = false;
      }
    }

  });
  //зписываем все в ol
  result.appendChild(li);
}

let strNote;
let strCheckbox;

function setLocalStorage3() {
  strNote = arrNote.join(";");
  strCheckbox = arrCheckbox.join(";");
  localStorage.setItem("strNote", strNote);
  localStorage.setItem("strCheckbox", strCheckbox);
}
window.addEventListener("beforeunload", setLocalStorage3);

function getLocalStorage3() {
  if (localStorage.getItem("strNote")) {
    strNote = localStorage.getItem("strNote");
    strCheckbox = localStorage.getItem("strCheckbox");
  }
  if (typeof strNote == "undefined") {
    return;
  } else {
    let arrNoteNew = strNote.split(";");
    let arrCheckboxNew = strCheckbox.split(";");
    for (let i = 0; i < arrNoteNew.length; i++) {
      const bool = JSON.parse(arrCheckboxNew[i])
      createDeleteElements(arrNoteNew[i], bool);
    }
  }
}
window.addEventListener("load", getLocalStorage3);

// скрытие блока настройки
const settingIcon = document.querySelector(".settings");
const popup = document.querySelector('.popup');

const addsetting = () => {
  setting.classList.add('settingNoActive')
  popup.classList.add('popupNoActive');
  settingIcon.classList.add('settingActive');
}
const delpopup = () => {
  setting.classList.remove('settingNoActive')
  popup.classList.remove('popupNoActive')
  settingIcon.classList.remove('settingActive');
}

settingIcon.addEventListener('click', addsetting)
popup.addEventListener('click', delpopup);

// скрытие блока заметки
const noteIcon = document.querySelector(".notes");
const containerNote = document.querySelector(".container_notes");
const addDelnotes = () => {
  containerNote.classList.toggle('NodeActive')

  noteIcon.classList.toggle('NodeIconActive');
}

noteIcon.addEventListener('click', addDelnotes)
