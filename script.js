

function readStoredPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function saveStoredPreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    
  }
}

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const heroGreeting = document.getElementById('heroGreeting');
const heroTagline = document.getElementById('heroTagline');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

const localHour = new Date().getHours();
heroGreeting.textContent = localHour >= 5 && localHour < 12
  ? 'GOOD MORNING,'
  : localHour < 18 && localHour >= 12
    ? 'GOOD AFTERNOON,'
    : 'GOOD EVENING,';

const completeTagline = heroTagline.getAttribute('aria-label');
if (motionPreference.matches) {
  heroTagline.textContent = completeTagline;
} else {
  heroTagline.textContent = '';
  let typedCharacters = 0;
  const typeTagline = () => {
    typedCharacters += 1;
    heroTagline.textContent = completeTagline.slice(0, typedCharacters);
    if (typedCharacters < completeTagline.length) window.setTimeout(typeTagline, 32);
  };
  typeTagline();
}


const skillTagWraps = Array.from(document.querySelectorAll('.skill-tag-wrap'));
skillTagWraps.forEach((wrap) => {
  const button = wrap.querySelector('.skill-tag');
  button.addEventListener('click', () => {
    const isOpen = wrap.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});
document.addEventListener('click', (event) => {
  if (event.target.closest('.skill-tag-wrap')) return;
  skillTagWraps.forEach((wrap) => {
    wrap.classList.remove('is-open');
    wrap.querySelector('.skill-tag').setAttribute('aria-expanded', 'false');
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  skillTagWraps.forEach((wrap) => {
    wrap.classList.remove('is-open');
    wrap.querySelector('.skill-tag').setAttribute('aria-expanded', 'false');
  });
});


const copyToast = document.getElementById('copyToast');
let copyToastTimeout = 0;

function showCopyToast(message, row) {
  const toastWidth = 132;
  const toastHeight = 42;
  const bounds = row.getBoundingClientRect();
  const left = Math.min(Math.max(12, bounds.left + bounds.width / 2 - toastWidth / 2), window.innerWidth - toastWidth - 12);
  const top = Math.max(12, bounds.top - toastHeight - 8);
  copyToast.textContent = message;
  copyToast.style.left = `${left}px`;
  copyToast.style.top = `${top}px`;
  copyToast.classList.add('is-visible');
  window.clearTimeout(copyToastTimeout);
  copyToastTimeout = window.setTimeout(() => copyToast.classList.remove('is-visible'), 1500);
}

async function copyContactValue(row) {
  const value = row.dataset.copyValue;
  try {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      throw new Error('Clipboard API is unavailable.');
    }
    await navigator.clipboard.writeText(value);
    showCopyToast('Copied!', row);
  } catch (clipboardError) {
    const fallbackField = document.createElement('textarea');
    fallbackField.value = value;
    fallbackField.setAttribute('readonly', '');
    fallbackField.style.position = 'fixed';
    fallbackField.style.opacity = '0';
    document.body.appendChild(fallbackField);
    fallbackField.select();
    let copied = false;
    let fallbackError = null;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      fallbackError = error;
    } finally {
      fallbackField.remove();
    }
    if (copied) {
      showCopyToast('Copied!', row);
    } else {
      console.error(`Could not copy the contact value "${value}":`, fallbackError || clipboardError);
      showCopyToast('Copy failed', row);
    }
  }
}

document.querySelectorAll('.contact-copy').forEach((row) => {
  row.addEventListener('click', () => {
    const icon = row.querySelector('.contact-icon');
    icon.classList.remove('is-bouncing');
    void icon.offsetWidth;
    icon.classList.add('is-bouncing');
    window.setTimeout(() => icon.classList.remove('is-bouncing'), 500);
    copyContactValue(row);
  });
});

document.querySelector('.contact-github').addEventListener('click', (event) => {
  const icon = event.currentTarget.querySelector('.contact-icon');
  icon.classList.remove('is-bouncing');
  void icon.offsetWidth;
  icon.classList.add('is-bouncing');
});

const sunIcon = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
const moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>';


const studentInfoToggle = document.getElementById('studentInfoToggle');
const studentInfoGrid = document.getElementById('studentInfoGrid');
const studentInfoCards = Array.from(studentInfoGrid.querySelectorAll('.info-card'));
const studentInfoStorageKey = 'studentInfoHidden';
const studentInfoMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const studentInfoStagger = 50;
const studentInfoTransition = studentInfoMotionPreference.matches ? 0 : 300;
const studentInfoAnimationDuration = studentInfoTransition + studentInfoStagger * (studentInfoCards.length - 1);
let studentInfoHidden = document.documentElement.getAttribute('data-student-info-prehidden') === 'true';

function updateStudentInfoToggle() {
  studentInfoToggle.classList.toggle('is-hidden', studentInfoHidden);
  studentInfoToggle.setAttribute('aria-expanded', String(!studentInfoHidden));
  studentInfoToggle.setAttribute('aria-label', studentInfoHidden ? 'Show student info' : 'Hide student info');
  studentInfoToggle.title = studentInfoHidden ? 'Show student info' : 'Hide student info';
}

function saveStudentInfoVisibility() {
  saveStoredPreference(studentInfoStorageKey, String(studentInfoHidden));
}

function finishStudentInfoAnimation() {
  studentInfoGrid.classList.remove('is-animating', 'is-showing', 'is-hiding');
  studentInfoGrid.inert = studentInfoHidden;
  studentInfoGrid.setAttribute('aria-hidden', String(studentInfoHidden));
  if (studentInfoHidden) studentInfoGrid.hidden = true;
}

updateStudentInfoToggle();
if (studentInfoHidden) {
  studentInfoGrid.hidden = true;
  studentInfoGrid.inert = true;
  studentInfoGrid.setAttribute('aria-hidden', 'true');
}
document.documentElement.removeAttribute('data-student-info-prehidden');

studentInfoToggle.addEventListener('click', () => {
  if (studentInfoGrid.classList.contains('is-animating')) return;

  studentInfoHidden = !studentInfoHidden;
  updateStudentInfoToggle();
  saveStudentInfoVisibility();

  studentInfoGrid.classList.add('is-animating', studentInfoHidden ? 'is-hiding' : 'is-showing');
  studentInfoGrid.inert = true;
  studentInfoGrid.setAttribute('aria-hidden', 'true');

  if (studentInfoHidden) {
    window.setTimeout(finishStudentInfoAnimation, studentInfoAnimationDuration);
    return;
  }

  studentInfoGrid.hidden = false;
  requestAnimationFrame(() => {
    studentInfoGrid.classList.remove('is-showing');
    window.setTimeout(finishStudentInfoAnimation, studentInfoAnimationDuration);
  });
});

function applyThemeIcon(theme) {
  themeIcon.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
}
applyThemeIcon(document.documentElement.getAttribute('data-theme'));

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  saveStoredPreference('theme', next);
  applyThemeIcon(next);
  themeToggle.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`);
});


const menuToggle = document.getElementById('menuToggle');
const navLinksEl = document.getElementById('navLinks');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.forEach((link) => link.addEventListener('click', () => {
  navLinksEl.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const musicFile = document.getElementById('musicFile');
const portfolioAudio = document.getElementById('portfolioAudio');
const playMusic = document.getElementById('playMusic');
const playIcon = document.getElementById('playIcon');
const trackName = document.getElementById('trackName');
const musicStatus = document.getElementById('musicStatus');
const resetMusic = document.getElementById('resetMusic');
const ambientToggle = document.getElementById('ambientToggle');
const musicProgress = document.getElementById('musicProgress');
const musicVolume = document.getElementById('musicVolume');
const volumeToggle = document.getElementById('volumeToggle');
const volumeControl = volumeToggle.closest('.volume-control');
const defaultTrackUrl = 'music/ambient-default.mp3';
const defaultTrackName = 'Lo-fi Ambient (default)';
let audioObjectUrl = '';


const pageBrightness = document.getElementById('pageBrightness');
const brightnessValue = document.getElementById('brightnessValue');
const brightnessControl = pageBrightness.closest('.brightness-control');
const brightnessTooltip = document.getElementById('brightnessTooltip');
let brightnessTooltipTimer = 0;
const savedBrightness = Number(readStoredPreference('pageBrightness'));
const initialBrightness = Number.isFinite(savedBrightness) && savedBrightness >= 35 && savedBrightness <= 100
  ? savedBrightness
  : 100;

function setPageBrightness(value) {
  const brightness = Number(value);
  const dimAmount = (100 - brightness) / 100;
  const progress = ((brightness - Number(pageBrightness.min)) / (Number(pageBrightness.max) - Number(pageBrightness.min))) * 100;
  const brightnessLevel = brightness / 100;
  document.body.style.setProperty('--page-dim', String(dimAmount));
  brightnessControl.style.setProperty('--brightness-progress', `${progress}%`);
  brightnessControl.style.setProperty('--brightness-glow', `${brightnessLevel * 9}px`);
  brightnessControl.style.setProperty('--brightness-rotation', `${(brightness - 50) * 0.18}deg`);
  brightnessControl.style.setProperty('--brightness-scale', String(0.94 + brightnessLevel * 0.12));
  pageBrightness.value = String(brightness);
  brightnessValue.value = `${brightness}%`;
  brightnessValue.textContent = `${brightness}%`;
  pageBrightness.setAttribute('aria-valuetext', `${brightness}%`);
  brightnessTooltip.textContent = `${brightness}%`;
}

setPageBrightness(initialBrightness);
pageBrightness.addEventListener('input', () => {
  setPageBrightness(pageBrightness.value);
  saveStoredPreference('pageBrightness', pageBrightness.value);
  brightnessControl.classList.add('is-adjusting');
  window.clearTimeout(brightnessTooltipTimer);
  brightnessTooltipTimer = window.setTimeout(() => {
    brightnessControl.classList.remove('is-adjusting');
  }, 900);
});

musicFile.addEventListener('change', () => {
  const file = musicFile.files[0];
  if (!file) return;

  portfolioAudio.pause();
  if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
  audioObjectUrl = URL.createObjectURL(file);
  portfolioAudio.src = audioObjectUrl;
  portfolioAudio.dataset.trackType = 'upload';
  portfolioAudio.load();
  trackName.textContent = file.name;
  trackName.title = file.name;
  playMusic.disabled = false;
  resetMusic.disabled = false;
  musicProgress.value = '0';
  musicProgress.style.setProperty('--music-progress', '0%');
  musicStatus.textContent = `${file.name} is ready to play.`;
});

resetMusic.addEventListener('click', () => {
  portfolioAudio.pause();
  if (audioObjectUrl) {
    URL.revokeObjectURL(audioObjectUrl);
    audioObjectUrl = '';
  }
  portfolioAudio.src = defaultTrackUrl;
  portfolioAudio.dataset.trackType = 'default';
  portfolioAudio.load();
  trackName.textContent = defaultTrackName;
  trackName.title = defaultTrackName;
  resetMusic.disabled = true;
  playMusic.disabled = true;
  musicProgress.value = '0';
  musicProgress.disabled = true;
  musicProgress.style.setProperty('--music-progress', '0%');
  musicStatus.textContent = `${defaultTrackName} is ready to play.`;
});

playMusic.addEventListener('click', async () => {
  if (portfolioAudio.paused) {
    try {
      await portfolioAudio.play();
    } catch (error) {
      if (error.name === 'AbortError') return;
      musicStatus.textContent = `Could not play ${trackName.textContent}. Please choose a supported audio file.`;
      console.error('Audio playback failed:', error);
    }
  } else {
    portfolioAudio.pause();
  }
});

function updateMusicControls() {
  const isPlaying = !portfolioAudio.paused && !portfolioAudio.ended;
  const wasPlaying = playMusic.dataset.playing === 'true';
  if (isPlaying !== wasPlaying) {
    playIcon.classList.add('is-changing');
    window.requestAnimationFrame(() => {
      playIcon.innerHTML = isPlaying
        ? '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>'
        : '<path d="M8 5v14l11-7z"/>';
      window.requestAnimationFrame(() => playIcon.classList.remove('is-changing'));
    });
  }
  playMusic.dataset.playing = String(isPlaying);
  playMusic.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
  document.querySelector('.music-visualizer').classList.toggle('playing', isPlaying);
}

function formatAudioTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function updateMusicProgress() {
  const duration = portfolioAudio.duration;
  const currentTime = portfolioAudio.currentTime;
  if (!Number.isFinite(duration) || duration <= 0) {
    musicProgress.disabled = true;
    musicProgress.setAttribute('aria-valuetext', 'Track position unavailable');
    return;
  }

  musicProgress.disabled = false;
  const percent = Math.min(100, Math.max(0, (currentTime / duration) * 100));
  if (document.activeElement !== musicProgress) {
    musicProgress.value = String(Math.round(percent * 10));
  }
  musicProgress.style.setProperty('--music-progress', `${percent}%`);
  musicProgress.setAttribute('aria-valuetext', `${formatAudioTime(currentTime)} of ${formatAudioTime(duration)}`);
}

musicProgress.addEventListener('input', () => {
  const duration = portfolioAudio.duration;
  if (!Number.isFinite(duration) || duration <= 0) return;
  const percent = Number(musicProgress.value) / Number(musicProgress.max);
  portfolioAudio.currentTime = percent * duration;
  musicProgress.style.setProperty('--music-progress', `${percent * 100}%`);
  musicProgress.setAttribute('aria-valuetext', `${formatAudioTime(portfolioAudio.currentTime)} of ${formatAudioTime(duration)}`);
});

portfolioAudio.addEventListener('loadedmetadata', updateMusicProgress);
portfolioAudio.addEventListener('durationchange', updateMusicProgress);
portfolioAudio.addEventListener('timeupdate', updateMusicProgress);
portfolioAudio.addEventListener('loadedmetadata', () => {
  playMusic.disabled = false;
  musicProgress.disabled = false;
  musicStatus.textContent = `${trackName.textContent} is ready to play.`;
});
portfolioAudio.addEventListener('play', updateMusicControls);
portfolioAudio.addEventListener('pause', updateMusicControls);
portfolioAudio.addEventListener('ended', updateMusicControls);
portfolioAudio.addEventListener('error', () => {
  playMusic.disabled = true;
  musicProgress.disabled = true;
  if (portfolioAudio.dataset.trackType === 'default') {
    trackName.textContent = 'Default track unavailable';
    trackName.title = 'Add a royalty-free track at music/ambient-default.mp3.';
    musicStatus.textContent = 'Add your royalty-free soundtrack at music/ambient-default.mp3 to enable playback.';
    return;
  }
  musicStatus.textContent = 'The selected soundtrack could not be played. Choose another supported audio file.';
});

musicVolume.value = String(portfolioAudio.volume);
musicVolume.style.background = `linear-gradient(to right, var(--rose), var(--holo-mint) ${portfolioAudio.volume * 100}%, var(--surface) ${portfolioAudio.volume * 100}%)`;
musicVolume.setAttribute('aria-valuetext', `${Math.round(portfolioAudio.volume * 100)}%`);
musicVolume.addEventListener('input', () => {
  portfolioAudio.volume = Number(musicVolume.value);
  musicVolume.style.background = `linear-gradient(to right, var(--rose), var(--holo-mint) ${musicVolume.value * 100}%, var(--surface) ${musicVolume.value * 100}%)`;
  musicVolume.setAttribute('aria-valuetext', `${Math.round(portfolioAudio.volume * 100)}%`);
});

volumeToggle.addEventListener('click', () => {
  const isOpen = volumeToggle.getAttribute('aria-expanded') !== 'true';
  volumeToggle.setAttribute('aria-expanded', String(isOpen));
  volumeToggle.setAttribute('aria-label', isOpen ? 'Hide volume control' : 'Show volume control');
  volumeControl.classList.toggle('is-open', isOpen);
  musicVolume.tabIndex = isOpen ? 0 : -1;
  if (isOpen) musicVolume.focus();
});

musicVolume.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    volumeControl.classList.remove('is-open');
    volumeToggle.setAttribute('aria-expanded', 'false');
    volumeToggle.setAttribute('aria-label', 'Show volume control');
    musicVolume.tabIndex = -1;
    volumeToggle.focus();
  }
});

const sakuraCanvas = document.getElementById('sakuraCanvas');
const sakuraContext = sakuraCanvas.getContext('2d');
const sakuraMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const sakuraPetalColors = ['#F7A8C4', '#FFC9DE', '#E8B5D0', '#F5D5E3'];
const sakuraPetals = [];
let sakuraWidth = 0;
let sakuraHeight = 0;
let lastSakuraFrame = 0;
let sakuraAnimationFrame = 0;
let ambientMotionEnabled = false;

function resetSakuraPetal(petal, startAtTop = false) {
  petal.x = Math.random() * sakuraWidth;
  petal.y = startAtTop ? -Math.random() * sakuraHeight : Math.random() * sakuraHeight;
  petal.size = 4 + Math.random() * 5;
  petal.speed = 24 + Math.random() * 34;
  petal.drift = 12 + Math.random() * 30;
  petal.phase = Math.random() * Math.PI * 2;
  petal.rotation = Math.random() * Math.PI * 2;
  petal.spin = (Math.random() - 0.5) * 1.5;
  petal.opacity = 0.32 + Math.random() * 0.4;
  petal.color = sakuraPetalColors[Math.floor(Math.random() * sakuraPetalColors.length)];
}

function resizeSakuraCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  sakuraWidth = window.innerWidth;
  sakuraHeight = window.innerHeight;
  sakuraCanvas.width = Math.round(sakuraWidth * pixelRatio);
  sakuraCanvas.height = Math.round(sakuraHeight * pixelRatio);
  sakuraContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  sakuraPetals.length = 0;
  const petalCount = Math.min(24, Math.max(15, Math.round(sakuraWidth / 54)));
  for (let index = 0; index < petalCount; index += 1) {
    const petal = {};
    resetSakuraPetal(petal);
    sakuraPetals.push(petal);
  }
}

function drawSakuraPetal(petal, deltaSeconds) {
  petal.y += petal.speed * deltaSeconds;
  petal.rotation += petal.spin * deltaSeconds;
  if (petal.y > sakuraHeight + petal.size * 2) {
    resetSakuraPetal(petal, true);
  }

  const x = petal.x + Math.sin(petal.y * 0.008 + petal.phase) * petal.drift;
  sakuraContext.save();
  sakuraContext.translate(x, petal.y);
  sakuraContext.rotate(petal.rotation);
  sakuraContext.scale(0.72 + Math.sin(petal.rotation * 1.5) * 0.28, 1);
  sakuraContext.globalAlpha = petal.opacity;
  sakuraContext.fillStyle = petal.color;
  sakuraContext.beginPath();
  sakuraContext.moveTo(0, -petal.size);
  sakuraContext.bezierCurveTo(petal.size * 0.8, -petal.size * 0.55, petal.size * 0.8, petal.size * 0.35, 0, petal.size);
  sakuraContext.bezierCurveTo(-petal.size * 0.8, petal.size * 0.35, -petal.size * 0.8, -petal.size * 0.55, 0, -petal.size);
  sakuraContext.fill();
  sakuraContext.restore();
}

function animateSakura(timestamp) {
  sakuraAnimationFrame = 0;
  if (document.hidden || sakuraMotionPreference.matches || !ambientMotionEnabled) {
    lastSakuraFrame = 0;
    sakuraContext.clearRect(0, 0, sakuraWidth, sakuraHeight);
    return;
  }

  const deltaSeconds = lastSakuraFrame ? Math.min((timestamp - lastSakuraFrame) / 1000, 0.05) : 0;
  lastSakuraFrame = timestamp;
  sakuraContext.clearRect(0, 0, sakuraWidth, sakuraHeight);
  for (let index = 0; index < sakuraPetals.length; index += 1) {
    drawSakuraPetal(sakuraPetals[index], deltaSeconds);
  }
  sakuraAnimationFrame = requestAnimationFrame(animateSakura);
}

function startSakuraAnimation() {
  if (!sakuraAnimationFrame && !document.hidden && !sakuraMotionPreference.matches && ambientMotionEnabled) {
    sakuraAnimationFrame = requestAnimationFrame(animateSakura);
  }
}

function stopSakuraAnimation() {
  if (sakuraAnimationFrame) {
    cancelAnimationFrame(sakuraAnimationFrame);
    sakuraAnimationFrame = 0;
  }
  lastSakuraFrame = 0;
  sakuraContext.clearRect(0, 0, sakuraWidth, sakuraHeight);
}

resizeSakuraCanvas();
window.addEventListener('resize', () => {
  resizeSakuraCanvas();
  startSakuraAnimation();
});

function setAmbientMotion(enabled, persist = true) {
  ambientMotionEnabled = enabled && !sakuraMotionPreference.matches;
  ambientToggle.setAttribute('aria-pressed', String(ambientMotionEnabled));
  document.body.classList.toggle('ambient-motion', ambientMotionEnabled);
  if (persist) saveStoredPreference('ambientMotion', String(ambientMotionEnabled));
  if (ambientMotionEnabled) startSakuraAnimation();
  else stopSakuraAnimation();
}

ambientToggle.addEventListener('click', () => {
  setAmbientMotion(ambientToggle.getAttribute('aria-pressed') !== 'true');
});

setAmbientMotion(readStoredPreference('ambientMotion') === 'true', false);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopSakuraAnimation();
  } else {
    startSakuraAnimation();
  }
});
sakuraMotionPreference.addEventListener('change', (event) => {
  if (event.matches) {
    setAmbientMotion(false);
  } else {
    setAmbientMotion(readStoredPreference('ambientMotion') === 'true', false);
  }
});

window.addEventListener('beforeunload', () => {
  if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
});

// ===== Catch the Stars mini game =====
const gameCanvas = document.getElementById('starGame');
const gameContext = gameCanvas.getContext('2d');
const gameScore = document.getElementById('gameScore');
const gameMisses = document.getElementById('gameMisses');
const gameStatus = document.getElementById('gameStatus');
const startGameButton = document.getElementById('startGame');
const gameWidth = gameCanvas.width;
const gameHeight = gameCanvas.height;
const basketY = gameHeight - 28;
const basketHalfWidth = 38;
const stars = [];
let basketX = gameWidth / 2;
let score = 0;
let misses = 0;
let gameRunning = false;
let lastGameFrame = 0;
let spawnElapsed = 0;

function drawStar(context, x, y, outerRadius, color) {
  context.beginPath();
  for (let point = 0; point < 10; point += 1) {
    const radius = point % 2 === 0 ? outerRadius : outerRadius * 0.45;
    const angle = -Math.PI / 2 + (point * Math.PI) / 5;
    const pointX = x + Math.cos(angle) * radius;
    const pointY = y + Math.sin(angle) * radius;
    if (point === 0) context.moveTo(pointX, pointY);
    else context.lineTo(pointX, pointY);
  }
  context.closePath();
  context.fillStyle = color;
  context.fill();
}

function drawGame() {
  const colors = getComputedStyle(document.documentElement);
  const plum = colors.getPropertyValue('--plum').trim() || '#2A1F2E';
  const rose = colors.getPropertyValue('--rose').trim() || '#F4B8C9';
  const mint = colors.getPropertyValue('--holo-mint').trim() || '#B8F0D4';
  const lavender = colors.getPropertyValue('--lavender-grey').trim() || '#C9C3D9';
  gameContext.clearRect(0, 0, gameWidth, gameHeight);
  gameContext.strokeStyle = `${plum}18`;
  gameContext.lineWidth = 1;
  for (let x = 30; x < gameWidth; x += 40) {
    for (let y = 30; y < gameHeight; y += 40) {
      gameContext.beginPath();
      gameContext.arc(x, y, 1.3, 0, Math.PI * 2);
      gameContext.stroke();
    }
  }

  stars.forEach((star) => drawStar(gameContext, star.x, star.y, star.radius, star.color));

  gameContext.fillStyle = plum;
  gameContext.beginPath();
  gameContext.roundRect(basketX - basketHalfWidth, basketY - 14, basketHalfWidth * 2, 29, 8);
  gameContext.fill();
  gameContext.strokeStyle = mint;
  gameContext.lineWidth = 4;
  gameContext.beginPath();
  gameContext.moveTo(basketX - basketHalfWidth + 4, basketY - 11);
  gameContext.lineTo(basketX + basketHalfWidth - 4, basketY - 11);
  gameContext.stroke();
  gameContext.strokeStyle = plum;
  gameContext.lineWidth = 5;
  gameContext.beginPath();
  gameContext.arc(basketX, basketY - 13, 20, Math.PI, 0);
  gameContext.stroke();

  if (!gameRunning) {
    gameContext.fillStyle = `${plum}A8`;
    gameContext.font = '700 18px Quicksand, sans-serif';
    gameContext.textAlign = 'center';
    gameContext.fillText(score || misses ? 'Ready for another round?' : 'Press Play to catch some stars', gameWidth / 2, gameHeight / 2 - 4);
    gameContext.font = '500 13px Quicksand, sans-serif';
    gameContext.fillText('Move your basket and collect the falling stars', gameWidth / 2, gameHeight / 2 + 20);
  }
}

function endGame() {
  gameRunning = false;
  startGameButton.disabled = false;
  startGameButton.textContent = 'Play again';
  gameStatus.textContent = `Game over! You caught ${score} ${score === 1 ? 'star' : 'stars'}. Press Play again for another round.`;
  drawGame();
}

function updateGame(timestamp) {
  if (!gameRunning) return;
  const delta = Math.min((timestamp - lastGameFrame) / 1000, 0.05);
  lastGameFrame = timestamp;
  spawnElapsed += delta;

  if (spawnElapsed >= 0.78) {
    spawnElapsed = 0;
    const starColors = [
      getComputedStyle(document.documentElement).getPropertyValue('--bubblegum').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--holo-mint').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--lavender-grey').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--cream').trim()
    ];
    stars.push({
      x: 22 + Math.random() * (gameWidth - 44),
      y: -12,
      radius: 10 + Math.random() * 4,
      speed: 105 + Math.min(score * 4, 100),
      color: starColors[Math.floor(Math.random() * starColors.length)] || '#F4B8C9'
    });
  }

  for (let index = stars.length - 1; index >= 0; index -= 1) {
    const star = stars[index];
    star.y += star.speed * delta;
    if (star.y + star.radius >= basketY - 14 &&
        star.y - star.radius <= basketY + 12 &&
        Math.abs(star.x - basketX) <= basketHalfWidth + star.radius * 0.4) {
      stars.splice(index, 1);
      score += 1;
      gameScore.textContent = String(score);
      gameStatus.textContent = `Nice catch! Your score is ${score}.`;
    } else if (star.y - star.radius > gameHeight) {
      stars.splice(index, 1);
      misses += 1;
      gameMisses.textContent = `${misses} / 3`;
      gameStatus.textContent = `${misses} ${misses === 1 ? 'star has' : 'stars have'} slipped by.`;
      if (misses >= 3) {
        endGame();
        return;
      }
    }
  }

  drawGame();
  requestAnimationFrame(updateGame);
}

function moveBasket(amount) {
  basketX = Math.max(basketHalfWidth, Math.min(gameWidth - basketHalfWidth, basketX + amount));
  drawGame();
}

startGameButton.addEventListener('click', () => {
  score = 0;
  misses = 0;
  stars.length = 0;
  basketX = gameWidth / 2;
  spawnElapsed = 0;
  gameScore.textContent = '0';
  gameMisses.textContent = '0 / 3';
  gameStatus.textContent = 'Game on! Catch as many stars as you can.';
  startGameButton.disabled = true;
  startGameButton.textContent = 'Playing...';
  gameRunning = true;
  lastGameFrame = performance.now();
  gameCanvas.focus();
  requestAnimationFrame(updateGame);
});

gameCanvas.addEventListener('keydown', (event) => {
  if (!gameRunning) return;
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
    event.preventDefault();
    moveBasket(-32);
  } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
    event.preventDefault();
    moveBasket(32);
  }
});

gameCanvas.addEventListener('pointermove', (event) => {
  if (!gameRunning) return;
  const bounds = gameCanvas.getBoundingClientRect();
  basketX = Math.max(
    basketHalfWidth,
    Math.min(gameWidth - basketHalfWidth, ((event.clientX - bounds.left) / bounds.width) * gameWidth)
  );
});

document.getElementById('moveLeft').addEventListener('click', () => moveBasket(-48));
document.getElementById('moveRight').addEventListener('click', () => moveBasket(48));
drawGame();

const toggleBtn = document.getElementById('toggleProfile');
const profileCard = document.getElementById('profileCard');
const eyeIcon = document.getElementById('eyeIcon');

const eyeOpen = '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/>';
const eyeClosed = '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 7 11 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 1 12s4 7 11 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="1" y1="1" x2="23" y2="23"/>';

toggleBtn.addEventListener('click', () => {
  const nowHidden = profileCard.classList.toggle('hidden');
  eyeIcon.innerHTML = nowHidden ? eyeClosed : eyeOpen;
  toggleBtn.setAttribute('aria-pressed', String(nowHidden));
  toggleBtn.setAttribute('aria-label', nowHidden ? 'Show profile' : 'Hide profile');
});

const activityCards = Array.from(document.querySelectorAll('.project-card[data-category]'));
const activityFilters = document.querySelectorAll('.activity-filter');
const activityGrid = document.getElementById('activityGrid');
const activityCarouselButtons = document.querySelectorAll('.activity-carousel-button');
const canUsePointerEffects = !motionPreference.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (canUsePointerEffects) {
  const backgroundBlobs = Array.from(document.querySelectorAll('.bg-blob'));
  const blobStrengths = [0.012, -0.009, 0.007];
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    pointerX = event.clientX - window.innerWidth / 2;
    pointerY = event.clientY - window.innerHeight / 2;
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      backgroundBlobs.forEach((blob, index) => {
        const strength = blobStrengths[index] || 0.008;
        blob.style.setProperty('--cursor-shift-x', `${pointerX * strength}px`);
        blob.style.setProperty('--cursor-shift-y', `${pointerY * strength}px`);
      });
      pointerFrame = 0;
    });
  }, { passive: true });

  activityCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`);
      card.style.setProperty('--tilt-y', `${(x - 0.5) * 5}deg`);
      card.classList.add('is-tilting');
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
      card.classList.remove('is-tilting');
    });
  });
}

