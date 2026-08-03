
export function template(){
 return `<div class="shell">
 <header class="hero finalTopBar">
      <div class="finalTopInner">
       <button class="profileCompactButton" id="profileHeaderButton" aria-label="Профілі">
        <span id="profileHeaderInitial">М</span>
        <span class="profileCompactText">
         <b id="topProfileName">Мій профіль</b>
         <small id="topProfileMeta">180 Kč/год</small>
        </span>
       </button>
       <div class="heroButtons">
        <button class="iconButton" id="themeButton" aria-label="Змінити тему">◐</button>
        <button class="iconButton" data-open="settingsView" aria-label="Відкрити профіль">⚙︎</button>
       </div>
      </div>
      <button class="activeJobChip" id="activeJobChip"><span class="activeJobDot" id="activeJobDot"></span><span><small>Активна робота</small><b id="activeJobChipName">Основна робота</b></span><span class="activeJobChevron">›</span></button>
      <div class="appVersion finalVersion">v15.5 Navigation Architecture Fix</div>
     </header>
 <main>
  <section class="view active finalHome" id="homeView">
  <section class="card finalShiftCard" id="dayHero">
   <div class="finalShiftHead">
    <div>
     <div class="eyebrow">Поточна зміна</div>
     <h2 id="todayTitle">Сьогодні</h2>
     <p id="todaySubtitle">Зміна не почата</p>
    </div>
    <div class="dayStatus" id="dayStatus">Не на роботі</div>
   </div>

   <div class="workMode inactive finalWorkMode" id="workMode">
    <div class="finalShiftValues">
     <div class="finalMainTime">
      <span>Тривалість</span>
      <strong id="timer">0:00:00</strong>
     </div>
     <div class="finalMainPay">
      <span>Зароблено</span>
      <strong id="livePay">0 Kč</strong>
     </div>
    </div>

    <div class="workModeLabel finalStartLabel" id="workModeLabel">Зміна не почата</div>

    <button class="primary start finalPrimaryButton" id="startButton">Почати зміну</button>
    <button class="secondary finalSecondaryButton" id="manualStartButton">Вказати час приходу</button>

    <div class="workTasksBlock finalQuickNotes" id="workTasksBlock">
     <div class="workTasksHead">
      <div><span>Швидкі нотатки</span><small>Лише для поточної зміни</small></div>
      <strong id="workTasksCounter">0/0</strong>
     </div>
     <form class="quickWorkTaskForm" id="quickWorkTaskForm">
      <input id="quickWorkTaskInput" type="text" autocomplete="off" enterkeyhint="done" placeholder="Що потрібно зробити?">
      <button id="quickWorkTaskAdd" type="submit" aria-label="Додати нотатку">＋</button>
     </form>
     <div class="workTasksList" id="workTasksList"></div>
    </div>

    <button class="primary stop finalStopButton" id="stopButton">Завершити зміну</button>
    <button class="secondary finalSecondaryButton" id="editStartButton">Змінити час приходу</button>
    <button class="dangerLink" id="cancelButton">Скасувати помилковий старт</button>
   </div>
  </section>

  <div class="finalSummaryGrid">
   <div class="card finalSummaryCard">
    <span>Сьогодні</span>
    <strong id="todayPayValue">0 Kč</strong>
    <small>зароблено</small>
   </div>
   <div class="card finalSummaryCard">
    <span>Завдань</span>
    <strong id="todayPlansValue">0</strong>
    <small>залишилося</small>
   </div>
  </div>

  <div class="sectionTitle finalSectionTitle">
   <h2>Поточний місяць</h2>
   <button class="textAction" id="homeMonthButton"><span id="homeMonthLabel"></span> ›</button>
  </div>

  <div class="finalMonthGrid">
   <div class="card finalMetric"><span>Змін</span><strong id="countValue">0</strong></div>
   <div class="card finalMetric"><span>Годин</span><strong id="hoursValue">0:00</strong></div>
   <div class="card finalMetric finalMetricWide"><span>Зароблено</span><strong id="totalHomeValue">0 Kč</strong></div>
   <div class="card finalMetric"><span>Ставка</span><strong id="homeRateValue">0 Kč</strong></div>
  </div>

  <div class="sectionTitle finalSectionTitle">
   <h2>Наступне завдання</h2>
   <button class="textAction" data-open-view="plansView">Усі ›</button>
  </div>
  <div class="card plans homePlans finalNextTask" id="homePlansList"></div>

  <div class="sectionTitle finalSectionTitle">
   <h2>Останні зміни</h2>
   <button class="textAction" data-open-view="statsView">Усі ›</button>
  </div>
  <div class="card list finalRecentList" id="recentList"></div>

  <div hidden aria-hidden="true">
   <div class="dayOverview" id="dayOverview"></div>
   <div id="goalTrack"><div id="goalFill"></div></div>
   <span id="goalText"></span>
  </div>
 </section>

<section class="view" id="calendarView"><div class="jobFilterBar"><label for="calendarJobFilter">Робота</label><select id="calendarJobFilter"></select></div>
 <div class="sectionTitle"><h2>Календар</h2><button class="smallButton" id="calendarTodayButton">Сьогодні</button></div>
 <div class="calendarSummary">
      <div class="card calendarStat"><span>Змін</span><strong id="calendarShiftCount">0</strong></div>
      <div class="card calendarStat"><span>Годин</span><strong id="calendarHours">0:00</strong></div>
      <div class="card calendarStat"><span>Зароблено</span><strong id="calendarPay">0 Kč</strong></div><div class="card calendarStat"><span>Середня зміна</span><strong id="calendarAverage">0:00</strong></div>
    </div>
    <div class="card calendarMonthBar">
  <button class="calendarArrow" id="calendarPrevMonth">‹</button>
  <button class="calendarMonthTitle" id="calendarMonthButton"><span class="label">Місяць</span><strong id="calendarMonthLabel"></strong></button>
  <button class="calendarArrow" id="calendarNextMonth">›</button>
 </div>
 <div class="card calendar"><div class="calendarHead"><div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Нд</div></div><div class="calendarGrid" id="calendarGrid"></div></div></section>
  <section class="view" id="statsView"><div class="jobFilterBar"><label for="statsJobFilter">Робота</label><select id="statsJobFilter"></select></div>
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

<section class="view" id="plansView"><div class="jobFilterBar"><label for="plansJobFilter">Робота</label><select id="plansJobFilter"></select></div>
 <div class="plansHeader">
  <div>
   <div class="eyebrow">Організуй свій день</div>
   <h2>Завдання</h2>
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
   <strong id="plansProgressTitle">Завдань немає</strong>
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

<section class="view" id="dayDetailsView">
      <div class="detailsTopBar">
       <button class="detailsBackButton" id="dayDetailsBack">‹</button>
       <div><div class="eyebrow">Деталі дня</div><h2 id="dayDetailsDate">День</h2></div>
       <button class="detailsMoreButton" id="dayDetailsQuick">＋ Додати</button>
      </div>

      <div class="card dayDetailsHero">
       <div class="dayDetailsMain">
        <div><span>Зароблено</span><strong id="dayDetailsPay">0 Kč</strong></div>
        <div><span>Відпрацьовано</span><strong id="dayDetailsHours">0:00</strong></div>
       </div>
       <div class="dayDetailsSub">
        <div><span>Змін</span><strong id="dayDetailsShiftCount">0</strong></div>
        <div><span>Планів</span><strong id="dayDetailsPlanCount">0</strong></div>
        <div><span>Робочих завдань</span><strong id="dayDetailsTaskCount">0/0</strong></div>
       </div>
      </div>

      <div class="sectionTitle"><h2>Зміни</h2></div>
      <div class="card list" id="dayDetailsShifts"></div>

      <div class="sectionTitle"><h2>Завдання</h2></div>
      <div class="card detailsTasksList" id="dayDetailsPlans"></div>

      <div class="sectionTitle"><h2>Робочі завдання</h2></div>
      <div class="card detailsTasksList" id="dayDetailsWorkTasks"></div>

      <div class="sectionTitle"><h2>Нотатка</h2></div>
      <div class="card dayDetailsNoteBox">
       <textarea id="dayDetailsNote" rows="4" placeholder="Нотатка про цей день…"></textarea>
       <button class="editChip" id="dayDetailsSaveNote">Зберегти нотатку</button>
      </div>
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

      <div class="shiftJobBadge" id="shiftDetailsJob"></div><div class="card shiftSummaryHero">
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

     <section class="view profileView" id="settingsView">
 <div class="profilePageHero card">
  <div class="profilePageAvatar" id="profilePageAvatar">М</div>
  <div class="profilePageIdentity"><div class="eyebrow">Особистий простір</div><h2 id="profilePageName">Мій профіль</h2><p id="profilePageMeta">180 Kč/год</p></div>
  <button class="profilePageEdit" id="profilePageEdit">Редагувати</button>
 </div>
 <div class="sectionTitle"><h2>Мої роботи</h2><button class="textAction" id="addJobButton">＋ Додати</button></div>
 <div class="card jobsCard" id="jobsList"></div>
 <div class="sectionTitle"><h2>Налаштування активної роботи</h2></div>
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

 
 <div class="sectionTitle"><h2>Нагадування</h2></div>
 <div class="card reminderSettingsCard">
  <div class="settingRow">
   <div><b>Дозволити сповіщення</b><small id="notificationPermissionText">Не перевірено</small></div>
   <button class="smallButton" id="requestNotificationsButton">Увімкнути</button>
  </div>

  <div class="settingRow">
   <div><b>Нагадати почати зміну</b><small>У вибраний час, якщо зміна не почата</small></div>
   <button class="switch" id="startReminderToggle"></button>
  </div>
  <div class="settingInline" id="startReminderTimeRow">
   <label for="startReminderTime">Час</label>
   <input id="startReminderTime" type="time" value="08:00">
  </div>

  <div class="settingRow">
   <div><b>Нагадати завершити зміну</b><small>Після заданої тривалості активної зміни</small></div>
   <button class="switch" id="endReminderToggle"></button>
  </div>
  <div class="settingInline" id="endReminderHoursRow">
   <label for="endReminderHours">Через</label>
   <select id="endReminderHours">
    <option value="8">8 годин</option>
    <option value="9">9 годин</option>
    <option value="10">10 годин</option>
    <option value="11">11 годин</option>
    <option value="12">12 годин</option>
   </select>
  </div>

  <div class="settingRow">
   <div><b>Незавершена зміна</b><small>Попереджати, якщо зміна триває занадто довго</small></div>
   <button class="switch" id="unfinishedShiftToggle"></button>
  </div>
 </div>

<div class="sectionTitle"><h2>Застосунок</h2></div>
 <div class="card profileMenuCard">
  <button class="profileMenuRow" id="languageRow"><span class="profileMenuIcon">🌐</span><span><b>Мова</b><small>Українська</small></span><span class="profileMenuChevron">›</span></button>
  <button class="profileMenuRow" id="aboutAppRow"><span class="profileMenuIcon">ℹ</span><span><b>Про застосунок</b><small>Моя робота · v15.5 Navigation Architecture Fix</small></span><span class="profileMenuChevron">›</span></button>
 </div>
 <div class="sectionTitle"><h2>Безпека даних</h2></div>
 <div class="card backupCard">
  <div class="backupStatus"><div><b>Резервна копія</b><div class="hint" id="lastBackupText">Копію ще не створювали</div></div><span class="backupBadge">JSON</span></div>
  <button class="backupAction primaryBackup" id="createBackupButton"><span>⬇</span><div><b>Створити резервну копію</b><small>Завантажити всі дані у файл</small></div></button>
  <button class="backupAction" id="restoreBackupButton"><span>⬆</span><div><b>Відновити з файлу</b><small>Повернути зміни, плани й налаштування</small></div></button>
  <input id="backupFileInput" type="file" accept="application/json,.json" hidden>
  <button class="backupAction dangerBackup" id="clearAllDataButton"><span>🗑</span><div><b>Очистити всі дані</b><small>Цю дію неможливо скасувати</small></div></button>
 </div>

</section>
 
 <div id="finalUiCompatibility" hidden aria-hidden="true">
  <span id="greeting"></span>
  <span id="currentProfileAvatar"></span>
  <span id="currentProfileName"></span>
  <span id="currentProfileMeta"></span>
 </div>

</main></div>
 <nav class="bottomNav" aria-label="Основна навігація">
  <button class="nav active" data-view="homeView" aria-label="Головна">
   <span class="navIcon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3.8l8.5 6.7v9.2a1.8 1.8 0 0 1-1.8 1.8h-4.2v-6.3h-5v6.3H5.3a1.8 1.8 0 0 1-1.8-1.8z"/></svg></span>
   <span class="navLabel">Головна</span>
  </button>
  <button class="nav" data-view="calendarView" aria-label="Календар">
   <span class="navIcon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M8 3.5v4M16 3.5v4M3.5 9.5h17"/></svg></span>
   <span class="navLabel">Календар</span>
  </button>
  <button class="nav" data-view="statsView" aria-label="Статистика">
   <span class="navIcon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20V11M12 20V4M19 20v-7"/></svg></span>
   <span class="navLabel">Статистика</span>
  </button>
  <button class="nav" data-view="plansView" aria-label="Завдання">
      <span class="navIcon taskBookIcon">
       <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 3.5h10.5a2 2 0 0 1 2 2v15H6.5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z"/>
        <path d="M8 3.5v17"/>
        <path d="M10.5 8.5h5.5M10.5 12h5.5M10.5 15.5h3.5"/>
        <path d="M12 6.2c.8-1.4 2.2-1.7 3.1-.8.9-.9 2.3-.6 3.1.8"/>
       </svg>
      </span>
      <span class="navLabel">Завдання</span>
     </button>
  <button class="nav" data-view="settingsView" aria-label="Профіль">
   <span class="navIcon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.8 20c.7-4.1 3.1-6.3 7.2-6.3s6.5 2.2 7.2 6.3"/></svg></span>
   <span class="navLabel">Профіль</span>
  </button>
 </nav>
 <dialog id="monthDialog"><div class="modal"><h3>Вибрати місяць</h3><label>Місяць</label><select id="monthSelect"></select><label>Рік</label><select id="yearSelect"></select><div class="modalActions"><button id="cancelMonth">Скасувати</button><button class="save" id="saveMonth">Готово</button></div></div></dialog>
 <dialog id="rateDialog"><div class="modal"><h3>Базова ставка</h3><label>Kč за годину</label><input id="rateInput" type="number"><div class="modalActions"><button id="cancelRate">Скасувати</button><button class="save" id="saveRate">Зберегти</button></div></div></dialog>
 <dialog id="startDialog"><div class="modal"><h3>Час приходу</h3><label>Дата</label><input id="startDate" type="date"><label>Час</label><input id="startTime" type="time"><div class="modalActions"><button id="cancelStart">Скасувати</button><button class="save" id="saveStart">Почати</button></div></div></dialog>
 <dialog id="jobEditDialog"><div class="modal">
 <h3 id="jobEditTitle">Нова робота</h3><label>Назва роботи</label><input id="jobNameInput" type="text" placeholder="Наприклад: Hej Foods">
 <label>Ставка за годину</label><input id="jobRateInput" type="number" min="0"><label>Валюта</label><select id="jobCurrencyInput"><option value="Kč">Kč</option><option value="€">€</option><option value="$">$</option><option value="₴">₴</option><option value="£">£</option></select>
 <label>Колір</label><input id="jobColorInput" type="color" value="#4A67E8"><label>Нотатка</label><textarea id="jobNoteInput" rows="2"></textarea>
 <div class="modalActions"><button id="cancelJobEdit">Скасувати</button><button class="save" id="saveJobEdit">Зберегти</button></div><button class="dangerLink" id="archiveJobButton">Архівувати роботу</button>
 </div></dialog>
 <dialog id="profilesDialog"><div class="modal profileModal">
      <div class="profileModalHeader"><div><div class="eyebrow">Окремі дані й ставка</div><h3>Профілі</h3></div><button class="dialogClose" id="closeProfilesButton">×</button></div>
      <div class="profilesList" id="profilesList"></div>
      <button class="primary profileCreateButton" id="newProfileButton">＋ Новий профіль</button>
     </div></dialog>

     <dialog id="profileEditDialog"><div class="modal">
      <h3 id="profileEditTitle">Новий профіль</h3>
      <label>Ім’я або назва роботи</label><input id="profileNameInput" type="text" placeholder="Наприклад: Данило або Ресторан">
      <label>Посада</label><input id="profileJobInput" type="text" placeholder="Наприклад: Кухар">
      <label>Ставка за годину</label><input id="profileRateInput" type="number" min="0">
      <label>Валюта</label><select id="profileCurrencyInput"><option value="Kč">Kč</option><option value="€">€</option><option value="$">$</option><option value="₴">₴</option><option value="£">£</option></select>
      <div class="modalActions"><button id="cancelProfileEdit">Скасувати</button><button class="save" id="saveProfileEdit">Зберегти</button></div>
      <button class="dangerLink" id="deleteCurrentProfileButton">Видалити профіль</button>
     </div></dialog>

     <dialog id="restorePreviewDialog"><div class="modal"><h3>Відновлення даних</h3><div class="restorePreview" id="restorePreview"></div><div class="modalActions"><button id="cancelRestoreButton">Скасувати</button><button class="save" id="confirmRestoreButton">Відновити</button></div></div></dialog>
 <dialog id="shiftDialog"><div class="modal"><h3 id="shiftTitle">Нова зміна</h3><label>Дата</label><input id="shiftDate" type="date"><label>Прийшов</label><input id="shiftStart" type="time"><label>Пішов</label><input id="shiftEnd" type="time"><label>Ставка</label><input id="shiftRate" type="number"><div id="holidayField"><label class="inlineCheck"><input id="shiftHoliday" type="checkbox"> Святковий день</label></div><div id="tipsField"><label>Чайові</label><input id="shiftTips" type="number" value="0"></div><label>Примітка</label><input id="shiftNote" type="text" placeholder="Необов’язково">
    <div class="archivedTasksBox" id="archivedTasksBox">
     <div class="label">Завдання зміни</div>
     <div id="archivedTasksList"></div>
    </div>
    <div class="modalActions"><button id="deleteShift">Видалити</button><button class="save" id="saveShift">Зберегти</button></div></div></dialog>
 <dialog id="planDialog"><div class="modal"><h3 id="planDialogTitle">Нове завдання</h3>
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
 <dialog id="calendarQuickDialog"><div class="modal">
      <h3 id="calendarQuickTitle">Швидкі дії</h3>
      <button class="calendarQuickAction" id="quickAddShiftForDay">＋ Додати зміну</button>
      <button class="calendarQuickAction" id="quickAddPlanForDay">✓ Додати план</button>
      <button class="calendarQuickAction" id="quickAddNoteForDay">📝 Нотатка дня</button>
      <button class="dangerLink" id="closeCalendarQuick">Закрити</button>
     </div></dialog>
     <dialog id="dayDialog"><div class="modal"><h3 id="dayDialogTitle">День</h3><div id="dayDialogSummary" class="daySummary"></div><div id="dayPlansSummary" class="dayPlansSummary"></div>
    <div class="dayNoteBox">
      <label>Нотатка дня</label>
      <textarea id="dayNote" rows="3" placeholder="Наприклад: важкий день, заміна колеги…"></textarea>
      <button class="editChip" id="saveDayNote">Зберегти нотатку</button>
    </div>
    <div id="dayDialogList" class="dayShiftList"></div><button class="secondary" id="addPlanForDay">＋ Додати план цього дня</button><button class="secondary" id="addShiftForDay">＋ Додати зміну цього дня</button><button class="dangerLink" id="closeDayDialog">Закрити</button></div></dialog>`;
}
