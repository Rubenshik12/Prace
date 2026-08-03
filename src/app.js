
import {storage} from './storage.js?v=v12-2-navigation-stable-20260803-11';
import {state} from './state.js?v=v12-2-navigation-stable-20260803-11';
import {fmt} from './format.js?v=v12-2-navigation-stable-20260803-11';
import {minutes,pay,summary,daySummary} from './payroll.js?v=v12-2-navigation-stable-20260803-11';
import {template} from './ui.js?v=v12-2-navigation-stable-20260803-11';

state.shifts=Array.isArray(state.shifts)?state.shifts:[];
state.plans=Array.isArray(state.plans)?state.plans:[];
state.settings=state.settings&&typeof state.settings==='object'?state.settings:{};
state.dayNotes=state.dayNotes&&typeof state.dayNotes==='object'?state.dayNotes:{};
state.workTasks=Array.isArray(state.workTasks)?state.workTasks:[];
if(state.active&&!state.active.sessionId){
 state.active.sessionId=crypto.randomUUID();
 state.save();
}
document.getElementById('app').innerHTML=template();
const $=id=>document.getElementById(id);
let pendingRestorePayload=null;
let timerId=null,editingId=null,editingPlanId=null,planFilter='today',planCategory='all',selectedDay=null,selectedShiftId=null,previousViewId='homeView',previousScrollY=0,calendarPressTimer=null;
const monthNames=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];

function applyTheme(){document.documentElement.dataset.theme=state.theme;$('settingsTheme').value=state.theme}
function save(){state.save()}
function monthData(){return summary(state.shifts,state.month,state.rate,state.settings)}
function shiftPay(s){return pay(s,state.rate,state.settings)}
function greeting(){const h=new Date().getHours();return h<12?'Доброго ранку 👋':h<18?'Добрий день 👋':'Добрий вечір 👋'}