function scrollActivityGrid(direction) {
  const visibleCard = activityCards.find((card) => !card.hidden);
  if (!visibleCard) return;
  const gridStyles = getComputedStyle(activityGrid);
  const gap = Number.parseFloat(gridStyles.columnGap) || 0;
  activityGrid.scrollBy({
    left: direction * (visibleCard.getBoundingClientRect().width + gap),
    behavior: 'smooth'
  });
}

activityCarouselButtons.forEach((button) => {
  button.addEventListener('click', () => {
    scrollActivityGrid(Number(button.dataset.activityScroll));
  });
});

activityGrid.addEventListener('wheel', (event) => {
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  event.preventDefault();
  activityGrid.scrollLeft += event.deltaY;
}, { passive: false });

let dragStartX = 0;
let dragStartScrollLeft = 0;
let hasDraggedActivityGrid = false;

activityGrid.addEventListener('pointerdown', (event) => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  if (event.target.closest('a, button, input, select, textarea, .reflection-panel, [contenteditable="true"]')) return;
  dragStartX = event.clientX;
  dragStartScrollLeft = activityGrid.scrollLeft;
  hasDraggedActivityGrid = false;
  activityGrid.setPointerCapture(event.pointerId);
});

activityGrid.addEventListener('pointermove', (event) => {
  if (!activityGrid.hasPointerCapture(event.pointerId)) return;
  const distance = event.clientX - dragStartX;
  if (Math.abs(distance) > 5) {
    hasDraggedActivityGrid = true;
    activityGrid.classList.add('is-dragging');
  }
  if (hasDraggedActivityGrid) activityGrid.scrollLeft = dragStartScrollLeft - distance;
});

