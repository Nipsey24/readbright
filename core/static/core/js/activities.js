/* ═══ WORD MATCHING GAME ══════════════════════════════ */
const wordPairs = [
  { emoji: '🐶', word: 'DOG' },
  { emoji: '🐱', word: 'CAT' },
  { emoji: '🌞', word: 'SUN' },
  { emoji: '🌳', word: 'TREE' },
  { emoji: '🍎', word: 'APPLE' },
  { emoji: '📚', word: 'BOOK' },
  { emoji: '🚂', word: 'TRAIN' },
  { emoji: '🏠', word: 'HOUSE' },
];

let matchScore = 0;
let selected = null;
let matched = new Set();

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildMatchGame() {
  matchScore = 0;
  selected = null;
  matched = new Set();
  document.getElementById('matchScore').textContent = '⭐ 0 pairs';

  const pairs = shuffle(wordPairs).slice(0, 4);
  const cards = shuffle([
    ...pairs.map(p => ({ type: 'emoji', value: p.emoji, key: p.word })),
    ...pairs.map(p => ({ type: 'word',  value: p.word,  key: p.word })),
  ]);

  const grid = document.getElementById('matchGrid');
  grid.innerHTML = '';

  cards.forEach((card, idx) => {
    const div = document.createElement('div');
    div.className = 'match-card';
    div.textContent = card.value;
    div.dataset.key = card.key;
    div.dataset.idx = idx;
    div.dataset.type = card.type;
    div.addEventListener('click', () => onMatchClick(div));
    grid.appendChild(div);
  });
}

function onMatchClick(div) {
  if (div.classList.contains('matched')) return;
  if (selected === div) { div.classList.remove('selected'); selected = null; return; }

  if (!selected) {
    div.classList.add('selected');
    selected = div;
    return;
  }

  // Two selected
  if (selected.dataset.key === div.dataset.key && selected.dataset.type !== div.dataset.type) {
    selected.classList.remove('selected');
    selected.classList.add('matched');
    div.classList.add('matched');
    matchScore++;
    document.getElementById('matchScore').textContent = `⭐ ${matchScore} pair${matchScore > 1 ? 's' : ''}`;
    selected = null;
    if (matchScore === 4) setTimeout(() => showToast('🎉 All matched! Amazing!'), 300);
  } else {
    selected.classList.add('wrong');
    div.classList.add('wrong');
    const prev = selected;
    selected = null;
    setTimeout(() => {
      prev.classList.remove('selected', 'wrong');
      div.classList.remove('selected', 'wrong');
    }, 700);
  }
}

document.getElementById('resetMatch').addEventListener('click', buildMatchGame);
buildMatchGame();

/* ═══ SPELLING CHALLENGE ══════════════════════════════ */
const spellWords = ['cat','dog','sun','hat','big','run','hop','map','fun','sit','red','cup','bed','leg','jam','nap','fog','wet','tip','bun'];
let spellIndex = 0;
let spellScore2 = 0;
let currentWord = '';

function nextSpellWord() {
  currentWord = spellWords[Math.floor(Math.random() * spellWords.length)];
  document.getElementById('spellDisplay').textContent = '🔊 Press "Hear the Word"';
  document.getElementById('spellInput').value = '';
  document.getElementById('spellFeedback').textContent = '';
}

document.getElementById('btnListenWord').addEventListener('click', () => {
  if (!currentWord) nextSpellWord();
  const u = new SpeechSynthesisUtterance(currentWord);
  u.rate = 0.7; u.lang = 'en-GB';
  speechSynthesis.speak(u);
  showToast('🔊 Listen carefully!');
});

document.getElementById('btnCheckSpell').addEventListener('click', () => {
  const typed = document.getElementById('spellInput').value.trim().toLowerCase();
  const fb = document.getElementById('spellFeedback');
  if (!typed) { fb.textContent = '✏️ Type the word first!'; fb.style.color = 'var(--orange)'; return; }
  if (typed === currentWord) {
    fb.textContent = '✅ Correct! Well done! 🌟';
    fb.style.color = 'var(--green)';
    spellScore2++;
    document.getElementById('spellScore').textContent = `⭐ ${spellScore2} correct`;
    showToast('🌟 Brilliant spelling!');
  } else {
    fb.textContent = `❌ Not quite! The word was: ${currentWord.toUpperCase()}`;
    fb.style.color = 'var(--pink)';
  }
});

document.getElementById('btnNextWord').addEventListener('click', nextSpellWord);
nextSpellWord();

/* ═══ READING PRACTICE ════════════════════════════════ */
const passages = [
  "The big red dog ran fast. He jumped over the log and sat by the pond. The sun was warm and bright.",
  "Sam loves to read books. She reads every day before bed. Her favourite book is about a brave little mouse.",
  "The train went past the town. It was green and long. The children waved from the bridge as it zoomed by.",
  "Every morning Ben makes his bed. Then he has toast and orange juice. He feeds his cat Pip and goes to school.",
];

let passageIdx = 0;

function buildPassage(text) {
  const container = document.getElementById('readingPassage');
  container.innerHTML = '';
  text.split(' ').forEach(word => {
    const span = document.createElement('span');
    span.className = 'r-word';
    span.textContent = word + ' ';
    span.addEventListener('click', () => {
      document.querySelectorAll('.r-word').forEach(w => w.classList.remove('active'));
      span.classList.add('active');
      const u = new SpeechSynthesisUtterance(word);
      u.rate = 0.75; u.lang = 'en-GB';
      speechSynthesis.speak(u);
    });
    container.appendChild(span);
  });
}

document.getElementById('btnReadAll').addEventListener('click', () => {
  const text = passages[passageIdx % passages.length];
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.75; u.lang = 'en-GB';
  let wordIdx = 0;
  const words = document.querySelectorAll('.r-word');
  u.onboundary = (e) => {
    words.forEach(w => w.classList.remove('active'));
    if (words[wordIdx]) words[wordIdx].classList.add('active');
    wordIdx++;
  };
  speechSynthesis.speak(u);
  showToast('🔊 Reading passage...');
});

document.getElementById('btnNewPassage').addEventListener('click', () => {
  passageIdx++;
  buildPassage(passages[passageIdx % passages.length]);
});

buildPassage(passages[0]);
