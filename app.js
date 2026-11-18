const video = document.querySelector('#dance');
const music = document.querySelector('#music');
const toggle = document.querySelector('#sound-toggle');
const label = document.querySelector('#sound-label');
const claimCta = document.querySelector('#claim-cta');
let manuallyMuted = false;
video.muted = true;
function updateSound() {
  const playing = !music.muted && !music.paused;
  toggle.setAttribute('aria-pressed', String(playing));
  toggle.setAttribute('aria-label', playing ? '关闭音乐' : '开启音乐');
  label.textContent = playing ? '音乐已开启' : '开启音乐';
}
function alignDance() {
  if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0 && !music.paused) {
    video.currentTime = music.currentTime % video.duration;
  }
}
async function startWithSound() {
  music.muted = false;
  try { await music.play(); updateSound(); return true; }
  catch (_) { updateSound(); return false; }
}
function removeGestureListeners() {
  document.removeEventListener('pointerdown', onFirstGesture, true);
  document.removeEventListener('keydown', onFirstGesture, true);
}
async function onFirstGesture(event) {
  if (manuallyMuted || toggle.contains(event.target)) return;
  if (await startWithSound()) removeGestureListeners();
}
toggle.addEventListener('click', async () => {
  if (!music.muted && !music.paused) {
    manuallyMuted = true; music.muted = true; removeGestureListeners();
  } else {
    manuallyMuted = false;
    if (await startWithSound()) removeGestureListeners();
  }
  updateSound();
});
music.addEventListener('play', updateSound);
music.addEventListener('playing', alignDance);
music.addEventListener('pause', updateSound);
music.addEventListener('volumechange', updateSound);
music.addEventListener('error', () => { label.textContent = '播放失败，请刷新'; });
video.addEventListener('loadeddata', alignDance);
document.addEventListener('pointerdown', onFirstGesture, true);
document.addEventListener('keydown', onFirstGesture, true);
// The small audio file starts independently; video download never blocks music.
startWithSound().then(success => { if (success) removeGestureListeners(); });
video.play().catch(() => {});

claimCta.addEventListener('click', (event) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const destination = claimCta.href;
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'CompleteRegistration');
    window.fbq('track', 'Contact');
  }
  window.setTimeout(() => window.location.assign(destination), 250);
});