function finishActivityGridDrag(event) {
  if (!activityGrid.hasPointerCapture(event.pointerId)) return;
  activityGrid.releasePointerCapture(event.pointerId);
  activityGrid.classList.remove('is-dragging');
  if (hasDraggedActivityGrid) {
    window.setTimeout(() => {
      hasDraggedActivityGrid = false;
    }, 0);
  }
}

activityGrid.addEventListener('pointerup', finishActivityGridDrag);
activityGrid.addEventListener('pointercancel', finishActivityGridDrag);
activityGrid.addEventListener('click', (event) => {
  if (!hasDraggedActivityGrid) return;
  event.preventDefault();
  event.stopPropagation();
}, true);

activityFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const selectedTerm = filter.dataset.activityFilter;

    activityFilters.forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    activityCards.forEach((card) => {
      card.hidden = selectedTerm !== 'all' && card.dataset.category !== selectedTerm;
    });
    activityGrid.scrollTo({ left: 0, behavior: 'instant' });
  });
});

document.querySelectorAll('.reflection-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    const isExpanded = button.getAttribute('aria-expanded') !== 'true';
    const arrow = button.querySelector('span');

    button.setAttribute('aria-expanded', String(isExpanded));
    button.firstChild.textContent = isExpanded ? 'Hide Reflection ' : 'Show Reflection ';
    arrow.textContent = isExpanded ? '↑' : '↓';
    panel.setAttribute('aria-hidden', String(!isExpanded));
    panel.inert = !isExpanded;
  });
});

