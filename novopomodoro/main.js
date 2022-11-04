

const timer = {
  pomodoro: 0.1,
  shortBreak: 0.1,
  longBreak: 0.1,
  longBreakInterval: 4,
  sessions: 0,
};

let interval;

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = parseInt(difference / 1000);
  const minutes = parseInt((total / 60) % 60);
  const seconds = parseInt(total % 60);

  return {
    total,
    minutes,
    seconds,
  };
}

function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, '0');
  const seconds = `${remainingTime.seconds}`.padStart(2, '0');

  const min = document.getElementById('js-minutes');
  const sec = document.getElementById('js-seconds');
  const time = `${minutes}:${seconds}`;
  min.textContent = minutes;
  sec.textContent = seconds;

  document.title = `${time} - Freshman Pomodoro Clock Demo`;
  const progress = document.getElementById('js-progress');
  progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  if (timer.mode === 'pomodoro') timer.sessions++;

  mainButton.dataset.action = 'stop';
  mainButton.classList.add('active');
  mainButton.textContent = 'pausar';

  interval = setInterval(function() {
    timer.remainingTime = getRemainingTime(endTime);
    total = timer.remainingTime.total;
    updateClock();
    if (total <= 0) {
      clearInterval(interval);

      switch (timer.mode) {
        case 'pomodoro':
          if (timer.sessions % timer.longBreakInterval === 0) {
            switchMode('longBreak');
          } else {
            switchMode('shortBreak');

          }
        break;
        default:
          switchMode('pomodoro');
      }

    stopTimer();
    nebulizadorSound.pause();
    nebulizadorSound.currentTime = 0;



    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);

  mainButton.dataset.action = 'start';
  mainButton.classList.remove('active');
  mainButton.textContent = 'ativar';
}

function switchMode(mode) {
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };

  document
    .querySelectorAll('button[data-mode]')
    .forEach(e => e.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
  document
    .getElementById('js-progress')
    .setAttribute('max', timer.remainingTime.total);
  document.body.style.backgroundColor = `var(--${mode})`;

  updateClock();
}

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  timer.sessions = 0;
  switchMode(mode);
  stopTimer();
    nebulizadorSound.pause();
    nebulizadorSound.currentTime = 0;
}

const buttonSound = new Audio('button-sound.mp3');
const nebulizadorSound = new Audio('nebulizador.mp3');
const volumeSlider = document.getElementById('volume-slider');
const outputContainer = document.getElementById('volume-output');

volumeSlider.addEventListener('input', (e) => {
  const value = e.target.value;

  outputContainer.textContent = value;
  nebulizadorSound.volume = value / 100;
});

const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
  const { action } = mainButton.dataset;

  if (action === 'start') {
    startTimer();
    nebulizadorSound.play();
  } else {
    stopTimer();
    nebulizadorSound.pause();
    nebulizadorSound.currentTime = 0;

  }
});

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

document.addEventListener('DOMContentLoaded', () => {

  switchMode('pomodoro');
});
