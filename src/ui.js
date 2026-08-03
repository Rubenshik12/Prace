
export function template(){
 return `<div class="shell">
 <header class="hero"><div class="heroRow"><div><div class="greeting" id="greeting"></div><h1>Моя робота</h1><p>Час • зарплата • плани</p><div class="appVersion">v11.3 Shift Details</div></div><div class="heroButtons"><button class="iconButton" id="themeButton">◐</button><button class="iconButton" data-open="settingsView">⚙︎</button></div></div></header>
 <main>
  <section class="view active" id="homeView">
  <section class="card dayHero" id="dayHero">
    <div class="dayHeroTop">
      <div>
        <div class="eyebrow">Мій день</div>
        <h2 id="todayTitle">Сьогодні</h2>
        <p id="todaySubtitle">Все важливе в одному місці</p>
      </div>
      <div class="dayStatus" id="dayStatus">Не на роботі</div>
    </div>

    <div class="workMode inactive" id="workMode">
      <div class="workModeLabel" id="workModeLabel">Зміна не почата</div>
      <div class="workTimer" id="timer">0:00:00</div>
      <div class="workMoney">Зароблено зараз <strong id="livePay">0 Kč</strong></div>

      <button class="primary start" id="startButton">Я прийшов зараз</button>
      <button class="secondary" id="manualStartButton">Вказати час приходу</button>
      <div class="workTasksBlock" id="workTasksBlock">
       <div class="workTasksHead">
        <div><span>Робочі завдання</span><small>Поточна зміна</small></div>
        <strong id="workTasksCounter">0/0</strong>
       </div>
       <form class="quickWorkTaskForm" id="quickWorkTaskForm">
        <input id="quickWorkTaskInput" type="text" autocomplete="off" enterkeyhint="done" placeholder="Що потрібно зробити?">
        <button id="quickWorkTaskAdd" type="submit" aria-label="Додати завдання">＋</button>
       </form>
       <div class="workTasksList" id="workTasksList"></div>
      </div>
      <button class="primary stop" id="stopButton">Закінчити зміну</button>
      <button class="secondary" id="editStartButton">Змінити час приходу</button>
      <button class="dangerLink" id="cancelButton">Скасувати помилковий старт</button>
    </div>

    <div class="dayOverview" id="dayOverview">
      <div class="overviewItem">
        <span>Зароблено сьогодні</span>
        <strong id="todayPayValue">0 Kč</strong>
      </div>
      <div class="overviewItem">
        <span>Планів залишилось</span>
        <strong id="todayPlansValue">0</strong>
      </div>
    </div>
  </section>

  <div class="quickActions">
    <button class="quickAction" id="quickShift">
      <span>＋</span>
      <b>Нова зміна</b>
    </button>
    <button class="quickAction" id="quickPlan">
      <span>✓</span>
      <b>Новий план</b>
    </button>
    <button class="quickAction" data-open-view="calendarView">
      <span>▦</span>
      <b>Календар</b>
    </button>
    <button class="quickAction" data-open-view="statsView">
      <span>⌁</span>
      <b>Статистика</b>
    </button>
  </div>

  <div class="sectionTitle">
    <h2>Поточний місяць</h2>
    <button class="textAction" id="homeMonthButton"><span id="homeMonthLabel"></span> ›</button>
  </div>

  <div class="homeMetrics">
    <div class="card compactMetric">
      <span>Змін</span>
      <strong id="countValue">0</strong>
    </div>
    <div class="card compactMetric">
      <span>Годин</span>
      <strong id="hoursValue">0:00</strong>
    </div>
    <div class="card compactMetric wideMetric">
      <span>Зароблено</span>
      <strong id="totalHomeValue">0 Kč</strong>
      <div class="goalTrack" id="goalTrack">
        <div class="goalFill" id="goalFill"></div>
      </div>
      <small id="goalText">Фінансова ціль вимкнена</small>
    </div>
    <div class="card compactMetric">
      <span>Ставка</span>
      <strong id="homeRateValue">0 Kč</strong>
    </div>
  </div>

  <div class="sectionTitle">
    <h2>Сьогоднішні плани</h2>
    <button class="textAction" data-open-view="plansView">Показати всі ›</button>
  </div>
  <div class="card plans homePlans" id="homePlansList"></div>

  <div class="sectionTitle">
    <h2>Останні зміни</h2>
    <button class="textAction" data-open-view="statsView">Показати всі ›</button>
  </div>
  <div class="card list" id="recentList"></div>
</section>

<section class="view" id="calendarView">
 <div class="sectionTitle"><h2>Календар</h2><button class="smallButton" id="calendarTodayButton">Сьогодні</button></div>
 <div class="calendarSummary">
      <div class="card calendarStat"><span>Змін</span><strong id="calendarShiftCount">0</strong></div>
      <div class="card calendarStat"><span>Годин</span><strong id="calendarHours">0:00</strong></div>
      <div class="card calendarStat"><span>Зароблено</span><strong id="calendarPay">0 Kč</strong></div>
    </div>
    <div class="card calendarMonthBar">
  <button class="calendarArrow" id="calendarPrevMonth">‹</button>
  <button class="calendarMonthTitle" id="calendarMonthButton"><span class="label">Місяць</span><strong id="calendarMonthLabel"></strong></button>
  <button class="calendarArrow" id="calendarNextMonth">›</button>
 </div>
 <div class="card calendar"><div class="calendarHead"><div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Нд</div></div><div class="calendarGrid" id="calendarGrid"></div></div></section>
  <section class="view" id="statsView">
 <div class="statsHeader">
  <div>
   <div class="eyebrow">Аналітика роботи</div>
   <h2>Статистика</h2>
  </div>
  <button class="smallButton" id="statsMonthButton"><span id="statsMonthLabel"></span> ▾</button>
 </div>

 <div class="statsGrid">
  <div class="card statHero">
   <span>Зароблено</span>
   <strong id="statsTotalPay">0 Kč</strong>
   <small id="statsPayChange">Немає даних для порівняння</small>
  </div>
  <div class="card statCard">
   <span>Годин</span>
   <strong id="statsHours">0:00</strong>
   <small id="statsHoursChange">—</small>
  </div>
  <div class="card statCard">
   <span>Змін</span>
   <strong id="statsShiftCount">0</strong>
   <small id="statsShiftChange">—</small>
  </div>
  <div class="card statCard">
   <span>Середня зміна</span>
   <strong id="statsAverageShift">0:00</strong>
   <small>тривалість</small>
  </div>
 </div>

 <div class="card chartCard">
  <div class="chartHeader">
   <div>
    <span class="label">Накопичення зарплати</span>
    <strong id="cumulativeChartTitle">0 Kč</strong>
   </div>
  </div>
  <div class="lineChartWrap">
   <svg id="cumulativeChart" class="lineChart" viewBox="0 0 320 150" preserveAspectRatio="none"></svg>
  </div>
  <div class="chartAxis" id="cumulativeAxis"></div>
 </div>

 <div class="card chartCard">
  <div class="chartHeader">
   <div>
    <span class="label">Заробіток по днях</span>
    <strong id="dailyChartTitle">Найкращий день: —</strong>
   </div>
  </div>
  <div class="barChart" id="dailyBarChart"></div>
 </div>

 <div class="sectionTitle"><h2>Аналітика</h2></div>
 <div class="analyticsGrid">
  <div class="card analyticsCard"><span>Найдовша зміна</span><strong id="longestShiftValue">0:00</strong><small id="longestShiftDate">—</small></div>
  <div class="card analyticsCard"><span>Найкоротша зміна</span><strong id="shortestShiftValue">0:00</strong><small id="shortestShiftDate">—</small></div>
  <div class="card analyticsCard"><span>Найкращий день</span><strong id="bestDayValue">0 Kč</strong><small id="bestDayDate">—</small></div>
  <div class="card analyticsCard"><span>Середній дохід</span><strong id="averageDayValue">0 Kč</strong><small>за робочий день</small></div>
  <div class="card analyticsCard"><span>Середній початок</span><strong id="averageStartValue">—</strong><small>час приходу</small></div>
  <div class="card analyticsCard"><span>Середній кінець</span><strong id="averageEndValue">—</strong><small>час виходу</small></div>
 </div>

 <div class="card goalAnalyticsCard">
  <div class="goalAnalyticsTop">
   <div>
    <span class="label">Фінансова ціль</span>
    <strong id="statsGoalTitle">Ціль не задана</strong>
   </div>
   <span id="statsGoalPercent">0%</span>
  </div>
  <div class="goalTrack"><div class="goalFill" id="statsGoalFill"></div></div>
  <p id="statsGoalText">Задай ціль у налаштуваннях</p>
 </div>

 <div class="card comparisonCard">
  <div class="label">Порівняння з минулим місяцем</div>
  <div class="comparisonRows">
   <div><span>Заробіток</span><strong id="comparePay">—</strong></div>
   <div><span>Години</span><strong id="compareHours">—</strong></div>
   <div><span>Зміни</span><strong id="compareShifts">—</strong></div>
  </div>
 </div>

 <div class="sectionTitle"><h2>Усі зміни</h2></div>
 <div class="card list" id="allList"></div>
</section>

<section class="view" id="plansView">
 <div class="plansHeader">
  <div>
   <div class="eyebrow">Організуй свій день</div>
   <h2>Плани</h2>
  </div>
  <button class="smallButton" id="addPlanButton">＋ Додати</button>
 </div>

 <div class="plansTabs">
  <button class="planTab active" data-plan-filter="today">Сьогодні</button>
  <button class="planTab" data-plan-filter="tomorrow">Завтра</button>
  <button class="planTab" data-plan-filter="all">Усі</button>
 </div>

 <div class="card plansProgressCard">
  <div class="progressRing" id="plansProgressRing">
   <div class="progressRingInner">
    <strong id="plansProgressCount">0/0</strong>
    <span>виконано</span>
   </div>
  </div>
  <div class="plansProgressText">
   <span class="label">На сьогодні</span>
   <strong id="plansProgressTitle">Планів немає</strong>
   <p id="plansProgressSubtitle">Додай перший план</p>
  </div>
 </div>

 <div class="categoryScroller" id="categoryScroller">
  <button class="categoryChip active" data-category="all">Усі</button>
  <button class="categoryChip" data-category="work">💼 Робота</button>
  <button class="categoryChip" data-category="personal">👤 Особисте</button>
  <button class="categoryChip" data-category="shopping">🛒 Покупки</button>
  <button class="categoryChip" data-category="study">📚 Навчання</button>
  <button class="categoryChip" data-category="other">✨ Інше</button>
 </div>

 <div class="card plans premiumPlans" id="plansList"></div>
</section>

<section class="view" id="shiftDetailsView">
      <div class="detailsTopBar">
       <button class="detailsBackButton" id="shiftDetailsBack">‹</button>
       <div>
        <div class="eyebrow">Деталі зміни</div>
        <h2 id="shiftDetailsDate">Зміна</h2>
       </div>
       <button class="detailsMoreButton" id="shiftDetailsEdit">Редагувати</button>
      </div>

      <div class="card shiftSummaryHero">
       <div class="shiftSummaryTimes">
        <div><span>Початок</span><strong id="shiftDetailsStart">—</strong></div>
        <div class="shiftArrow">→</div>
        <div><span>Кінець</span><strong id="shiftDetailsEnd">—</strong></div>
       </div>
       <div class="shiftSummaryMain">
        <div><span>Тривалість</span><strong id="shiftDetailsDuration">0:00</strong></div>
        <div><span>Зароблено</span><strong id="shiftDetailsPay">0 Kč</strong></div>
       </div>
      </div>

      <div class="detailsMetrics">
       <div class="card detailsMetric"><span>Ставка</span><strong id="shiftDetailsRate">0 Kč</strong><small>за годину</small></div>
       <div class="card detailsMetric"><span>Чайові</span><strong id="shiftDetailsTips">0 Kč</strong><small>за зміну</small></div>
       <div class="card detailsMetric"><span>Понаднормово</span><strong id="shiftDetailsOvertime">0:00</strong><small>після норми</small></div>
       <div class="card detailsMetric"><span>Завдань</span><strong id="shiftDetailsTasksCount">0/0</strong><small>виконано</small></div>
      </div>

      <div class="sectionTitle"><h2>Робочі завдання</h2></div>
      <div class="card detailsTasksList" id="shiftDetailsTasks"></div>

      <div class="sectionTitle"><h2>Нотатка</h2></div>
      <div class="card detailsNote" id="shiftDetailsNote">Нотатки немає</div>

      <div class="detailsActions">
       <button class="detailsAction primaryAction" id="shiftDetailsEditBottom">Редагувати</button>
       <button class="detailsAction secondaryAction" id="shiftDetailsDuplicate">Дублювати</button>
       <button class="detailsAction dangerAction" id="shiftDetailsDelete">Видалити</button>
      </div>
     </section>

     <section class="view" id="settingsView">
 <div class="sectionTitle"><h2>Налаштування</h2></div>
 <div class="card settingsCard">
  <div class="setting"><div><b>Базова ставка</b><div class="hint">Для нових змін</div></div><input id="settingsRate" type="number"></div>
  <div class="setting"><div><b>Тема</b><div class="hint">Світла або темна</div></div><select id="settingsTheme"><option value="light">Світла</option><option value="dark">Темна</option></select></div>
    <div class="setting"><div><b>Фінансова ціль</b><div class="hint">Необов’язково, за місяць</div></div><input id="goalAmount" type="number" min="0" placeholder="0"></div>
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
 <dialog id="shiftDialog"><div class="modal"><h3 id="shiftTitle">Нова зміна</h3><label>Дата</label><input id="shiftDate" type="date"><label>Прийшов</label><input id="shiftStart" type="time"><label>Пішов</label><input id="shiftEnd" type="time"><label>Ставка</label><input id="shiftRate" type="number"><div id="holidayField"><label class="inlineCheck"><input id="shiftHoliday" type="checkbox"> Святковий день</label></div><div id="tipsField"><label>Чайові</label><input id="shiftTips" type="number" value="0"></div><label>Примітка</label><input id="shiftNote" type="text" placeholder="Необов’язково">
    <div class="archivedTasksBox" id="archivedTasksBox">
     <div class="label">Завдання зміни</div>
     <div id="archivedTasksList"></div>
    </div>
    <div class="modalActions"><button id="deleteShift">Видалити</button><button class="save" id="saveShift">Зберегти</button></div></div></dialog>
 <dialog id="planDialog"><div class="modal"><h3 id="planDialogTitle">Новий план</h3>
    <label>Дата</label><input id="planDate" type="date">
    <label>Час</label><input id="planTime" type="time">
    <label>Завдання</label><input id="planText" type="text" placeholder="Що потрібно зробити?">
    <label>Категорія</label><select id="planCategory">
      <option value="work">Робота</option>
      <option value="personal">Особисте</option>
      <option value="shopping">Покупки</option>
      <option value="study">Навчання</option>
      <option value="other">Інше</option>
    </select>
    <label>Пріоритет</label><select id="planPriority">
      <option value="normal">Звичайний</option>
      <option value="high">Важливий</option>
      <option value="low">Низький</option>
    </select>
    <label>Повторення</label><select id="planRepeat">
      <option value="none">Не повторювати</option>
      <option value="daily">Щодня</option>
      <option value="weekly">Щотижня</option>
      <option value="monthly">Щомісяця</option>
    </select>
    <div class="modalActions"><button id="deletePlanDialog">Видалити</button><button class="save" id="savePlan">Зберегти</button></div>
    <button class="dangerLink" id="cancelPlan">Закрити</button></div></dialog>
 <dialog id="dayDialog"><div class="modal"><h3 id="dayDialogTitle">День</h3><div id="dayDialogSummary" class="daySummary"></div><div id="dayPlansSummary" class="dayPlansSummary"></div>
    <div class="dayNoteBox">
      <label>Нотатка дня</label>
      <textarea id="dayNote" rows="3" placeholder="Наприклад: важкий день, заміна колеги…"></textarea>
      <button class="editChip" id="saveDayNote">Зберегти нотатку</button>
    </div>
    <div id="dayDialogList" class="dayShiftList"></div><button class="secondary" id="addPlanForDay">＋ Додати план цього дня</button><button class="secondary" id="addShiftForDay">＋ Додати зміну цього дня</button><button class="dangerLink" id="closeDayDialog">Закрити</button></div></dialog>`;
}