// ===== Active link highlight on scroll =====
const sections = document.querySelectorAll('section');
const sectionDots = Array.from(document.querySelectorAll('.section-dot'));
const dotSections = sectionDots
  .map((dot, index) => document.getElementById(index === 1 ? 'about' : dot.getAttribute('href').slice(1)))
  .filter(Boolean);
const readingProgress = document.getElementById('readingProgress');
const backToTop = document.getElementById('backToTop');
let scrollUpdatePending = false;

function updateScrollInterface() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? Math.round((window.scrollY / scrollableHeight) * 100) : 0;
  readingProgress.style.width = `${progress}%`;
  readingProgress.setAttribute('aria-valuenow', String(progress));
  backToTop.classList.toggle('visible', window.scrollY > 500);

  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });

  const dotThreshold = window.scrollY + window.innerHeight * 0.38;
  let activeDotIndex = 0;
  dotSections.forEach((section, index) => {
    if (dotThreshold >= section.offsetTop) activeDotIndex = index;
  });
  sectionDots.forEach((dot, index) => {
    const isActive = index === activeDotIndex;
    dot.classList.toggle('is-active', isActive);
    if (isActive) dot.setAttribute('aria-current', 'location');
    else dot.removeAttribute('aria-current');
  });
  scrollUpdatePending = false;
}

