const ST_USERNAME = "USERNAME";
const ST_PENDING = "PENDING";
const ST_FINISHED = "FINISHED"
const ST_COORDS = "COORDS"
const API_KEYS = "d34e205fc1860bc4ac44b0128894690a";

const body = document.querySelector("body");

const opneingSection = document.querySelector(".opening-section");
const mainSection = document.querySelector(".main-section");

const username = document.querySelector("#username");
const welcomeTitle = document.querySelector("#welcome-title");
const input = document.querySelector("#input");
const pending = document.querySelector("#pending");
const finished = document.querySelector("#finished")
const clock = document.querySelector("#clock");
const weather = document.querySelector("#weather");

let pendingDatabase = [];
let finishedDatabase = [];

function savePendingInStorage() {
    localStorage.setItem(ST_PENDING, JSON.stringify(pendingDatabase)); 
}

function saveFinishedInStorage() {
    localStorage.setItem(ST_FINISHED, JSON.stringify(finishedDatabase));
}

function deletePendingList(value) {
    const list = value.target.parentNode;
    pending.removeChild(list);
    const setNewPending = pendingDatabase.filter(element => { return element.id !== parseInt(list.id)});
    pendingDatabase = setNewPending;
    savePendingInStorage();
}

function moveFinished(value) {
    const list = value.target.parentNode;
    pending.removeChild(list);
    const setNewPending = pendingDatabase.filter(element => { return element.id !== parseInt(list.id)});
    pendingDatabase = setNewPending;
    savePendingInStorage();
    const content = list.querySelector("span");
    paintFinished(content.innerText);
}

function deleteFinishedList(value) {
    const list = value.target.parentNode;
    finished.removeChild(list);
    const setNewFinished = finishedDatabase.filter(element => { return element.id !== parseInt(list.id)});
    finishedDatabase = setNewFinished;
    saveFinishedInStorage();
}

function handlePending(value) {
    const list = value.target.parentNode;
    finished.removeChild(list);
    const setNewFinished = finishedDatabase.filter(element => { return element.id !== parseInt(list.id)});
    finishedDatabase = setNewFinished;
    saveFinishedInStorage();
    const content = list.querySelector("span");
    paintPending(content.innerText);
}

function paintFinished(value) {
    const list = document.createElement("li");
    const span = document.createElement("span");
    const deleteFinishedBtn = document.createElement("i");
    const pendingBtn = document.createElement("i");
    const finishedId = finishedDatabase.length + 1;

    list.id = finishedId;
    span.innerText = value;
    deleteFinishedBtn.classList.add("fas");
    deleteFinishedBtn.classList.add("fa-minus");
    pendingBtn.classList.add("fas")
    pendingBtn.classList.add("fa-plus");


    deleteFinishedBtn.addEventListener("click", deleteFinishedList);
    pendingBtn.addEventListener("click", handlePending);

    list.appendChild(span);
    list.appendChild(deleteFinishedBtn);
    list.appendChild(pendingBtn);
    finished.appendChild(list);

    const dataSchemaFinished = {
        text: value,
        id: finishedId
    }

    finishedDatabase.push(dataSchemaFinished);
    saveFinishedInStorage();

}

function paintPending(value) {
    const list = document.createElement("li");
    const span = document.createElement("span");
    const deleteBtn = document.createElement("i");
    const finishedBtn = document.createElement("i");
    const pendingId = pendingDatabase.length + 1;

    list.id = pendingId;
    span.innerText = `${value} `;
    deleteBtn.classList.add("fas");
    deleteBtn.classList.add("fa-minus");
    finishedBtn.classList.add("fas")
    finishedBtn.classList.add("fa-check");

    deleteBtn.addEventListener("click", deletePendingList);
    finishedBtn.addEventListener("click", moveFinished);
    
    list.appendChild(span);
    list.appendChild(deleteBtn);
    list.appendChild(finishedBtn);
    pending.appendChild(list);

    const dataSchemaPending = {
        text: value,
        id: pendingId
    }
    pendingDatabase.push(dataSchemaPending);
    savePendingInStorage();
}

