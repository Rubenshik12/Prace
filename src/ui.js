
import { format } from './format.js';

export function appTemplate() {
  return `
  <div class="shell">
    <header class="hero">
      <div class="heroRow">
        <div><h1>Моя робота</h1><p>Архітектура v6 Alpha</p></div>
        <button class="iconBtn" id="themeButton">◐</button>
      </div>
    </header>

    <main>
      <section class="view active" id="homeView">
        <div class="topGrid">
          <button class="card topAction" id="monthCard">
            <div class="label">Місяць</div>
            <div class="value" id="monthLabel"></div>
            <div class="sub">Натисни, щоб змінити</div>
          </button>
          <button class="card topAction" id="rateCard">
            <div class="label">Базова ставка</div>
            <div class="value" id="rateLabel"></div>
            <div class="sub">Kč за годину</div>
          </button>
        </div>

        <div class="metrics">
          <div class="card metric"><div class="label">Змін</div><strong id="countValue">0</strong><div class="sub">за місяць</div></div>
          <div class="card metric"><div class="label">Годин</div><strong id="hoursValue">0:00</strong><div class="sub">відпрацьовано</div></div>
          <div class="card metric"><div class="label">1–15 число</div><strong id="firstValue">0 Kč</strong><div class="sub">перша виплата</div></div>
          <div class="card metric"><div class="label">16–кінець</div><strong id="secondValue">0 Kč</strong><div class="sub">друга виплата</div></div>
        </div>

        <div class="card activeCard inactive" id="activeCard">
          <div class="statusRow"><b id="statusText">Зміна не почата</b><span id="statusBadge"></span></div>
          <div class="timer" id="timer">0:00:00</div>
          <div class="livePay">Зароблено зараз: <b id="livePay">0 Kč</b></div>
          <button class="primary start" id="startButton">Я прийшов зараз</button>
          <button class="secondary" id="manualStartButton">Вказати час приходу</button>
          <button class="primary stop" id="stopButton">Закінчити зміну</button>
          <button class="dangerLink" id="cancelButton">Скасувати помилковий старт</button>
        </div>

        <div class="sectionTitle"><h2>Останні зміни</h2><button class="smallBtn" id="addShiftButton">＋ Додати</button></div>
        <div class="card list" id="shiftList"></div>
      </section>

      <section class="view" id="historyView">
        <div class="sectionTitle"><h2>Історія змін</h2></div>
        <div class="card list" id="historyList"></div>
      </section>

      <section class="view" id="analyticsView">
        <div class="sectionTitle"><h2>Аналітика</h2></div>
        <div class="metrics">
          <div class="card metric"><div class="label">Заробіток</div><strong id="totalValue">0 Kč</strong><div class="sub">за місяць</div></div>
          <div class="card metric"><div class="label">Середня зміна</div><strong id="averageValue">0:00</strong><div class="sub">тривалість</div></div>
        </div>
      </section>

      <section class="view" id="settingsView">
        <div class="sectionTitle"><h2>Налаштування</h2></div>
        <div class="card settingsCard">
          <div class="setting"><div><b>Ставка</b><div class="sub">Для нових змін</div></div><input id="settingsRate" type="number"></div>
          <div class="setting"><div><b>Тема</b><div class="sub">Світла або темна</div></div><select id="settingsTheme"><option value="light">Світла</option><option value="dark">Темна</option></select></div>
        </div>
      </section>
    </main>
  </div>

  <nav class="bottomNav">
    <button class="nav active" data-view="homeView"><span>⌂</span>Головна</button>
    <button class="nav" data-view="historyView"><span>☷</span>Зміни</button>
    <button class="nav" data-view="analyticsView"><span>⌁</span>Аналітика</button>
    <button class="nav" data-view="settingsView"><span>⚙︎</span>Налаштування</button>
  </nav>

  <dialog id="monthDialog"><div class="modal"><h3>Вибрати місяць</h3><select id="monthSelect"></select><select id="yearSelect"></select><div class="modalActions"><button id="cancelMonth">Скасувати</button><button class="save" id="saveMonth">Готово</button></div></div></dialog>
  <dialog id="rateDialog"><div class="modal"><h3>Базова ставка</h3><input id="rateInput" type="number"><div class="modalActions"><button id="cancelRate">Скасувати</button><button class="save" id="saveRate">Зберегти</button></div></div></dialog>
  <dialog id="startDialog"><div class="modal"><h3>Час приходу</h3><input id="startDate" type="date"><input id="startTime" type="time"><div class="modalActions"><button id="cancelStart">Скасувати</button><button class="save" id="saveStart">Почати</button></div></div></dialog>
  <dialog id="shiftDialog"><div class="modal"><h3 id="shiftDialogTitle">Нова зміна</h3><input id="shiftDate" type="date"><input id="shiftStart" type="time"><input id="shiftEnd" type="time"><input id="shiftRate" type="number"><div class="modalActions"><button id="deleteShift">Видалити</button><button class="save" id="saveShift">Зберегти</button></div></div></dialog>
  `;
}

export function renderShiftRows(container, shifts, payFn, onClick) {
  container.innerHTML = '';
  if (!shifts.length) {
    container.innerHTML = '<div class="empty">Ще немає змін</div>';
    return;
  }
  for (const shift of shifts) {
    const row = document.createElement('div');
    row.className = 'shift';
    row.innerHTML = `
      <div>
        <b>${format.date(shift.start)}</b>
        <div class="meta">${format.time(shift.start)} → ${format.time(shift.end)}</div>
      </div>
      <div>
        <div class="money">${format.money(payFn(shift))}</div>
        <div class="hours">${format.duration((new Date(shift.end)-new Date(shift.start))/60000)} год</div>
      </div>`;
    row.onclick = () => onClick(shift.id);
    container.appendChild(row);
  }
}