window.addEventListener('scroll', () => {
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  window.requestAnimationFrame(updateScrollInterface);
}, { passive: true });

window.addEventListener('resize', updateScrollInterface);
updateScrollInterface();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealTargets = document.querySelectorAll(
  '.profile-card, .eyebrow, .section-title, .info-card, .project-card, .game-card, .contact-card, .about, .bio, .activities, .mini-game, .contact'
);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const bioStatsCard = document.querySelector('.bio-stats-card');
const bioProgressItems = Array.from(document.querySelectorAll('.skill-progress'));
const bioStoryTabs = Array.from(document.querySelectorAll('.bio-story-tab'));
const bioStoryPanels = Array.from(document.querySelectorAll('.bio-story-panel'));
const bioStoryStep = document.getElementById('bioStoryStep');
const bioPhotoFlip = document.querySelector('.bio-photo-flip');
const bioPhotoFront = bioPhotoFlip.querySelector('.bio-photo-front');
const bioPhotoBack = bioPhotoFlip.querySelector('.bio-photo-back');
const bioCourseToggle = document.querySelector('.bio-course-toggle');
const bioCourseNote = document.getElementById('bioCourseNote');
const bioFactsList = document.querySelector('.bio-facts-list');
const bioFactsShuffle = document.querySelector('.bio-facts-shuffle');
const bioFactsShuffleIcon = bioFactsShuffle.querySelector('svg');
const siteControls = document.querySelector('.site-controls');
let shuffleAnimationTimer = 0;

