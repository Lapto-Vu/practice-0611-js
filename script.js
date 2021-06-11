const opneingSection = document.querySelector(".opening-section");
const mainSection = document.querySelector(".main-section");

function handleMain() {
    opneingSection.style.visibility="hidden"
    mainSection.style.animation="opening-one 2s ease forwards"
}

function handleOpening(event) {
    event.preventDefault();
    opneingSection.style.animation="opening-two 2s ease forwards";
    setTimeout(handleMain, 2500);
}

function init() {
    opneingSection.addEventListener("submit", handleOpening);
}

init();