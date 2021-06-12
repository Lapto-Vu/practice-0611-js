const ST_USERNAME = "USERNAME";
const ST_PENDING = "PENDING";
const ST_FINISHED = "FINISHED"

const body = document.querySelector("body");

const opneingSection = document.querySelector(".opening-section");
const mainSection = document.querySelector(".main-section");

const username = document.querySelector("#username");
const welcomeTitle = document.querySelector("#welcome-title");
const input = document.querySelector("#input");
const pending = document.querySelector("#pending");
const finished = document.querySelector("#finished")

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
    const deleteFinishedBtn = document.createElement("button");
    const pendingBtn = document.createElement("button");
    const finishedId = finishedDatabase.length + 1;

    list.id = finishedId;
    span.innerText = value;
    deleteFinishedBtn.innerText = "❌";
    pendingBtn.innerText = "⏫";

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
    const deleteBtn = document.createElement("button");
    const finishedBtn = document.createElement("button");
    const pendingId = pendingDatabase.length + 1;

    list.id = pendingId;
    span.innerText = `${value} `;
    deleteBtn.innerText = "❌";
    finishedBtn.innerText = "✅";

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
     
    if (loadedPending) {
        const parsedPending = JSON.parse(loadedPending);
        parsedPending.forEach(element => { paintPending(element.text)});
    } else if (loadedFinished) {
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

function defaultLoader() {
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

function init() {
    imageLoader();
    defaultLoader();
}

init();