function activateBioStoryTab(tab, moveFocus = false) {
  const selectedPanelId = tab.getAttribute('aria-controls');
  const tabIndex = bioStoryTabs.indexOf(tab);
  bioStoryTabs.forEach((item) => {
    const isSelected = item === tab;
    item.classList.toggle('is-active', isSelected);
    item.setAttribute('aria-selected', String(isSelected));
    item.tabIndex = isSelected ? 0 : -1;
  });
  bioStoryPanels.forEach((panel) => {
    panel.hidden = panel.id !== selectedPanelId;
    panel.classList.toggle('is-active', panel.id === selectedPanelId);
  });
  bioStoryStep.firstChild.textContent = `${String(tabIndex + 1).padStart(2, '0')} `;
  if (moveFocus) tab.focus();
}

bioStoryTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateBioStoryTab(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % bioStoryTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + bioStoryTabs.length) % bioStoryTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = bioStoryTabs.length - 1;
    else return;
    event.preventDefault();
    activateBioStoryTab(bioStoryTabs[nextIndex], true);
  });
});

bioPhotoBack.inert = true;
bioPhotoFlip.addEventListener('click', () => {
  const isFlipped = bioPhotoFlip.classList.toggle('is-flipped');
  bioPhotoFlip.setAttribute('aria-pressed', String(isFlipped));
  bioPhotoFlip.setAttribute('aria-label', isFlipped ? 'Show photo' : 'Show photo caption');
  bioPhotoFront.setAttribute('aria-hidden', String(isFlipped));
  bioPhotoBack.setAttribute('aria-hidden', String(!isFlipped));
  bioPhotoFront.inert = isFlipped;
  bioPhotoBack.inert = !isFlipped;
});