function toDoApp(event) {
    event.preventDefault();
    const currentValue = input.value;
    paintPending(currentValue);
    input.value = "";
}

function showMain() {
    opneingSection.style.visibility="hidden";

    const loadedUsername = localStorage.getItem(ST_USERNAME);
    const loadedPending = localStorage.getItem(ST_PENDING);
    const loadedFinished = localStorage.getItem(ST_FINISHED);
     
    if (loadedPending !== null) {
        const parsedPending = JSON.parse(loadedPending);
        parsedPending.forEach(element => { paintPending(element.text)});
    } 
    if (loadedFinished !== null) {
        const parsedFinished = JSON.parse(loadedFinished);
        parsedFinished.forEach(element => { paintFinished(element.text)});
    }

    welcomeTitle.innerHTML=`안녕하세요! ${loadedUsername} 씨`;
    mainSection.style.animation="opening-one 2s ease forwards"

    mainSection.addEventListener("submit", toDoApp);
}

function handleOpening(event) {
    event.preventDefault();
    localStorage.setItem(ST_USERNAME, username.value);
    opneingSection.style.animation="opening-two 2s ease forwards";
    setTimeout(showMain, 2500);
}

function showOpening() {
    opneingSection.style.visibility="visible";
    opneingSection.style.animation="opening-one 2s ease forwards"
    opneingSection.addEventListener("submit", handleOpening);
}

function listLoader() {
    const loadedUsername = localStorage.getItem(ST_USERNAME);
    if (loadedUsername) {
        showMain();
    } else {
        showOpening();
    }
}

function imageLoader() {
    const randomImage = Math.floor(Math.random()*8)+1;
    const image = document.createElement("img");
    image.src = `img/${randomImage}.jpg`;
    image.classList.add("background-image");
    body.appendChild(image);
}

function clockLoader() {
    const time = new Date();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    clock.innerHTML=`${hour<10 ? `0${hour}` : hour}:${minutes<10 ? `0${minutes}` : minutes}`;
    setInterval(clockLoader, 1000);
}

function saveCoordsInStorage(coordsObj) {
    localStorage.setItem(ST_COORDS, JSON.stringify(coordsObj));
} 

async function showWeather(lat, lon) {
    console.log(lat.toFixed(2));
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEYS}&units=metric&&lang=kr`);
    const json = await response.json();
    console.log(json)
    const temp = json.main.temp;
    const place = json.name;
    const description = json.weather[0].description;
    
    const tempBox = document.createElement("span");
    const placeBox = document.createElement("span");
    const descriptionBox = document.createElement("span");

    tempBox.innerHTML=`현재 기온 ${temp} 도 +`;
    descriptionBox.innerHTML=`${description} +`
    placeBox.innerHTML=`${place}`;

    weather.appendChild(tempBox);
    weather.appendChild(descriptionBox);
    weather.appendChild(placeBox);
}

function handleWeatherSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
        latitude,
        longitude
    }
    saveCoordsInStorage(coordsObj);
    showWeather(latitude, longitude);
}

function handleWeatherError() {
    const errorBox = document.createElement("span");
    errorBox.innerHTML="현재 위치를 가져올 수 없습니다."
    weather.appendChild(errorBox);
}

function askForCoords() {
    navigator.geolocation.getCurrentPosition(handleWeatherSuccess, handleWeatherError);
}

function weatherLoader() {
    const loadedCoords = localStorage.getItem(ST_COORDS)
    if (loadedCoords === null) {
        askForCoords();
    } else {
        const parsedCoords = JSON.parse(loadedCoords);
        showWeather(parsedCoords.latitude, parsedCoords.longitude);
    }
}

function init() {
    imageLoader();
    listLoader();
    clockLoader();
    weatherLoader();
}

init();