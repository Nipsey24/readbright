/* ── Font Size Control ─────────────────────────── */
let fs = parseInt(localStorage.getItem('rb_fs') || '20');
document.body.style.fontSize = fs + 'px';

document.getElementById('btn-fu').addEventListener('click', () => {
  fs = Math.min(fs + 2, 34);
  document.body.style.fontSize = fs + 'px';
  localStorage.setItem('rb_fs', fs);
  showToast('Text bigger! 🔎');
});

document.getElementById('btn-fd').addEventListener('click', () => {
  fs = Math.max(fs - 2, 16);
  document.body.style.fontSize = fs + 'px';
  localStorage.setItem('rb_fs', fs);
  showToast('Text smaller! 🔍');
});

/* ── Dark Mode ─────────────────────────────────── */
if (localStorage.getItem('rb_dark') === '1') document.body.classList.add('dark');

document.getElementById('btn-dark').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('rb_dark', document.body.classList.contains('dark') ? '1' : '0');
  showToast(document.body.classList.contains('dark') ? '🌙 Dark mode on!' : '☀️ Light mode on!');
});

/* ── Dyslexic Font Toggle ──────────────────────── */
let dyslexicOn = localStorage.getItem('rb_dys') === '1';
applyDysFont();

document.getElementById('btn-dysfont').addEventListener('click', () => {
  dyslexicOn = !dyslexicOn;
  applyDysFont();
  localStorage.setItem('rb_dys', dyslexicOn ? '1' : '0');
  showToast(dyslexicOn ? '🔤 Dyslexic font on!' : '🔤 Standard font');
});

function applyDysFont() {
  if (dyslexicOn) {
    document.body.style.fontFamily = "'OpenDyslexic', 'Nunito', Georgia, serif";
  } else {
    document.body.style.fontFamily = "'Nunito', Georgia, serif";
  }
}

/* ── Text-to-Speech ────────────────────────────── */
function speakText(text) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.82; u.pitch = 1.1; u.lang = 'en-GB';
  const voices = speechSynthesis.getVoices();
  const nice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen'));
  if (nice) u.voice = nice;
  speechSynthesis.speak(u);
  showToast('🔊 Reading now...');
}

document.getElementById('btn-tts').addEventListener('click', () => {
  const allText = document.querySelectorAll('h1, h2, h3, p');
  let fullText = '';
  allText.forEach(el => { fullText += el.innerText + '. '; });
  speakText(fullText);
});

document.getElementById('btn-stop').addEventListener('click', () => {
  speechSynthesis.cancel();
  showToast('⏹ Stopped.');
});

/* ── Click-to-speak ────────────────────────────── */
document.querySelectorAll('p, h1, h2, h3').forEach(el => {
  el.style.cursor = 'pointer';
  el.title = 'Click to hear this read aloud';
  el.addEventListener('click', () => speakText(el.innerText));
});

/* ── Toast ──────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* ── Scroll-reveal ──────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeUp 0.6s ${i * 0.1}s ease both`;
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.feature-card, .tip-card, .step, .about-card, .activity-card, .tool-card').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});