function render(){
 const data=monthData();
 $('greeting').textContent=greeting();
 $('calendarMonthLabel').textContent=fmt.month(state.month);
 $('homeMonthLabel').textContent=fmt.month(state.month);
 $('homeRateValue').textContent=`${state.rate} Kč`;
 $('settingsRate').value=state.rate;
 $('goalAmount').value=Number(state.settings.goalAmount||0);
 $('todayTitle').textContent=new Date().toLocaleDateString('uk-UA',{weekday:'long',day:'numeric',month:'long'});
 $('countValue').textContent=data.selected.length;
 $('hoursValue').textContent=fmt.duration(data.mins);
 $('totalHomeValue').textContent=fmt.money(data.total);
 $('calendarShiftCount').textContent=data.selected.length;
 $('calendarHours').textContent=fmt.duration(data.mins);
 $('calendarPay').textContent=fmt.money(data.total);$('calendarAverage').textContent=fmt.duration(data.selected.length?data.mins/data.selected.length:0);
 const goal=Number(state.settings.goalAmount||0);
 const progress=goal>0?Math.min(100,data.total/goal*100):0;
 $('goalFill').style.width=`${progress}%`;
 $('goalText').textContent=goal>0?`${fmt.money(data.total)} із ${fmt.money(goal)} · ${Math.round(progress)}%`:'Фінансова ціль вимкнена';
 renderActive();renderShiftList($('recentList'),data.selected.slice(0,3));renderShiftList($('allList'),data.selected);renderCalendar(data.selected);renderPlans();renderHomePlans();renderTodayOverview();renderStatistics(data);renderSettings();renderBackupStatus();
}
function renderActive(){
 const a=state.active;$('workMode').classList.toggle('inactive',!a);$('dayStatus').classList.toggle('active',!!a);$('workTasksBlock').hidden=!a;$('startButton').hidden=!!a;$('manualStartButton').hidden=!!a;$('stopButton').hidden=!a;$('editStartButton').hidden=!a;$('cancelButton').hidden=!a;$('workModeLabel').textContent=a?`На роботі з ${fmt.time(a.start)}`:'Зміна не почата';$('dayStatus').textContent=a?'На роботі':'Не на роботі';$('todaySubtitle').textContent=a?'Активна зміна триває':'Все важливе в одному місці';
 clearInterval(timerId);
 const tick=()=>{if(!state.active){$('timer').textContent='0:00:00';$('livePay').textContent='0 Kč';return}const sec=Math.max(0,Math.floor((Date.now()-new Date(state.active.start))/1000));$('timer').textContent=`${Math.floor(sec/3600)}:${String(Math.floor(sec%3600/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;$('livePay').textContent=fmt.money(shiftPay({start:state.active.start,end:new Date().toISOString(),rate:state.rate,holiday:false,tips:0}))};
 renderWorkTasks();tick();if(a)timerId=setInterval(tick,1000);
}

function currentWorkTasks(){
 if(!state.active?.sessionId)return [];
 return state.workTasks.filter(task=>task.sessionId===state.active.sessionId);
}
function renderWorkTasks(){
 const node=$('workTasksList');
 const tasks=currentWorkTasks().sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
 const done=tasks.filter(task=>task.done).length;
 $('workTasksCounter').textContent=`${done}/${tasks.length}`;
 node.innerHTML='';
 if(!state.active)return;
 if(!tasks.length){
  node.innerHTML='<div class="workTasksEmpty">Швидко запиши, що потрібно зробити</div>';
  return;
 }
 tasks.forEach(task=>{
  const row=document.createElement('div');
  row.className='workTaskRow';
  row.innerHTML=`
   <button class="workTaskCheck ${task.done?'done':''}" type="button">${task.done?'✓':''}</button>
   <div class="workTaskText ${task.done?'done':''}">${task.text}</div>
   <button class="workTaskDelete" type="button" aria-label="Видалити">×</button>`;
  row.querySelector('.workTaskCheck').onclick=()=>{
   task.done=!task.done;
   task.completedAt=task.done?new Date().toISOString():null;
   save();renderWorkTasks();
  };
  row.querySelector('.workTaskDelete').onclick=()=>{
   state.workTasks=state.workTasks.filter(item=>item.id!==task.id);
   save();renderWorkTasks();
  };
  node.appendChild(row);
 });
}
function addQuickWorkTask(){
 if(!state.active?.sessionId)return;
 const input=$('quickWorkTaskInput');
 const text=input.value.trim();
 if(!text)return;
 state.workTasks.push({
  id:crypto.randomUUID(),sessionId:state.active.sessionId,text,done:false,
  createdAt:new Date().toISOString(),completedAt:null
 });
 save();
 input.value='';
 renderWorkTasks();
 requestAnimationFrame(()=>input.focus());
}
function renderArchivedTasks(shift){
 const box=$('archivedTasksBox');
 const node=$('archivedTasksList');
 const tasks=Array.isArray(shift?.workTasks)?shift.workTasks:[];
 box.hidden=!shift||!tasks.length;
 node.innerHTML='';
 tasks.forEach(task=>{
  const row=document.createElement('div');
  row.className=`archivedTaskRow ${task.done?'':'open'}`;
  row.innerHTML=`<span class="archivedTaskIcon">${task.done?'✓':'○'}</span><span>${task.text}</span>`;
  node.appendChild(row);
 });
}

function renderShiftList(node,items){
 node.innerHTML='';if(!items.length){node.innerHTML='<div class="empty">Ще немає змін</div>';return}
 items.forEach(s=>{const row=document.createElement('div');row.className='shift';row.innerHTML=`<div class="shiftLeft"><div class="shiftDate">${fmt.date(s.start)}</div><div class="meta">${fmt.time(s.start)} → ${fmt.time(s.end)} · ${Number(s.rate||state.rate)} Kč/год</div></div><div><div class="money">${fmt.money(shiftPay(s))}</div><div class="hours">${fmt.duration(minutes(s.start,s.end))} год</div></div>`;row.onclick=()=>openShiftDetails(s.id);node.appendChild(row)});
}

function closeOpenPlanSwipes(except=null){
 document.querySelectorAll('.swipePlan.open').forEach(wrapper=>{
  if(wrapper!==except){
   wrapper.classList.remove('open');
   const content=wrapper.querySelector('.premiumPlan');
   if(content)content.style.transform='translateX(0)';
  }
 });
}
function bindPlanSwipe(wrapper,content,plan){
 let startX=0,startY=0,currentX=0,dragging=false,horizontal=false;
 const maxReveal=88;

 const reset=()=>{
  wrapper.classList.remove('open');
  content.style.transition='transform .22s ease';
  content.style.transform='translateX(0)';
  setTimeout(()=>content.style.transition='',240);
 };

 wrapper.addEventListener('touchstart',event=>{
  if(!event.touches?.length)return;
  closeOpenPlanSwipes(wrapper);
  startX=event.touches[0].clientX;
  startY=event.touches[0].clientY;
  currentX=wrapper.classList.contains('open')?-maxReveal:0;
  dragging=true;
  horizontal=false;
  content.style.transition='none';
 },{passive:true});

 wrapper.addEventListener('touchmove',event=>{
  if(!dragging||!event.touches?.length)return;
  const dx=event.touches[0].clientX-startX;
  const dy=event.touches[0].clientY-startY;

  if(!horizontal){
   if(Math.abs(dx)<7&&Math.abs(dy)<7)return;
   if(Math.abs(dy)>Math.abs(dx)){
    dragging=false;
    return;
   }
   horizontal=true;
  }

  if(horizontal){
   event.preventDefault();
   let value=currentX+dx;
   value=Math.max(-maxReveal,Math.min(0,value));
   content.style.transform=`translateX(${value}px)`;
  }
 },{passive:false});

 wrapper.addEventListener('touchend',event=>{
  if(!horizontal){
   dragging=false;
   return;
  }
  const endX=event.changedTouches?.[0]?.clientX??startX;
  const total=currentX+(endX-startX);
  content.style.transition='transform .22s ease';

  if(total<-42){
   wrapper.classList.add('open');
   content.style.transform=`translateX(-${maxReveal}px)`;
  }else{
   reset();
  }
  dragging=false;
  horizontal=false;
 });

 wrapper.querySelector('.swipeDeleteButton').onclick=event=>{
  event.stopPropagation();
  if(confirm(`Видалити план «${plan.text}»?`)){
   state.plans=state.plans.filter(p=>p.id!==plan.id);
   save();
   render();
   toast('План видалено');
  }else{
   reset();
  }
 };
}

function renderPlans(){
 const node=$('plansList');
 node.innerHTML='';
 const today=new Date();
 const todayKey=today.toISOString().slice(0,10);
 const tomorrow=new Date(today);tomorrow.setDate(today.getDate()+1);
 const tomorrowKey=tomorrow.toISOString().slice(0,10);

 let items=[...state.plans];
 if(planFilter==='today')items=items.filter(p=>p.date===todayKey);
 if(planFilter==='tomorrow')items=items.filter(p=>p.date===tomorrowKey);
 if(planCategory!=='all')items=items.filter(p=>(p.category||'other')===planCategory);

 items.sort((a,b)=>{
  if(a.done!==b.done)return a.done?1:-1;
  return `${a.date||''} ${a.time||''}`.localeCompare(`${b.date||''} ${b.time||''}`);
 });

 const todayItems=state.plans.filter(p=>p.date===todayKey);
 const doneToday=todayItems.filter(p=>p.done).length;
 const totalToday=todayItems.length;
 const angle=totalToday?Math.round(doneToday/totalToday*360):0;
 $('plansProgressRing').style.setProperty('--progress',`${angle}deg`);
 $('plansProgressCount').textContent=`${doneToday}/${totalToday}`;
 $('plansProgressTitle').textContent=totalToday?`${doneToday} із ${totalToday} виконано`:'Планів немає';
 $('plansProgressSubtitle').textContent=totalToday?(doneToday===totalToday?'Усе виконано 🎉':'Продовжуй, чудовий темп'):'Додай перший план';

 if(!items.length){
  node.innerHTML='<div class="planEmpty"><strong>Планів немає</strong>Додай новий план на цей день</div>';
  return;
 }

 const icons={work:'💼',personal:'👤',shopping:'🛒',study:'📚',other:'✨'};
 const labels={work:'Робота',personal:'Особисте',shopping:'Покупки',study:'Навчання',other:'Інше'};
 const repeatLabels={daily:'Щодня',weekly:'Щотижня',monthly:'Щомісяця'};

 items.forEach(p=>{
  const category=p.category||'other';
  const wrapper=document.createElement('div');
  wrapper.className='swipePlan';

  const deleteButton=document.createElement('button');
  deleteButton.className='swipeDeleteButton';
  deleteButton.type='button';
  deleteButton.innerHTML='<span>🗑</span><b>Видалити</b>';

  const row=document.createElement('div');
  row.className=`premiumPlan ${p.done?'done':''}`;
  const dateLabel=new Date(p.date+'T12:00').toLocaleDateString('uk-UA',{day:'numeric',month:'short'});
  row.innerHTML=`
   <div class="planIcon ${category}">${icons[category]}</div>
   <div class="planMain">
    <div class="planTitleRow"><strong>${p.text}</strong><span class="priorityBadge ${p.priority||'normal'}"></span></div>
    <div class="planMetaRow">
     <span class="planMetaTag">${dateLabel}${p.time?` · ${p.time}`:''}</span>
     <span class="planMetaTag">${labels[category]}</span>
     ${p.repeat&&p.repeat!=='none'?`<span class="planMetaTag">↻ ${repeatLabels[p.repeat]}</span>`:''}
    </div>
   </div>
   <button class="planCheckButton ${p.done?'done':''}">${p.done?'✓':''}</button>`;

  row.querySelector('.planCheckButton').onclick=event=>{
   event.stopPropagation();
   p.done=!p.done;
   save();
   render();
  };
  row.querySelector('.planMain').onclick=()=>openPlanDialog(p.date,p.id);
  row.querySelector('.planIcon').onclick=()=>openPlanDialog(p.date,p.id);

  wrapper.appendChild(deleteButton);
  wrapper.appendChild(row);
  bindPlanSwipe(wrapper,row,p);
  node.appendChild(wrapper);
 });
}
function renderCalendar(items){
 const node=$('calendarGrid');node.innerHTML='';
 const [y,m]=state.month.split('-').map(Number);
 const offset=(new Date(y,m-1,1).getDay()+6)%7;
 for(let i=0;i<offset;i++){const blank=document.createElement('div');blank.className='day blank';node.appendChild(blank)}
 const days=new Date(y,m,0).getDate(),today=new Date();
 const daily=Array.from({length:days},(_,idx)=>{
  const dateKey=`${y}-${String(m).padStart(2,'0')}-${String(idx+1).padStart(2,'0')}`;
  return {dateKey,info:daySummary(state.shifts,dateKey,state.rate,state.settings)};
 });
 const bestPay=Math.max(0,...daily.map(d=>d.info.pay));
 for(let i=1;i<=days;i++){
  const dateKey=`${y}-${String(m).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
  const info=daily[i-1].info;
  const plans=state.plans.filter(p=>p.date===dateKey);
  const workTasks=info.items.flatMap(s=>Array.isArray(s.workTasks)?s.workTasks:[]);
  const hasAllTasks=workTasks.length>0&&workTasks.every(t=>t.done);
  const isBest=bestPay>0&&info.pay===bestPay;
  const day=document.createElement('button');
  day.className='day smartDay';
  day.innerHTML=`<span class="dayBestStar" aria-hidden="true"></span><span class="dayNumber">${i}</span><span class="dayStatusDots" aria-hidden="true"></span>`;
  const dots=day.querySelector('.dayStatusDots');
  const statuses=[];
  if(info.items.length){
   statuses.push('shift');
   day.classList.add('workedDay');
  }
  if(plans.length)statuses.push('plan');
  if(hasAllTasks){
   statuses.push('complete');
   day.classList.add('completeDay');
  }
  if(state.dayNotes?.[dateKey])statuses.push('note');
  statuses.slice(0,3).forEach(type=>{
   const dot=document.createElement('span');
   dot.className=`calendarStatusDot calendarStatusDot--${type}`;
   dots.appendChild(dot);
  });
  if(isBest){
   day.classList.add('bestDay');
   day.querySelector('.dayBestStar').textContent='★';
  }
  if(today.getFullYear()===y&&today.getMonth()===m-1&&today.getDate()===i)day.classList.add('today');
  let longPressed=false;
  const startPress=()=>{
   longPressed=false;
   clearTimeout(calendarPressTimer);
   calendarPressTimer=setTimeout(()=>{longPressed=true;openCalendarQuick(dateKey)},520);
  };
  const cancelPress=()=>clearTimeout(calendarPressTimer);
  day.addEventListener('touchstart',startPress,{passive:true});
  day.addEventListener('touchend',cancelPress,{passive:true});
  day.addEventListener('touchmove',cancelPress,{passive:true});
  day.oncontextmenu=e=>{e.preventDefault();openCalendarQuick(dateKey)};
  day.onclick=()=>{if(!longPressed)openDayDetails(dateKey)};
  node.appendChild(day);
 }
}
function changeMonth(delta){const [y,m]=state.month.split('-').map(Number),d=new Date(y,m-1+delta,1);state.month=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;render()}
function openMonth(){const [y,m]=state.month.split('-').map(Number);$('monthSelect').innerHTML=monthNames.map((n,i)=>`<option value="${i+1}">${n}</option>`).join('');$('yearSelect').innerHTML=Array.from({length:11},(_,i)=>y-5+i).map(v=>`<option>${v}</option>`).join('');$('monthSelect').value=m;$('yearSelect').value=y;$('monthDialog').showModal()}

function showView(id){
 previousViewId=document.querySelector('.view.active')?.id||'homeView';
 previousScrollY=(document.scrollingElement||document.documentElement).scrollTop||window.scrollY||0;
 openView(id);
 requestAnimationFrame(()=>{
  setPageScroll(0);
 });
}
function selectedShift(){
 return state.shifts.find(shift=>shift.id===selectedShiftId)||null;
}
function openShiftDetails(id){
 selectedShiftId=id;
 const shift=selectedShift();
 if(!shift)return;
 const duration=minutes(shift.start,shift.end);
 const shiftRate=Number(shift.rate||state.rate);
 const totalPay=shiftPay(shift);
 const overtimeThreshold=Number(state.settings.overtimeAfter||8)*60;
 const overtime=state.settings.overtime?Math.max(0,duration-overtimeThreshold):0;
 const tasks=Array.isArray(shift.workTasks)?shift.workTasks:[];
 const doneTasks=tasks.filter(task=>task.done).length;

 $('shiftDetailsDate').textContent=new Date(shift.start).toLocaleDateString('uk-UA',{
  weekday:'long',day:'numeric',month:'long',year:'numeric'
 });
 $('shiftDetailsStart').textContent=fmt.time(shift.start);
 $('shiftDetailsEnd').textContent=fmt.time(shift.end);
 $('shiftDetailsDuration').textContent=`${fmt.duration(duration)} год`;
 $('shiftDetailsPay').textContent=fmt.money(totalPay);
 $('shiftDetailsRate').textContent=`${shiftRate} Kč`;
 $('shiftDetailsTips').textContent=fmt.money(Number(shift.tips||0));
 $('shiftDetailsOvertime').textContent=fmt.duration(overtime);
 $('shiftDetailsTasksCount').textContent=`${doneTasks}/${tasks.length}`;

 const taskNode=$('shiftDetailsTasks');
 taskNode.innerHTML='';
 if(!tasks.length){
  taskNode.innerHTML='<div class="empty">У цієї зміни немає робочих завдань</div>';
 }else{
  tasks.forEach(task=>{
   const row=document.createElement('div');
   row.className=`detailsTaskRow ${task.done?'done':''}`;
   row.innerHTML=`<div class="detailsTaskIcon">${task.done?'✓':'○'}</div><div class="detailsTaskText">${task.text}</div>`;
   taskNode.appendChild(row);
  });
 }
 $('shiftDetailsNote').textContent=shift.note?.trim()||'Нотатки немає';
 showView('shiftDetailsView');
 requestAnimationFrame(()=>{
  setPageScroll(0);
 });
}
function editSelectedShift(){
 const shift=selectedShift();
 if(!shift)return;
 openShift(shift.id);
}
function duplicateSelectedShift(){
 const shift=selectedShift();
 if(!shift)return;
 const duration=new Date(shift.end)-new Date(shift.start);
 const start=new Date(shift.start);
 start.setDate(start.getDate()+1);
 const end=new Date(start.getTime()+duration);
 const copy={
  ...shift,
  id:crypto.randomUUID(),
  start:start.toISOString(),
  end:end.toISOString(),
  workTasks:Array.isArray(shift.workTasks)
   ? shift.workTasks.map(task=>({...task,id:crypto.randomUUID(),done:false,completedAt:null}))
   : []
 };
 state.shifts.push(copy);
 save();
 render();
 selectedShiftId=copy.id;
 openShiftDetails(copy.id);
 toast('Зміну продубльовано на наступний день');
}
function deleteSelectedShift(){
 const shift=selectedShift();
 if(!shift)return;
 if(confirm('Видалити цю зміну назавжди?')){
  state.shifts=state.shifts.filter(item=>item.id!==shift.id);
  selectedShiftId=null;
  save();
  render();
  openView(previousViewId==='shiftDetailsView'?'homeView':previousViewId,{resetScroll:true});
  toast('Зміну видалено');
 }
}

function openShift(id=null){editingId=id;const s=id?state.shifts.find(x=>x.id===id):null,st=s?new Date(s.start):new Date(),en=s?new Date(s.end):new Date(Date.now()+8*3600000);$('shiftTitle').textContent=s?'Редагування зміни':'Нова зміна';$('deleteShift').hidden=!s;$('shiftDate').value=st.toISOString().slice(0,10);$('shiftStart').value=st.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});$('shiftEnd').value=en.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});$('shiftRate').value=s?Number(s.rate||state.rate):state.rate;$('shiftHoliday').checked=s?!!s.holiday:false;$('shiftTips').value=s?Number(s.tips||0):0;$('shiftNote').value=s?s.note||'':'';$('holidayField').hidden=!state.settings.holiday;$('tipsField').hidden=!state.settings.tips;renderArchivedTasks(s);$('shiftDialog').showModal()}
function toast(text){const t=document.getElementById('toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}



function renderHomePlans(){
 const node=$('homePlansList');
 const today=new Date().toISOString().slice(0,10);
 const items=state.plans.filter(p=>p.date===today).slice(0,4);
 node.innerHTML='';
 if(!items.length){node.innerHTML='<div class="empty">На сьогодні планів немає</div>';return}
 items.forEach(p=>{
  const row=document.createElement('div');
  row.className='plan';
  row.innerHTML=`<button class="check ${p.done?'done':''}">${p.done?'✓':''}</button><div class="planText ${p.done?'done':''}">${p.text}</div>`;
  row.querySelector('.check').onclick=()=>{p.done=!p.done;save();render()};
  node.appendChild(row);
 });
}
function renderTodayOverview(){
 const today=new Date().toISOString().slice(0,10);
 const info=daySummary(state.shifts,today,state.rate,state.settings);
 const openPlans=state.plans.filter(p=>p.date===today&&!p.done).length;
 $('todayPayValue').textContent=fmt.money(info.pay);
 $('todayPlansValue').textContent=openPlans;
}
function openPlanDialog(dateValue=new Date().toISOString().slice(0,10),planId=null){
 editingPlanId=planId;
 const plan=planId?state.plans.find(p=>p.id===planId):null;
 $('planDialogTitle').textContent=plan?'Редагувати план':'Новий план';
 $('planDate').value=plan?plan.date:dateValue;
 $('planTime').value=plan?.time||'';
 $('planText').value=plan?.text||'';
 $('planCategory').value=plan?.category||'personal';
 $('planPriority').value=plan?.priority||'normal';
 $('planRepeat').value=plan?.repeat||'none';
 $('deletePlanDialog').hidden=!plan;
 $('planDialog').showModal();
}


function previousMonthKey(monthKey){
 const [y,m]=monthKey.split('-').map(Number);
 const d=new Date(y,m-2,1);
 return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}
function percentChange(current,previous){
 if(previous===0)return current===0?0:null;
 return (current-previous)/previous*100;
}
function changeText(value,suffix=''){
 if(value===null)return 'Немає даних';
 const sign=value>0?'+':'';
 return `${sign}${Math.round(value)}${suffix}`;
}
function changeClass(value){
 if(value===null||value===0)return 'neutral';
 return value>0?'positive':'negative';
}
function averageClock(values){
 if(!values.length)return '—';
 let total=0;
 values.forEach(v=>{
  const d=new Date(v);
  total+=d.getHours()*60+d.getMinutes();
 });
 const avg=Math.round(total/values.length);
 return `${String(Math.floor(avg/60)%24).padStart(2,'0')}:${String(avg%60).padStart(2,'0')}`;
}
function dailyStats(items){
 const map=new Map();
 items.forEach(s=>{
  const key=s.start.slice(0,10);
  if(!map.has(key))map.set(key,{date:key,pay:0,minutes:0,count:0});
  const x=map.get(key);
  x.pay+=shiftPay(s);
  x.minutes+=minutes(s.start,s.end);
  x.count++;
 });
 return [...map.values()].sort((a,b)=>a.date.localeCompare(b.date));
}
function renderStatistics(data){
 $('statsMonthLabel').textContent=fmt.month(state.month);
 $('statsTotalPay').textContent=fmt.money(data.total);
 $('statsHours').textContent=fmt.duration(data.mins);
 $('statsShiftCount').textContent=data.selected.length;
 $('statsAverageShift').textContent=fmt.duration(data.selected.length?data.mins/data.selected.length:0);

 const prev=summary(state.shifts,previousMonthKey(state.month),state.rate,state.settings);
 const payChange=percentChange(data.total,prev.total);
 const hoursChange=percentChange(data.mins,prev.mins);
 const shiftsChange=percentChange(data.selected.length,prev.selected.length);

 $('statsPayChange').textContent=payChange===null?'Немає минулих даних':`${changeText(payChange,'%')} до минулого місяця`;
 $('statsPayChange').className=changeClass(payChange);
 $('statsHoursChange').textContent=hoursChange===null?'Немає даних':`${changeText(hoursChange,'%')} до минулого`;
 $('statsHoursChange').className=changeClass(hoursChange);
 $('statsShiftChange').textContent=shiftsChange===null?'Немає даних':`${changeText(shiftsChange,'%')} до минулого`;
 $('statsShiftChange').className=changeClass(shiftsChange);

 const durations=data.selected.map(s=>({shift:s,value:minutes(s.start,s.end)}));
 const longest=durations.length?[...durations].sort((a,b)=>b.value-a.value)[0]:null;
 const shortest=durations.length?[...durations].sort((a,b)=>a.value-b.value)[0]:null;
 $('longestShiftValue').textContent=longest?fmt.duration(longest.value):'0:00';
 $('longestShiftDate').textContent=longest?fmt.date(longest.shift.start):'—';
 $('shortestShiftValue').textContent=shortest?fmt.duration(shortest.value):'0:00';
 $('shortestShiftDate').textContent=shortest?fmt.date(shortest.shift.start):'—';

 const days=dailyStats(data.selected);
 const best=days.length?[...days].sort((a,b)=>b.pay-a.pay)[0]:null;
 $('bestDayValue').textContent=best?fmt.money(best.pay):'0 Kč';
 $('bestDayDate').textContent=best?new Date(best.date+'T12:00').toLocaleDateString('uk-UA',{day:'numeric',month:'long'}):'—';
 $('averageDayValue').textContent=days.length?fmt.money(data.total/days.length):'0 Kč';
 $('averageStartValue').textContent=averageClock(data.selected.map(s=>s.start));
 $('averageEndValue').textContent=averageClock(data.selected.map(s=>s.end));

 const goal=Number(state.settings.goalAmount||0);
 const goalPercent=goal>0?Math.min(100,data.total/goal*100):0;
 $('statsGoalTitle').textContent=goal>0?`${fmt.money(data.total)} із ${fmt.money(goal)}`:'Ціль не задана';
 $('statsGoalPercent').textContent=`${Math.round(goalPercent)}%`;
 $('statsGoalFill').style.width=`${goalPercent}%`;
 $('statsGoalText').textContent=goal>0?(data.total>=goal?'Ціль виконана 🎉':`Залишилося ${fmt.money(goal-data.total)}`):'Задай ціль у налаштуваннях';

 const comparisons=[
  ['comparePay',data.total-prev.total,payChange,'%'],
  ['compareHours',data.mins-prev.mins,hoursChange,'%'],
  ['compareShifts',data.selected.length-prev.selected.length,shiftsChange,'']
 ];
 comparisons.forEach(([id,difference,change,suffix])=>{
  const node=$(id);
  if(change===null){node.textContent='Немає даних';node.className='neutral';return}
  if(id==='comparePay')node.textContent=`${difference>=0?'+':''}${fmt.money(difference)}`;
  else if(id==='compareHours')node.textContent=`${difference>=0?'+':''}${fmt.duration(Math.abs(difference))}`;
  else node.textContent=`${difference>=0?'+':''}${difference}`;
  node.className=changeClass(change);
 });

 renderCumulativeChart(days);
 renderDailyBars(days);
}
function renderCumulativeChart(days){
 const svg=$('cumulativeChart');
 svg.innerHTML='';
 const width=320,height=150,pad=10;
 const total=days.reduce((sum,d)=>sum+d.pay,0);
 $('cumulativeChartTitle').textContent=fmt.money(total);
 if(!days.length){
  svg.innerHTML='<text x="160" y="78" text-anchor="middle" fill="currentColor" opacity=".45" font-size="12">Немає даних</text>';
  $('cumulativeAxis').innerHTML='';
  return;
 }
 let cumulative=0;
 const values=days.map(d=>{cumulative+=d.pay;return {...d,cumulative}});
 const max=Math.max(...values.map(v=>v.cumulative),1);
 const points=values.map((v,i)=>{
  const x=values.length===1?width/2:pad+i*(width-pad*2)/(values.length-1);
  const y=height-pad-v.cumulative/max*(height-pad*2);
  return {x,y,...v};
 });
 [0.25,0.5,0.75].forEach(r=>{
  const line=document.createElementNS('http://www.w3.org/2000/svg','line');
  line.setAttribute('x1',pad);line.setAttribute('x2',width-pad);
  line.setAttribute('y1',height*r);line.setAttribute('y2',height*r);
  line.setAttribute('class','chartGridLine');svg.appendChild(line);
 });
 const area=document.createElementNS('http://www.w3.org/2000/svg','path');
 area.setAttribute('d',`M ${points[0].x} ${height-pad} L ${points.map(p=>`${p.x} ${p.y}`).join(' L ')} L ${points[points.length-1].x} ${height-pad} Z`);
 area.setAttribute('class','chartArea');svg.appendChild(area);
 const line=document.createElementNS('http://www.w3.org/2000/svg','polyline');
 line.setAttribute('points',points.map(p=>`${p.x},${p.y}`).join(' '));
 line.setAttribute('class','chartLine');svg.appendChild(line);
 points.forEach(p=>{
  const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
  c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',3.5);c.setAttribute('class','chartPoint');svg.appendChild(c);
 });
 const axis=$('cumulativeAxis');
 const first=values[0],last=values[values.length-1];
 axis.innerHTML=`<span>${new Date(first.date+'T12:00').getDate()}</span><span>${new Date(last.date+'T12:00').getDate()}</span>`;
}
function renderDailyBars(days){
 const node=$('dailyBarChart');node.innerHTML='';
 if(!days.length){node.innerHTML='<div class="empty">Немає даних за цей місяць</div>';$('dailyChartTitle').textContent='Найкращий день: —';return}
 const max=Math.max(...days.map(d=>d.pay),1);
 const best=[...days].sort((a,b)=>b.pay-a.pay)[0];
 $('dailyChartTitle').textContent=`Найкращий день: ${fmt.money(best.pay)}`;
 days.forEach(d=>{
  const item=document.createElement('button');
  item.className=`barItem ${d.date===best.date?'best':''}`;
  const h=Math.max(3,d.pay/max*100);
  item.innerHTML=`<div class="barValue" style="height:${h}%"></div><span class="barLabel">${new Date(d.date+'T12:00').getDate()}</span>`;
  item.onclick=()=>openDayDetails(d.date);
  node.appendChild(item);
 });
}


function backupPayload(){return {backupSchema:1,appVersion:'v12.0 Backup & Restore',exportedAt:new Date().toISOString(),data:{shifts:state.shifts,active:state.active,rate:state.rate,theme:state.theme,plans:state.plans,settings:state.settings,dayNotes:state.dayNotes,workTasks:state.workTasks}}}
function renderBackupStatus(){const raw=storage.lastBackup();$('lastBackupText').textContent=raw?`Остання копія: ${new Date(raw).toLocaleString('uk-UA')}`:'Копію ще не створювали'}
function downloadBackup(){const blob=new Blob([JSON.stringify(backupPayload(),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`moya-robota-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);storage.saveLastBackup(new Date().toISOString());renderBackupStatus();toast('Резервну копію створено')}
function validateBackup(p){if(!p||p.backupSchema!==1||!p.data)throw new Error('Несумісний файл');for(const k of ['shifts','plans','workTasks'])if(!Array.isArray(p.data[k]))throw new Error(`Некоректне поле ${k}`);return true}
function showRestorePreview(p){pendingRestorePayload=p;const d=p.data;$('restorePreview').innerHTML=`<div class="restorePreviewRow"><span>Зміни</span><strong>${d.shifts.length}</strong></div><div class="restorePreviewRow"><span>Плани</span><strong>${d.plans.length}</strong></div><div class="restorePreviewRow"><span>Робочі завдання</span><strong>${d.workTasks.length}</strong></div><div class="restorePreviewRow"><span>Нотатки</span><strong>${Object.keys(d.dayNotes||{}).length}</strong></div>`;$('restorePreviewDialog').showModal()}
function applyRestore(p){const d=p.data;state.shifts=d.shifts;state.active=d.active||null;state.rate=Number(d.rate||180);state.theme=d.theme==='light'?'light':'dark';state.plans=d.plans;state.settings=d.settings||{};state.dayNotes=d.dayNotes||{};state.workTasks=d.workTasks;save();applyTheme();render();$('restorePreviewDialog').close();pendingRestorePayload=null;toast('Дані відновлено')}
function clearAllAppData(){if(!confirm('Видалити всі дані?'))return;if(!confirm('Останнє підтвердження: дію неможливо скасувати.'))return;storage.clearAll();location.reload()}

function renderSettings(){
 const pairs=[['overtimeSwitch','overtime'],['weekendSwitch','weekend'],['holidaySwitch','holiday'],['tipsSwitch','tips'],['paySplitSwitch','paySplit']];
 pairs.forEach(([id,key])=>$(id).classList.toggle('on',!!state.settings[key]));
 $('overtimeAfter').value=state.settings.overtimeAfter;
 $('overtimePercent').value=state.settings.overtimePercent;
 $('weekendPercent').value=state.settings.weekendPercent;
 $('holidayPercent').value=state.settings.holidayPercent;
 $('overtimeOptions').hidden=!state.settings.overtime;
 $('weekendOptions').hidden=!state.settings.weekend;
 $('holidayOptions').hidden=!state.settings.holiday;
}

function openCalendarQuick(dateKey){
 selectedDay=dateKey;
 $('calendarQuickTitle').textContent=new Date(dateKey+'T12:00').toLocaleDateString('uk-UA',{weekday:'long',day:'numeric',month:'long'});
 $('calendarQuickDialog').showModal();
 if(navigator.vibrate)navigator.vibrate(25);
}
function renderDayTaskRows(node,tasks,emptyText){
 node.innerHTML='';
 if(!tasks.length){node.innerHTML=`<div class="empty">${emptyText}</div>`;return}
 tasks.forEach(task=>{
  const row=document.createElement('div');
  row.className=`detailsTaskRow ${task.done?'done':''}`;
  row.innerHTML=`<div class="detailsTaskIcon">${task.done?'✓':'○'}</div><div class="detailsTaskText">${task.text}</div>`;
  node.appendChild(row);
 });
}
function openDayDetails(dateKey){
 selectedDay=dateKey;
 const info=daySummary(state.shifts,dateKey,state.rate,state.settings);
 const plans=state.plans.filter(p=>p.date===dateKey);
 const workTasks=info.items.flatMap(s=>Array.isArray(s.workTasks)?s.workTasks:[]);
 const doneTasks=workTasks.filter(t=>t.done).length;
 $('dayDetailsDate').textContent=new Date(dateKey+'T12:00').toLocaleDateString('uk-UA',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 $('dayDetailsPay').textContent=fmt.money(info.pay);
 $('dayDetailsHours').textContent=`${fmt.duration(info.minutes)} год`;
 $('dayDetailsShiftCount').textContent=info.items.length;
 $('dayDetailsPlanCount').textContent=plans.length;
 $('dayDetailsTaskCount').textContent=`${doneTasks}/${workTasks.length}`;
 renderShiftList($('dayDetailsShifts'),info.items);
 renderDayTaskRows($('dayDetailsPlans'),plans,'Планів цього дня немає');
 renderDayTaskRows($('dayDetailsWorkTasks'),workTasks,'Робочих завдань цього дня немає');
 $('dayDetailsNote').value=state.dayNotes?.[dateKey]||'';
 showView('dayDetailsView');
}

function openDay(dateKey){
 selectedDay=dateKey;
 const info=daySummary(state.shifts,dateKey,state.rate,state.settings);
 const plans=state.plans.filter(p=>p.date===dateKey);
 $('dayDialogTitle').textContent=new Date(dateKey+'T12:00').toLocaleDateString('uk-UA',{weekday:'long',day:'numeric',month:'long'});
 $('dayDialogSummary').innerHTML=`<div class="label">Підсумок дня</div><strong>${fmt.duration(info.minutes)} год · ${fmt.money(info.pay)}</strong>`;
 $('dayNote').value=state.dayNotes[dateKey]||'';
 const planNode=$('dayPlansSummary');planNode.innerHTML='';
 if(plans.length){
  planNode.innerHTML='<div class="label">Плани</div>';
  plans.forEach(p=>{
   const row=document.createElement('div');
   row.className='dayPlanItem';
   row.innerHTML=`<span class="dayPlanDot"></span><span class="${p.done?'planText done':'planText'}">${p.text}</span>`;
   planNode.appendChild(row);
  });
 }
 const list=$('dayDialogList');list.innerHTML='';
 if(!info.items.length)list.innerHTML='<div class="empty">У цей день змін немає</div>';
 info.items.forEach(s=>{
  const item=document.createElement('div');
  item.className='dayShiftItem';
  item.innerHTML=`<div><b>${fmt.time(s.start)} → ${fmt.time(s.end)}</b><div class="meta">${fmt.duration(minutes(s.start,s.end))} год${s.note?` · ${s.note}`:''}</div></div><div class="money">${fmt.money(shiftPay(s))}</div>`;
  item.onclick=()=>{$('dayDialog').close();openShiftDetails(s.id)};
  list.appendChild(item);
 });
 $('dayDialog').showModal();
}

const bind=(id,event,handler)=>{const node=$(id);if(node)node.addEventListener(event,handler)};
bind('quickWorkTaskForm','submit',event=>{event.preventDefault();addQuickWorkTask()});

bind('createBackupButton','click',downloadBackup);
bind('restoreBackupButton','click',()=>$('backupFileInput').click());
bind('backupFileInput','change',async event=>{const file=event.target.files?.[0];event.target.value='';if(!file)return;try{const p=JSON.parse(await file.text());validateBackup(p);showRestorePreview(p)}catch(e){alert(`Не вдалося відкрити копію: ${e.message}`)}});
bind('cancelRestoreButton','click',()=>{$('restorePreviewDialog').close();pendingRestorePayload=null});
bind('confirmRestoreButton','click',()=>{if(pendingRestorePayload)applyRestore(pendingRestorePayload)});
bind('clearAllDataButton','click',clearAllAppData);


bind('dayDetailsBack','click',()=>{
 const target=previousViewId==='dayDetailsView'?'calendarView':previousViewId;
 openView(target);
 requestAnimationFrame(()=>setPageScroll(previousScrollY));
});
bind('dayDetailsQuick','click',()=>openCalendarQuick(selectedDay));
bind('dayDetailsSaveNote','click',()=>{
 if(!selectedDay)return;
 const value=$('dayDetailsNote').value.trim();
 if(value)state.dayNotes[selectedDay]=value;else delete state.dayNotes[selectedDay];
 save();render();toast('Нотатку збережено');
});
bind('closeCalendarQuick','click',()=>$('calendarQuickDialog').close());
bind('quickAddShiftForDay','click',()=>{
 $('calendarQuickDialog').close();openShift();if(selectedDay)$('shiftDate').value=selectedDay;
});
bind('quickAddPlanForDay','click',()=>{
 $('calendarQuickDialog').close();openPlanDialog(selectedDay||new Date().toISOString().slice(0,10));
});
bind('quickAddNoteForDay','click',()=>{
 $('calendarQuickDialog').close();openDayDetails(selectedDay);
 setTimeout(()=>$('dayDetailsNote').focus(),180);
});

bind('shiftDetailsBack','click',()=>{
 const target=previousViewId==='shiftDetailsView'?'homeView':previousViewId;
 openView(target);
 requestAnimationFrame(()=>{
  setPageScroll(previousScrollY);
 });
});
bind('shiftDetailsEdit','click',editSelectedShift);
bind('shiftDetailsEditBottom','click',editSelectedShift);
bind('shiftDetailsDuplicate','click',duplicateSelectedShift);
bind('shiftDetailsDelete','click',deleteSelectedShift);


bind('prevMonth','click',()=>changeMonth(-1));
bind('nextMonth','click',()=>changeMonth(1));
bind('monthButton','click',openMonth);
bind('cancelMonth','click',()=>$('monthDialog').close());
bind('saveMonth','click',()=>{
 state.month=`${$('yearSelect').value}-${String($('monthSelect').value).padStart(2,'0')}`;
 $('monthDialog').close();render();
});

bind('rateButton','click',()=>{$('rateInput').value=state.rate;$('rateDialog').showModal()});
bind('cancelRate','click',()=>$('rateDialog').close());
bind('saveRate','click',()=>{state.rate=Number($('rateInput').value||0);save();$('rateDialog').close();render()});

bind('startButton','click',()=>{state.active={start:new Date().toISOString(),sessionId:crypto.randomUUID()};save();render()});
bind('manualStartButton','click',()=>{
 const now=new Date();
 $('startDate').value=now.toISOString().slice(0,10);
 $('startTime').value=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
 $('startDialog').showModal();
});
bind('editStartButton','click',()=>{
 if(!state.active)return;
 const date=new Date(state.active.start);
 $('startDate').value=date.toISOString().slice(0,10);
 $('startTime').value=date.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
 $('startDialog').showModal();
});
bind('cancelStart','click',()=>$('startDialog').close());
bind('saveStart','click',()=>{
 const date=new Date(`${$('startDate').value}T${$('startTime').value}`);
 if(Number.isNaN(date.getTime()))return alert('Вкажи правильну дату і час');
 if(date>new Date())return alert('Час не може бути в майбутньому');
 if(state.active){
 state.active.start=date.toISOString();
}else{
 state.active={start:date.toISOString(),sessionId:crypto.randomUUID()};
}
save();$('startDialog').close();render();
});
bind('stopButton','click',()=>{
 if(!state.active)return;
 const sessionId=state.active.sessionId;
 const workTasks=state.workTasks.filter(task=>task.sessionId===sessionId).map(task=>({...task}));
 const shift={
  id:crypto.randomUUID(),start:state.active.start,end:new Date().toISOString(),
  rate:state.rate,holiday:false,tips:0,note:'',workTasks
 };
 state.shifts.push(shift);
 state.workTasks=state.workTasks.filter(task=>task.sessionId!==sessionId);
 state.active=null;
 save();render();toast(`Зміна збережена · ${fmt.money(shiftPay(shift))}`);
});
bind('cancelButton','click',()=>{
 if(confirm('Скасувати початок зміни разом із робочими завданнями?')){
  const sessionId=state.active?.sessionId;
  state.workTasks=state.workTasks.filter(task=>task.sessionId!==sessionId);
  state.active=null;save();render();
 }
});

bind('addShiftButton','click',()=>openShift());
bind('quickShift','click',()=>openShift());
bind('saveShift','click',()=>{
 const startDate=new Date(`${$('shiftDate').value}T${$('shiftStart').value}`);
 const endDate=new Date(`${$('shiftDate').value}T${$('shiftEnd').value}`);
 if(Number.isNaN(startDate.getTime())||Number.isNaN(endDate.getTime()))return alert('Вкажи правильний час');
 if(endDate<=startDate)return alert('Час виходу має бути пізніше');
 const shift={id:editingId||crypto.randomUUID(),start:startDate.toISOString(),end:endDate.toISOString(),rate:Number($('shiftRate').value||state.rate),holiday:$('shiftHoliday').checked,tips:Number($('shiftTips').value||0),note:$('shiftNote').value.trim()};
 if(editingId){const index=state.shifts.findIndex(item=>item.id===editingId);if(index>=0)state.shifts[index]=shift}else state.shifts.push(shift);
 save();$('shiftDialog').close();render();if(editingId){selectedShiftId=editingId;openShiftDetails(editingId)};
});
bind('deleteShift','click',()=>{if(editingId&&confirm('Видалити цю зміну?')){state.shifts=state.shifts.filter(item=>item.id!==editingId);save();$('shiftDialog').close();render()}});

bind('addPlanButton','click',()=>{
 if(state.active){
  openView('homeView',{resetScroll:true});
  setTimeout(()=>{
   $('workTasksBlock').scrollIntoView({behavior:'smooth',block:'center'});
   $('quickWorkTaskInput').focus();
  },150);
 }else openPlanDialog();
});
bind('quickPlan','click',()=>{
 if(state.active){
  $('workTasksBlock').scrollIntoView({behavior:'smooth',block:'center'});
  setTimeout(()=>$('quickWorkTaskInput').focus(),250);
 }else openPlanDialog();
});
bind('cancelPlan','click',()=>$('planDialog').close());
bind('savePlan','click',()=>{
 const text=$('planText').value.trim();if(!text)return alert('Напиши план');
 state.plans.push({id:crypto.randomUUID(),date:$('planDate').value,text,priority:$('planPriority').value,done:false});
 save();$('planDialog').close();render();
});

bind('settingsRate','input',event=>{state.rate=Number(event.target.value||0);save();render()});
bind('settingsTheme','change',event=>{state.theme=event.target.value;save();applyTheme()});
bind('themeButton','click',()=>{state.theme=state.theme==='dark'?'light':'dark';save();applyTheme()});
bind('goalAmount','input',event=>{state.settings.goalAmount=Number(event.target.value||0);save();render()});
bind('homeMonthButton','click',openMonth);

function setPageScroll(y=0){
 const value=Math.max(0,Number(y)||0);
 const root=document.scrollingElement||document.documentElement;
 root.scrollTop=value;
 document.documentElement.scrollTop=value;
 document.body.scrollTop=value;
 window.scrollTo(0,value);
}
function scrollPageToTop(){
 setPageScroll(0);
 requestAnimationFrame(()=>setPageScroll(0));
 setTimeout(()=>setPageScroll(0),40);
 setTimeout(()=>setPageScroll(0),140);
}
function openView(id,{resetScroll=false}={}){
 document.querySelectorAll('.nav').forEach(node=>node.classList.toggle('active',node.dataset.view===id));
 document.querySelectorAll('.view').forEach(node=>node.classList.toggle('active',node.id===id));
 if(resetScroll)scrollPageToTop();
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
 openView(button.dataset.view,{resetScroll:true});
}));
document.querySelectorAll('[data-open],[data-open-view]').forEach(button=>button.addEventListener('click',()=>{
 openView(button.dataset.open||button.dataset.openView,{resetScroll:true});
}));

document.querySelectorAll('[data-plan-filter]').forEach(button=>button.addEventListener('click',()=>{
 planFilter=button.dataset.planFilter;
 document.querySelectorAll('[data-plan-filter]').forEach(item=>item.classList.toggle('active',item===button));
 renderPlans();
}));

bind('calendarTodayButton','click',()=>{state.month=new Date().toISOString().slice(0,7);render()});
bind('calendarPrevMonth','click',()=>changeMonth(-1));
bind('calendarNextMonth','click',()=>changeMonth(1));
bind('calendarMonthButton','click',openMonth);
bind('closeDayDialog','click',()=>$('dayDialog').close());
bind('addShiftForDay','click',()=>{$('dayDialog').close();openShift();if(selectedDay)$('shiftDate').value=selectedDay});
bind('addPlanForDay','click',()=>{$('dayDialog').close();openPlanDialog(selectedDay||new Date().toISOString().slice(0,10))});

[['overtimeSwitch','overtime'],['weekendSwitch','weekend'],['holidaySwitch','holiday'],['tipsSwitch','tips'],['paySplitSwitch','paySplit']].forEach(([id,key])=>bind(id,'click',()=>{state.settings[key]=!state.settings[key];save();render()}));
['overtimeAfter','overtimePercent','weekendPercent','holidayPercent'].forEach(id=>bind(id,'input',event=>{state.settings[id]=Number(event.target.value||0);save();render()}));

applyTheme();render();if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