bioCourseToggle.addEventListener('click', () => {
  const isExpanded = bioCourseToggle.getAttribute('aria-expanded') !== 'true';
  bioCourseToggle.setAttribute('aria-expanded', String(isExpanded));
  bioCourseNote.hidden = !isExpanded;
});

bioFactsList.addEventListener('click', (event) => {
  const button = event.target.closest('.bio-fact-toggle');
  if (!button) return;
  button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true'));
});

bioFactsShuffle.addEventListener('click', () => {
  const items = Array.from(bioFactsList.children);
  const startingPositions = new Map(items.map((item) => [item, item.getBoundingClientRect()]));
  const shuffledItems = items.slice();
  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[swapIndex]] = [shuffledItems[swapIndex], shuffledItems[index]];
  }
  if (shuffledItems.every((item, index) => item === items[index]) && shuffledItems.length > 1) {
    shuffledItems.push(shuffledItems.shift());
  }
  shuffledItems.forEach((item) => bioFactsList.appendChild(item));

  bioFactsShuffle.classList.remove('is-shuffling');
  window.clearTimeout(shuffleAnimationTimer);
  if (!reduceMotion) {
    void bioFactsShuffleIcon.offsetWidth;
    bioFactsShuffle.classList.add('is-shuffling');
    shuffleAnimationTimer = window.setTimeout(() => {
      bioFactsShuffle.classList.remove('is-shuffling');
    }, 500);

    shuffledItems.forEach((item) => {
      const previous = startingPositions.get(item);
      const current = item.getBoundingClientRect();
      const offsetY = previous.top - current.top;
      if (offsetY) {
        item.animate(
          [{ transform: `translateY(${offsetY}px)` }, { transform: 'translateY(0)' }],
          { duration: 360, easing: 'ease-out' }
        );
      }
    });
  }
});

