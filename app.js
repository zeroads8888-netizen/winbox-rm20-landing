const video = document.querySelector('#dance');
const toggle = document.querySelector('#sound-toggle');
const label = document.querySelector('#sound-label');
let manuallyMuted = false;
function updateSound() {
  const playing = !video.muted && !video.paused;
  toggle.setAttribute('aria-pressed', String(playing));
  toggle.setAttribute('aria-label', playing ? '关闭音乐' : '开启音乐');
  label.textContent = playing ? '音乐已开启' : '开启音乐';
}
async function startWithSound() {
  video.muted = false;
  try { await video.play(); updateSound(); return true; }
  catch (_) { video.muted = true; try { await video.play(); } catch (_) {} updateSound(); return false; }
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
  if (!video.muted && !video.paused) {
    manuallyMuted = true; video.muted = true; removeGestureListeners();
  } else {
    manuallyMuted = false;
    if (await startWithSound()) removeGestureListeners();
  }
  updateSound();
});
video.addEventListener('play', updateSound);
video.addEventListener('pause', updateSound);
video.addEventListener('volumechange', updateSound);
video.addEventListener('error', () => { label.textContent = '播放失败，请刷新'; });
document.addEventListener('pointerdown', onFirstGesture, true);
document.addEventListener('keydown', onFirstGesture, true);
startWithSound().then(success => { if (success) removeGestureListeners(); });
