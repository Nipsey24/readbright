/* ═══ TEXT-TO-SPEECH TOOL ════════════════════════════ */
let ttsUtterance = null;

document.getElementById('ttsPlay').addEventListener('click', () => {
  const text = document.getElementById('ttsInput').value.trim();
  if (!text) { showToast('✏️ Type some text first!'); return; }
  speechSynthesis.cancel();
  ttsUtterance = new SpeechSynthesisUtterance(text);
  const speed = parseFloat(document.getElementById('ttsSpeed').value);
  ttsUtterance.rate = speed;
  ttsUtterance.pitch = 1.1;
  ttsUtterance.lang = 'en-GB';
  speechSynthesis.speak(ttsUtterance);
  showToast('🔊 Playing!');
});

document.getElementById('ttsPause').addEventListener('click', () => {
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
    showToast('⏸ Paused');
  } else if (speechSynthesis.paused) {
    speechSynthesis.resume();
    showToast('▶️ Resumed');
  }
});

document.getElementById('ttsStop2').addEventListener('click', () => {
  speechSynthesis.cancel();
  showToast('⏹ Stopped');
});

document.getElementById('ttsSpeed').addEventListener('input', function() {
  document.getElementById('speedVal').textContent = parseFloat(this.value).toFixed(2);
});

/* ═══ READING RULER ══════════════════════════════════ */
let rulerActive = false;
const ruler = document.getElementById('readingRuler');
const preview = document.getElementById('rulerPreview');

function updateRulerColor() {
  const color = document.getElementById('rulerColor').value;
  ruler.style.background = color;
}
updateRulerColor();

document.getElementById('btnRuler').addEventListener('click', () => {
  rulerActive = !rulerActive;
  ruler.style.display = rulerActive ? 'block' : 'none';
  showToast(rulerActive ? '📏 Ruler on — move your mouse!' : '📏 Ruler off');
});

document.getElementById('rulerColor').addEventListener('change', updateRulerColor);

document.addEventListener('mousemove', (e) => {
  if (rulerActive) {
    ruler.style.top = (e.clientY - 19) + 'px';
  }
});

/* ═══ FONT SIZE PREVIEW ══════════════════════════════ */
let previewSize = 22;
const fontPrev = document.getElementById('fontPreview');

document.getElementById('fpUp').addEventListener('click', () => {
  previewSize = Math.min(previewSize + 2, 40);
  fontPrev.style.fontSize = previewSize + 'px';
  // Also apply globally
  let fs = parseInt(document.body.style.fontSize || '20') + 2;
  fs = Math.min(fs, 34);
  document.body.style.fontSize = fs + 'px';
  localStorage.setItem('rb_fs', fs);
  showToast('Text bigger! 🔎');
});

document.getElementById('fpDown').addEventListener('click', () => {
  previewSize = Math.max(previewSize - 2, 14);
  fontPrev.style.fontSize = previewSize + 'px';
  let fs = parseInt(document.body.style.fontSize || '20') - 2;
  fs = Math.max(fs, 16);
  document.body.style.fontSize = fs + 'px';
  localStorage.setItem('rb_fs', fs);
  showToast('Text smaller! 🔍');
});

document.getElementById('fpReset').addEventListener('click', () => {
  previewSize = 22;
  fontPrev.style.fontSize = previewSize + 'px';
  document.body.style.fontSize = '20px';
  localStorage.setItem('rb_fs', '20');
  showToast('↺ Font size reset');
});

/* ═══ COLOUR OVERLAY ═════════════════════════════════ */
let overlayEl = null;

document.querySelectorAll('.swatch').forEach(btn => {
  btn.addEventListener('click', () => {
    const color = btn.dataset.color;
    if (overlayEl) overlayEl.remove();
    if (color === 'none') { overlayEl = null; showToast('🌈 Overlay off'); return; }
    overlayEl = document.createElement('div');
    overlayEl.style.cssText = `
      position:fixed; inset:0; pointer-events:none;
      z-index:400; background:${color};
    `;
    document.body.appendChild(overlayEl);
    showToast('🌈 Overlay on!');
  });
});
