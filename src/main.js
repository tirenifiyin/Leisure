import './style.css';

const STORAGE_KEY = 'daylight-planner-v2';
const LEGACY_KEY = 'daylight-tasks-v1';
const app = document.querySelector('#app');
const today = toDateKey(new Date());
let tasks = loadTasks();
let selectedDate = today;
let visibleMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedFilter = 'all';
let activeSection = 'tasks';
let sudokuValues = '530070000600195000098000060800060003400803001700020006060000280000419005000080079'.split('').map(Number);
let crosswordValues = Array(25).fill('');
let theme = localStorage.getItem('daylight-theme') || 'day';

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadTasks() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    const saved = JSON.parse(current || localStorage.getItem(LEGACY_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter((task) => task && typeof task.id === 'string' && typeof task.text === 'string').map((task) => ({
      date: task.date || today,
      notified: Boolean(task.notified),
      ...task,
    }));
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function prettyDate(key, options = { weekday: 'long', month: 'long', day: 'numeric' }) {
  return new Intl.DateTimeFormat(undefined, options).format(new Date(`${key}T12:00:00`));
}

function formatDateTime(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function taskCard(task) {
  return `<li class="task-row ${task.done ? 'is-done' : ''}" data-id="${escapeHtml(task.id)}">
    <button class="check-button" type="button" data-action="toggle" aria-label="${task.done ? 'Mark incomplete' : 'Mark complete'}: ${escapeHtml(task.text)}"><span>${task.done ? '✓' : ''}</span></button>
    <div class="task-copy"><span class="task-text">${escapeHtml(task.text)}</span><span class="task-meta">${task.deadline ? `⏰ Due ${escapeHtml(formatDateTime(task.deadline))}` : ''}${task.reminder ? `　🔔 ${escapeHtml(formatDateTime(task.reminder))}` : ''}</span></div>
    <button class="edit-button" type="button" data-action="edit" aria-label="Edit task title">✎</button>
    <button class="delete-button" type="button" data-action="delete" aria-label="Delete task">×</button>
  </li>`;
}

function renderCalendar() {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push('<span class="calendar-blank"></span>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = toDateKey(new Date(year, month, day));
    const count = tasks.filter((task) => task.date === key).length;
    cells.push(`<button type="button" class="calendar-day ${key === selectedDate ? 'chosen' : ''} ${key === today ? 'is-today' : ''}" data-date="${key}" aria-label="${prettyDate(key)}${count ? `, ${count} tasks` : ''}">${day}${count ? `<i>${Math.min(count, 9)}</i>` : ''}</button>`);
  }
  return `<section class="calendar-card card">
    <div class="calendar-head"><div><p class="section-kicker">PICK A DAY</p><h2>${new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(visibleMonth)}</h2></div>
      <div class="month-controls"><button type="button" data-month="-1" aria-label="Previous month">‹</button><button type="button" data-month="1" aria-label="Next month">›</button></div></div>
    <div class="calendar-grid calendar-weekdays">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => `<span>${day}</span>`).join('')}</div>
    <div class="calendar-grid">${cells.join('')}</div>
  </section>`;
}

function renderTasks() {
  const todaysTasks = tasks.filter((task) => task.date === selectedDate);
  const filtered = todaysTasks.filter((task) => selectedFilter === 'all' || (selectedFilter === 'active' ? !task.done : task.done));
  const done = todaysTasks.filter((task) => task.done).length;
  const progress = todaysTasks.length ? Math.round((done / todaysTasks.length) * 100) : 0;
  return `<section class="section-intro"><p class="eyebrow">A LITTLE SPACE TO RESET</p><h1>Make today<br><span>count.</span></h1><p class="date-line">${prettyDate(selectedDate)} ${selectedDate === today ? '· Today' : ''}</p></section>
    <div class="planner-layout">${renderCalendar()}<section class="planner-card card" aria-label="Tasks for ${prettyDate(selectedDate)}">
      <div class="card-heading"><div><p class="section-kicker">YOUR PLAN</p><h2>${selectedDate === today ? 'Today’s tasks' : 'Your tasks'} <span class="task-count">${todaysTasks.length}</span></h2></div><div class="progress-ring" style="--progress:${progress * 3.6}deg"><span>${progress}<small>%</small></span></div></div>
      <form class="task-form" id="task-form"><label class="sr-only" for="task-input">Task name</label><input id="task-input" maxlength="120" placeholder="What would you like to get done?" autocomplete="off" required /><button class="add-button" type="submit"><span>+</span><span class="add-label">Add task</span></button>
        <label class="field-label">Day<input type="date" name="task-date" value="${selectedDate}" required /></label><label class="field-label">Deadline <input type="datetime-local" name="deadline" /></label><label class="field-label">Reminder <input type="datetime-local" name="reminder" /></label>
      </form>
      <button class="notify-button" type="button" data-action="enable-notifications">🔔 Enable reminders</button>
      <div class="list-toolbar"><span class="list-caption">YOUR LIST <span class="caption-line"></span></span><div class="filters" role="group" aria-label="Filter tasks">${[['all', 'All'], ['active', 'To do'], ['done', 'Done']].map(([id, label]) => `<button class="filter-button ${selectedFilter === id ? 'selected' : ''}" data-filter="${id}" type="button">${label}</button>`).join('')}</div></div>
      <ul class="task-list" aria-live="polite">${filtered.length ? filtered.map(taskCard).join('') : `<li class="empty-state"><span class="empty-sun">☼</span><strong>${todaysTasks.length ? 'Nothing in this view.' : 'A fresh page.'}</strong><span>${todaysTasks.length ? 'Try another filter or add a task.' : 'Add something lovely to your day.'}</span></li>`}</ul>
      <footer class="card-footer"><span class="footer-spark">✳</span><span>${todaysTasks.length && done === todaysTasks.length ? 'Everything on your list is done. Beautiful work!' : 'One step at a time is still progress.'}</span><span class="footer-progress">${done} OF ${todaysTasks.length} DONE</span></footer>
    </section></div>`;
}

function renderWeekly() {
  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return toDateKey(date);
  });
  const weekTasks = tasks.filter((task) => dates.includes(task.date));
  const completed = weekTasks.filter((task) => task.done).length;
  const rating = weekTasks.length ? Math.round((completed / weekTasks.length) * 100) : 0;
  const mood = rating >= 80 ? 'Superstar' : rating >= 55 ? 'Steady star' : rating >= 25 ? 'Growing' : weekTasks.length ? 'Fresh start' : 'Rest & reset';
  const bars = dates.map((date) => {
    const dayTasks = weekTasks.filter((task) => task.date === date);
    const dayDone = dayTasks.filter((task) => task.done).length;
    const height = dayTasks.length ? Math.max(8, Math.round((dayDone / dayTasks.length) * 100)) : 4;
    return `<div class="week-day"><div class="bar-track"><i style="height:${height}%" title="${dayDone} of ${dayTasks.length} tasks"></i></div><strong>${dayDone}/${dayTasks.length}</strong><span>${prettyDate(date, { weekday: 'short' })}</span></div>`;
  }).join('');
  return `<section class="section-intro compact"><p class="eyebrow">A MOMENT TO LOOK BACK</p><h1>Your week,<br><span>in bloom.</span></h1><p class="date-line">The last seven days, one little win at a time.</p></section>
    <section class="weekly-card card"><div class="weekly-top"><div><p class="section-kicker">YOUR PRODUCTIVITY RATING</p><h2>${mood} <span class="rating-emoji">${rating >= 80 ? '🌟' : rating >= 55 ? '🌼' : '🌱'}</span></h2><p class="weekly-copy">${weekTasks.length ? `${completed} of ${weekTasks.length} tasks finished` : 'Add a few tasks this week to see your wrap-up.'}</p></div><div class="rating-bubble">${rating}<small>/100</small></div></div>
      <div class="week-chart">${bars}</div><div class="wrap-note">${rating >= 80 ? 'You showed up for yourself all week. Look at you go!' : 'Every small step counts. Be kind to yourself and keep going.'}</div></section>`;
}

function renderPuzzles() {
  const original = '530070000600195000098000060800060003400803001700020006060000280000419005000080079'.split('').map(Number);
  const sudoku = sudokuValues.map((value, index) => {
    const fixed = original[index] !== 0;
    return `<input class="sudoku-cell ${fixed ? 'fixed' : ''} ${index % 9 === 2 || index % 9 === 5 ? 'box-right' : ''} ${Math.floor(index / 9) % 3 === 2 ? 'box-bottom' : ''}" inputmode="numeric" maxlength="1" data-sudoku="${index}" value="${value || ''}" ${fixed ? 'readonly' : ''} aria-label="Sudoku row ${Math.floor(index / 9) + 1}, column ${index % 9 + 1}" />`;
  }).join('');
  const crossword = Array.from({ length: 25 }, (_, index) => {
    const row = Math.floor(index / 5);
    const column = index % 5;
    const active = row === 2 || column === 2;
    if (!active) return '<span class="crossword-gap"></span>';
    return `<input class="crossword-cell" maxlength="1" data-crossword="${index}" value="${escapeHtml(crosswordValues[index])}" aria-label="Crossword row ${row + 1}, column ${column + 1}" />`;
  }).join('');
  return `<section class="section-intro compact"><p class="eyebrow">PLAY A LITTLE</p><h1>Brain breaks<br><span>for you.</span></h1><p class="date-line">A playful pause is productive, too.</p></section>
    <div class="puzzle-layout"><section class="puzzle-card card"><div class="puzzle-title"><span class="puzzle-sticker">🔢</span><div><p class="section-kicker">PUZZLE 01</p><h2>Sudoku</h2></div></div><p class="puzzle-instructions">Fill each row, column, and 3×3 box with the numbers 1–9.</p><div class="sudoku-grid">${sudoku}</div><button class="soft-button" type="button" data-action="check-sudoku">Check my grid</button></section>
    <section class="puzzle-card card"><div class="puzzle-title"><span class="puzzle-sticker">🧩</span><div><p class="section-kicker">PUZZLE 02</p><h2>Mini crossword</h2></div></div><p class="puzzle-instructions">Type one letter in each sunny square.</p><div class="crossword-grid">${crossword}</div><div class="clues"><p><b>Across · 1</b> A living thing that grows in soil (5)</p><p><b>Down · 2</b> A legless reptile (5)</p></div><button class="soft-button" type="button" data-action="check-crossword">Check my answers</button></section></div>`;
}

function render() {
  const sectionContent = activeSection === 'weekly' ? renderWeekly() : activeSection === 'puzzles' ? renderPuzzles() : renderTasks();
  app.innerHTML = `<main class="page-shell" data-theme="${theme}"><header class="topbar"><a class="brand" href="#" aria-label="Ìràwọ̀ home"><span class="brand-mark">✳</span> Ìràwọ̀</a><div class="top-actions"><span class="today-pill"><span class="live-dot"></span> YOUR DAILY SPACE</span><button class="theme-toggle" type="button" data-action="theme" aria-label="Switch to ${theme === 'day' ? 'night' : 'day'} mode">${theme === 'day' ? '🌙' : '☀️'} <span>${theme === 'day' ? 'Night' : 'Day'}</span></button></div></header>
    <nav class="main-nav" aria-label="Main sections">${[['tasks', '☀️', 'My days'], ['weekly', '📊', 'Weekly wrap'], ['puzzles', '🧩', 'Puzzles']].map(([id, icon, label]) => `<button type="button" class="nav-button ${activeSection === id ? 'active' : ''}" data-section="${id}"><span>${icon}</span>${label}</button>`).join('')}</nav>
    ${sectionContent}<p class="offline-note"><span class="offline-icon">◉</span> Your list stays on this device and works offline.</p></main><div class="toast" role="status" aria-live="polite"></div>`;
  bindEvents();
}

function showToast(message) {
  const toast = document.querySelector('.toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('visible'), 2600);
}

function bindEvents() {
  document.querySelectorAll('[data-section]').forEach((button) => button.addEventListener('click', () => { activeSection = button.dataset.section; render(); }));
  document.querySelector('[data-action="theme"]').addEventListener('click', () => { theme = theme === 'day' ? 'night' : 'day'; localStorage.setItem('daylight-theme', theme); render(); });
  document.querySelectorAll('[data-month]').forEach((button) => button.addEventListener('click', () => { visibleMonth.setMonth(visibleMonth.getMonth() + Number(button.dataset.month)); render(); }));
  document.querySelectorAll('[data-date]').forEach((button) => button.addEventListener('click', () => { selectedDate = button.dataset.date; selectedFilter = 'all'; render(); }));
  document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => { selectedFilter = button.dataset.filter; render(); }));

  const form = document.querySelector('#task-form');
  if (form) form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const text = document.querySelector('#task-input').value.trim();
    if (!text) return;
    const reminder = data.get('reminder');
    if (reminder && 'Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch { /* permission can be unavailable in embedded browsers */ }
    }
    tasks.unshift({ id: crypto.randomUUID(), text, done: false, date: data.get('task-date'), deadline: data.get('deadline') || '', reminder: reminder || '', notified: false });
    saveTasks();
    selectedDate = data.get('task-date');
    render();
    showToast('Task added to your day!');
  });

  const list = document.querySelector('.task-list');
  if (list) list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const row = button.closest('.task-row');
    const task = tasks.find((item) => item.id === row?.dataset.id);
    if (!task) return;
    if (button.dataset.action === 'toggle') {
      task.done = !task.done;
      task.completedAt = task.done ? today : '';
    }
    if (button.dataset.action === 'delete') tasks = tasks.filter((item) => item.id !== task.id);
    if (button.dataset.action === 'edit') {
      const updated = window.prompt('Edit your task title', task.text);
      if (updated === null) return;
      if (!updated.trim()) { showToast('A task needs a name'); return; }
      task.text = updated.trim();
    }
    saveTasks(); render();
  });

  document.querySelector('[data-action="enable-notifications"]')?.addEventListener('click', async () => {
    if (!('Notification' in window)) { showToast('Notifications are not supported in this browser'); return; }
    const result = await Notification.requestPermission();
    showToast(result === 'granted' ? 'Reminders are enabled while Ìràwọ̀ is open' : 'Allow notifications in your browser settings');
  });

  document.querySelectorAll('[data-sudoku]').forEach((input) => input.addEventListener('input', () => {
    const index = Number(input.dataset.sudoku);
    const value = input.value.replace(/[^1-9]/g, '').slice(-1);
    sudokuValues[index] = Number(value) || 0;
    input.value = value;
  }));
  document.querySelector('[data-action="check-sudoku"]')?.addEventListener('click', () => {
    const valid = sudokuValues.every((value, index) => {
      if (!value) return false;
      const row = Math.floor(index / 9); const col = index % 9;
      return sudokuValues.every((other, otherIndex) => otherIndex === index || other !== value || (Math.floor(otherIndex / 9) !== row && otherIndex % 9 !== col && (Math.floor(Math.floor(otherIndex / 9) / 3) !== Math.floor(row / 3) || Math.floor((otherIndex % 9) / 3) !== Math.floor(col / 3))));
    });
    showToast(valid ? 'Sudoku solved! Look at that brain!' : 'Not quite yet—check each row, column, and box.');
  });
  document.querySelectorAll('[data-crossword]').forEach((input) => input.addEventListener('input', () => {
    const index = Number(input.dataset.crossword); crosswordValues[index] = input.value.toUpperCase().replace(/[^A-Z]/g, '').slice(-1); input.value = crosswordValues[index];
  }));
  document.querySelector('[data-action="check-crossword"]')?.addEventListener('click', () => {
    const across = [10, 11, 12, 13, 14].map((index) => crosswordValues[index]).join('');
    const down = [2, 7, 12, 17, 22].map((index) => crosswordValues[index]).join('');
    showToast(across === 'PLANT' && down === 'SNAKE' ? 'Both clues solved! You’re a word wizard!' : 'Keep puzzling—Across starts with P, Down starts with S.');
  });
}

function checkReminders() {
  const now = Date.now();
  let changed = false;
  for (const task of tasks) {
    if (!task.done && task.reminder && !task.notified && new Date(task.reminder).getTime() <= now) {
      task.notified = true;
      changed = true;
      if ('Notification' in window && Notification.permission === 'granted') new Notification('Ìràwọ̀ reminder', { body: task.text, icon: '/icon.svg', tag: task.id });
      else showToast(`Reminder: ${task.text}`);
    }
  }
  if (changed) saveTasks();
}

render();
window.setInterval(checkReminders, 20_000);
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