let bioOverlapFrame = 0;
function updateSiteControlsOverlap() {
  const controlsRect = siteControls.getBoundingClientRect();
  const overlapsContent = Array.from(document.querySelectorAll(
    '.bio-panels > .bio-panel, .bio-quote-card, .project-card:not([hidden]), .game-card, .contact-card'
  ))
    .some((card) => {
      const cardRect = card.getBoundingClientRect();
      return controlsRect.left < cardRect.right
        && controlsRect.right > cardRect.left
        && controlsRect.top < cardRect.bottom
        && controlsRect.bottom > cardRect.top;
    });
  const controlsHaveFocus = siteControls.contains(document.activeElement);
  siteControls.classList.toggle('is-content-overlap', overlapsContent && !controlsHaveFocus);
}

function scheduleSiteControlsOverlapUpdate() {
  if (bioOverlapFrame) return;
  bioOverlapFrame = window.requestAnimationFrame(() => {
    updateSiteControlsOverlap();
    bioOverlapFrame = 0;
  });
}

window.addEventListener('scroll', scheduleSiteControlsOverlapUpdate, { passive: true });
window.addEventListener('resize', scheduleSiteControlsOverlapUpdate);
siteControls.addEventListener('focusin', () => siteControls.classList.remove('is-content-overlap'));
siteControls.addEventListener('focusout', scheduleSiteControlsOverlapUpdate);
updateSiteControlsOverlap();

const quoteCarousel = document.getElementById('quoteCarousel');
const quoteSlides = Array.from(quoteCarousel.querySelectorAll('.quote-slide'));
const quoteIndicators = Array.from(quoteCarousel.querySelectorAll('.quote-indicator'));
const quoteCard = quoteCarousel.closest('.bio-quote-card');
const quoteBackdrops = Array.from(quoteCard.querySelectorAll('.quote-backdrop'));
const quoteBackgrounds = [
  'images/quote-backgrounds/quote-cats-1.png',
  'images/quote-backgrounds/quote-cats-2.png',
  'images/quote-backgrounds/quote-cats-3.png',
  'images/quote-backgrounds/quote-cats-4.png',
  'images/quote-backgrounds/quote-cats-5.png'
];
const quoteRotationDelay = 5000;
let activeQuoteIndex = 0;
let quoteRotationTimer = 0;
let quoteHovered = false;
let quoteMarkAnimationTimer = 0;
let activeBackdropIndex = 0;

quoteBackdrops[0].style.backgroundImage =
  `linear-gradient(rgba(255, 248, 241, 0.58), rgba(255, 248, 241, 0.58)), url("${quoteBackgrounds[0]}")`;

bioProgressItems.forEach((item) => {
  item.style.setProperty('--skill-progress-value', `${item.dataset.progress}%`);
});

function showQuote(index) {
  activeQuoteIndex = (index + quoteSlides.length) % quoteSlides.length;
  quoteCard.dataset.quoteTheme = String(activeQuoteIndex);
  if (activeBackdropIndex !== activeQuoteIndex) {
    const nextBackdropIndex = 1 - quoteBackdrops.findIndex((backdrop) => backdrop.classList.contains('is-active'));
    const nextBackdrop = quoteBackdrops[nextBackdropIndex];
    const currentBackdrop = quoteBackdrops[1 - nextBackdropIndex];
    nextBackdrop.style.backgroundImage =
      `linear-gradient(rgba(255, 248, 241, 0.58), rgba(255, 248, 241, 0.58)), url("${quoteBackgrounds[activeQuoteIndex]}")`;
    void nextBackdrop.offsetWidth;
    nextBackdrop.classList.add('is-active');
    currentBackdrop.classList.remove('is-active');
    activeBackdropIndex = activeQuoteIndex;
  }
  quoteSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeQuoteIndex;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
    slide.querySelector('p').setAttribute('aria-live', isActive ? 'polite' : 'off');
  });
  quoteIndicators.forEach((indicator, indicatorIndex) => {
    const isActive = indicatorIndex === activeQuoteIndex;
    indicator.classList.toggle('is-active', isActive);
    indicator.setAttribute('aria-pressed', String(isActive));
  });

  quoteCard.classList.remove('is-quote-changing');
  window.clearTimeout(quoteMarkAnimationTimer);
  if (!motionPreference.matches) {
    void quoteCard.offsetWidth;
    quoteCard.classList.add('is-quote-changing');
    quoteMarkAnimationTimer = window.setTimeout(() => {
      quoteCard.classList.remove('is-quote-changing');
    }, 600);
  }
}

function stopQuoteRotation() {
  window.clearInterval(quoteRotationTimer);
  quoteRotationTimer = 0;
}

function startQuoteRotation() {
  stopQuoteRotation();
  if (quoteHovered || document.hidden) return;
  quoteRotationTimer = window.setInterval(() => showQuote(activeQuoteIndex + 1), quoteRotationDelay);
}

quoteIndicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    showQuote(index);
    startQuoteRotation();
  });
});

quoteCard.addEventListener('pointerenter', () => {
  quoteHovered = true;
  stopQuoteRotation();
});
quoteCard.addEventListener('pointerleave', () => {
  quoteHovered = false;
  startQuoteRotation();
});
document.addEventListener('visibilitychange', startQuoteRotation);
startQuoteRotation();

if (bioStatsCard && (reduceMotion || !('IntersectionObserver' in window))) {
  bioStatsCard.classList.add('is-visible');
} else if (bioStatsCard) {
  const bioStatsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      bioStatsCard.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  bioStatsObserver.observe(bioStatsCard);
}

if (!reduceMotion && 'IntersectionObserver' in window) {
  revealTargets.forEach((element) => {
    if (element.matches('.about, .bio, .activities, .mini-game, .contact')) {
      element.classList.add('section-reveal');
    }
    element.classList.add('reveal-on-scroll');
  });
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  revealTargets.forEach((element) => revealObserver.observe(element));
}
