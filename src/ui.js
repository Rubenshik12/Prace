
export function template(){
 return `<div class="shell">
 <header class="hero"><div class="heroRow"><div><div class="greeting" id="greeting"></div><h1>Моя робота</h1><p>Час • зарплата • плани</p></div><div class="heroButtons"><button class="iconButton" id="themeButton">◐</button><button class="iconButton" data-open="settingsView">⚙︎</button></div></div></header>
 <main>
  <section class="view active" id="homeView">
   <div class="card monthBar"><button class="monthArrow" id="prevMonth">‹</button><button class="monthCenter" id="monthButton"><span class="label">Вибраний місяць</span><strong id="monthLabel"></strong></button><button class="monthArrow" id="nextMonth">›</button></div>
   <div class="card rateRow"><div><div class="label">Базова ставка</div><div class="rateValue" id="rateLabel"></div><div class="hint">Kč за годину</div></div><button class="editChip" id="rateButton">Змінити</button></div>
   <div class="metrics">
    <div class="card metric"><div class="label">Змін</div><strong id="countValue">0</strong><div class="hint">за місяць</div></div>
    <div class="card metric"><div class="label">Годин</div><strong id="hoursValue">0:00</strong><div class="hint">відпрацьовано</div></div>
    <div class="card metric"><div class="label">1–15 число</div><strong id="firstValue">0 Kč</strong><div class="hint">перша виплата</div></div>
    <div class="card metric"><div class="label">16–кінець</div><strong id="secondValue">0 Kč</strong><div class="hint">друга виплата</div></div>
   </div>
   <div class="card activeCard inactive" id="activeCard"><div class="statusRow"><b id="statusText">Зміна не почата</b><span class="statusBadge" id="statusBadge"></span></div><div class="timer" id="timer">0:00:00</div><div class="livePay">Зароблено зараз: <b id="livePay">0 Kč</b></div><button class="primary start" id="startButton">Я прийшов зараз</button><button class="secondary" id="manualStartButton">Вказати час приходу</button><button class="primary stop" id="stopButton">Закінчити зміну</button><button class="dangerLink" id="cancelButton">Скасувати помилковий старт</button></div>
   <div class="sectionTitle"><h2>Останні зміни</h2><button class="smallButton" id="addShiftButton">＋ Додати</button></div><div class="card list" id="recentList"></div>
  </section>
  <section class="view" id="calendarView"><div class="sectionTitle"><h2>Календар</h2><button class="smallButton" id="calendarTodayButton">Сьогодні</button></div><div class="card calendar"><div class="calendarHead"><div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Нд</div></div><div class="calendarGrid" id="calendarGrid"></div></div></section>
  <section class="view" id="statsView"><div class="sectionTitle"><h2>Статистика</h2></div><div class="metrics"><div class="card metric"><div class="label">Заробіток</div><strong id="totalValue">0 Kč</strong><div class="hint">за місяць</div></div><div class="card metric"><div class="label">Середня зміна</div><strong id="avgValue">0:00</strong><div class="hint">тривалість</div></div></div><div class="sectionTitle"><h2>Усі зміни</h2></div><div class="card list" id="allList"></div></section>
  <section class="view" id="plansView">
 <div class="sectionTitle"><h2>Плани</h2><button class="smallButton" id="addPlanButton">＋ Новий план</button></div>
 <div class="planFilters">
  <button class="filterChip active" data-plan-filter="all">Усі</button>
  <button class="filterChip" data-plan-filter="today">Сьогодні</button>
  <button class="filterChip" data-plan-filter="open">Невиконані</button>
 </div>
 <div class="card plans" id="plansList"></div>
</section>
  <section class="view" id="settingsView">
 <div class="sectionTitle"><h2>Налаштування</h2></div>
 <div class="card settingsCard">
  <div class="setting"><div><b>Базова ставка</b><div class="hint">Для нових змін</div></div><input id="settingsRate" type="number"></div>
  <div class="setting"><div><b>Тема</b><div class="hint">Світла або темна</div></div><select id="settingsTheme"><option value="light">Світла</option><option value="dark">Темна</option></select></div>
 </div>
 <div class="sectionTitle"><h2>Доплати</h2></div>
 <div class="card settingsCard">
  <div class="setting"><div><b>Понаднормові</b><div class="hint">Після вибраної кількості годин</div></div><button class="switch" id="overtimeSwitch"></button></div>
  <div class="setting compactSetting" id="overtimeOptions"><div><b>Після / доплата</b><div class="hint">години та %</div></div><div class="doubleInputs"><input id="overtimeAfter" type="number"><input id="overtimePercent" type="number"></div></div>
  <div class="setting"><div><b>Вихідні</b><div class="hint">Доплата у суботу й неділю</div></div><button class="switch" id="weekendSwitch"></button></div>
  <div class="setting compactSetting" id="weekendOptions"><div><b>Доплата</b><div class="hint">у відсотках</div></div><input id="weekendPercent" type="number"></div>
  <div class="setting"><div><b>Свята</b><div class="hint">Позначаються в конкретній зміні</div></div><button class="switch" id="holidaySwitch"></button></div>
  <div class="setting compactSetting" id="holidayOptions"><div><b>Доплата</b><div class="hint">у відсотках</div></div><input id="holidayPercent" type="number"></div>
  <div class="setting"><div><b>Чайові</b><div class="hint">Додаткове поле в зміні</div></div><button class="switch" id="tipsSwitch"></button></div>
  <div class="setting"><div><b>Дві виплати</b><div class="hint">1–15 та 16–кінець</div></div><button class="switch" id="paySplitSwitch"></button></div>
 </div>
</section>
 </main></div>
 <nav class="bottomNav"><button class="nav active" data-view="homeView"><span>⌂</span>Головна</button><button class="nav" data-view="calendarView"><span>▦</span>Календар</button><button class="nav" data-view="statsView"><span>⌁</span>Статистика</button><button class="nav" data-view="plansView"><span>✓</span>Плани</button><button class="nav" data-view="settingsView"><span>⚙︎</span>Налаштування</button></nav>
 <dialog id="monthDialog"><div class="modal"><h3>Вибрати місяць</h3><label>Місяць</label><select id="monthSelect"></select><label>Рік</label><select id="yearSelect"></select><div class="modalActions"><button id="cancelMonth">Скасувати</button><button class="save" id="saveMonth">Готово</button></div></div></dialog>
 <dialog id="rateDialog"><div class="modal"><h3>Базова ставка</h3><label>Kč за годину</label><input id="rateInput" type="number"><div class="modalActions"><button id="cancelRate">Скасувати</button><button class="save" id="saveRate">Зберегти</button></div></div></dialog>
 <dialog id="startDialog"><div class="modal"><h3>Час приходу</h3><label>Дата</label><input id="startDate" type="date"><label>Час</label><input id="startTime" type="time"><div class="modalActions"><button id="cancelStart">Скасувати</button><button class="save" id="saveStart">Почати</button></div></div></dialog>
 <dialog id="shiftDialog"><div class="modal"><h3 id="shiftTitle">Нова зміна</h3><label>Дата</label><input id="shiftDate" type="date"><label>Прийшов</label><input id="shiftStart" type="time"><label>Пішов</label><input id="shiftEnd" type="time"><label>Ставка</label><input id="shiftRate" type="number"><div id="holidayField"><label class="inlineCheck"><input id="shiftHoliday" type="checkbox"> Святковий день</label></div><div id="tipsField"><label>Чайові</label><input id="shiftTips" type="number" value="0"></div><label>Примітка</label><input id="shiftNote" type="text" placeholder="Необов’язково"><div class="modalActions"><button id="deleteShift">Видалити</button><button class="save" id="saveShift">Зберегти</button></div></div></dialog>
 <dialog id="planDialog"><div class="modal"><h3>Новий план</h3><label>Дата</label><input id="planDate" type="date"><label>Завдання</label><input id="planText" type="text" placeholder="Що потрібно зробити?"><label>Пріоритет</label><select id="planPriority"><option value="normal">Звичайний</option><option value="high">Важливий</option><option value="low">Низький</option></select><div class="modalActions"><button id="cancelPlan">Скасувати</button><button class="save" id="savePlan">Додати</button></div></div></dialog>
 <dialog id="dayDialog"><div class="modal"><h3 id="dayDialogTitle">День</h3><div id="dayDialogSummary" class="daySummary"></div><div id="dayDialogList" class="dayShiftList"></div><button class="secondary" id="addShiftForDay">＋ Додати зміну цього дня</button><button class="dangerLink" id="closeDayDialog">Закрити</button></div></dialog>`;
}
