'use strict';
const puzzles = JSON.parse(document.getElementById('puzzleData').textContent);
const $ = id => document.getElementById(id);
const KEY = 'logic-lab-progress-v1';
let progress = {}, storageAvailable = true;
try { const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    for (const p of puzzles) if (['solved','revealed'].includes(saved[p.id])) progress[p.id] = saved[p.id];
  }
} catch (_) { storageAvailable = false; }
let current = 0, hintsShown = 0;
function save() { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch (_) { storageAvailable = false; } }
function updateProgress() {
  const solved = puzzles.filter(p => progress[p.id] === 'solved').length;
  $('progressLabel').textContent = `${solved} / ${puzzles.length} solved`;
  $('progressFill').style.width = `${100 * solved / puzzles.length}%`;
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', solved);
  $('completion').hidden = solved !== puzzles.length;
  $('storageNote').textContent = storageAvailable ? 'Progress stays in this browser. Revealed solutions are marked separately.' : 'Browser storage is unavailable. Progress will last only for this visit.';
  $('puzzleList').replaceChildren(...puzzles.map((p, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'puzzle-link';
    button.setAttribute('aria-current', String(index === current));
    button.setAttribute('aria-label', `${p.id}. ${p.title}${progress[p.id] ? ', '+progress[p.id] : ''}`);
    const number = document.createElement('span'); number.className = 'nav-number'; number.textContent = String(p.id).padStart(2,'0');
    const title = document.createElement('span'); title.className = 'nav-title'; title.textContent = p.title;
    const state = document.createElement('span'); state.className = 'nav-state'; state.setAttribute('aria-hidden','true'); state.textContent = progress[p.id] === 'solved' ? '✓' : progress[p.id] === 'revealed' ? '◉' : '';
    button.append(number,title,state); button.addEventListener('click', () => navigate(index)); return button;
  }));
}
function navigate(index) { location.hash = `puzzle-${puzzles[index].id}`; }
function render(focus = false) {
  const match = location.hash.match(/^#puzzle-(\d+)$/);
  current = match ? Math.max(0,puzzles.findIndex(p => p.id === Number(match[1]))) : 0;
  const p = puzzles[current]; hintsShown = 0;
  $('category').textContent = p.category; $('difficulty').textContent = p.level;
  $('number').textContent = String(p.id).padStart(2,'0'); $('title').textContent = p.title;
  document.title = `${p.title} — Logic Lab`; $('prompt').textContent = p.prompt;
  $('options').replaceChildren(...p.options.map((text,index) => {
    const label = document.createElement('label'); label.className = 'option';
    const input = document.createElement('input'); input.type = 'radio'; input.name = 'answer'; input.value = index;
    const letter = document.createElement('span'); letter.className = 'letter'; letter.textContent = 'ABCD'[index]; letter.setAttribute('aria-hidden','true');
    const content = document.createElement('span'); content.className = 'option-text'; content.textContent = text;
    label.append(input,letter,content); return label;
  }));
  $('feedback').textContent = ''; $('feedback').className = ''; $('hints').replaceChildren();
  $('hintButton').disabled = false; $('hintButton').textContent = 'Give me a hint';
  $('solution').hidden = true; $('explanation').textContent = `${p.options[p.answer]} — ${p.explanation}`;
  $('reveal').textContent = 'Reveal the reasoning'; $('reveal').setAttribute('aria-expanded','false');
  $('check').disabled = false; $('previous').disabled = current === 0; $('next').disabled = current === puzzles.length - 1;
  $('position').textContent = `${p.id} of ${puzzles.length}`; updateProgress();
  if (focus) $('title').focus({preventScroll:true});
}
$('answerForm').addEventListener('submit', event => {
  event.preventDefault(); const chosen = document.querySelector('input[name="answer"]:checked');
  if (!chosen) { $('feedback').textContent = 'Choose an answer first.'; $('feedback').className = ''; return; }
  const p = puzzles[current]; const correct = Number(chosen.value) === p.answer;
  $('feedback').className = correct ? 'success' : '';
  if (correct) {
    const revealed = progress[p.id] === 'revealed';
    if (!revealed) progress[p.id] = 'solved'; save(); updateProgress();
    $('feedback').textContent = revealed ? 'That’s correct. This puzzle stays marked as solution viewed.' : 'That’s correct. Can you explain why? Open the reasoning to compare.';
    $('check').disabled = true;
  } else $('feedback').textContent = 'Not quite. Revisit the assumptions, or try a hint.';
});
$('hintButton').addEventListener('click', () => {
  const p = puzzles[current]; if (hintsShown >= p.hints.length) return;
  const hint = document.createElement('div'); hint.className = 'hint'; hint.textContent = `Hint ${hintsShown+1}: ${p.hints[hintsShown++]}`; $('hints').append(hint);
  $('hintButton').disabled = hintsShown === p.hints.length;
  $('hintButton').textContent = hintsShown === p.hints.length ? 'All hints shown' : 'Another hint';
});
$('reveal').addEventListener('click', () => {
  const opening = $('solution').hidden; $('solution').hidden = !opening;
  $('reveal').setAttribute('aria-expanded',String(opening)); $('reveal').textContent = opening ? 'Hide the reasoning' : 'Reveal the reasoning';
  if (opening && progress[puzzles[current].id] !== 'solved') { progress[puzzles[current].id] = 'revealed'; save(); updateProgress(); }
});
$('previous').addEventListener('click', () => { if(current > 0) navigate(current-1); });
$('next').addEventListener('click', () => { if(current < puzzles.length-1) navigate(current+1); });
window.addEventListener('hashchange', () => render(true)); render();
