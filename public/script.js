const overlayTitle = "MINECraft Hardcore SerIE";

let kills = 0;
let totalTime = 0;
let isRunning = false;
let timerInterval = null;

function formatTime(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
  const mins = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
  const secs = (totalSecs % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

// Inicializar título y validación de los 30 caracteres
const nameContainer = document.getElementById('title-container');
if (overlayTitle.length > 30) {
  nameContainer.innerHTML = `<div class="boss-name-scroll">${overlayTitle}</div>`;
} else {
  nameContainer.innerHTML = `<div class="boss-name-static">${overlayTitle}</div>`;
}

function updateUI() {
  document.getElementById('kills-count').innerText = kills;
  document.getElementById('global-timer').innerText = formatTime(totalTime);
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    const startTime = Date.now() - totalTime;
    timerInterval = setInterval(() => {
      totalTime = Date.now() - startTime;
      document.getElementById('global-timer').innerText = formatTime(totalTime);
    }, 100);
  }
}

function pauseTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
  }
}

const socket = io();

socket.on("action", (data) => {
  if (data.type === "MC_START_TIMER") startTimer();
  if (data.type === "MC_PAUSE_TIMER") pauseTimer();
  
  if (data.type === "MC_ADD_KILL") {
    kills++;
    updateUI();
  }
  if (data.type === "MC_REMOVE_KILL") {
    kills = Math.max(0, kills - 1);
    updateUI();
  }
});

updateUI();