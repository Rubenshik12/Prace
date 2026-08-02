
import {state} from './state.js';
import {fmt} from './format.js';
import {minutes,pay,summary,daySummary} from './payroll.js';
import {template} from './ui.js';

document.getElementById('app').innerHTML=template();
const $=id=>document.getElementById(id);
let timerId=null,editingId=null,planFilter='all',selectedDay=null;
const monthNames=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];

function applyTheme(){document.documentElement.dataset.theme=state.theme;$('settingsTheme').value=state.theme}
function save(){state.save()}
function monthData(){return summary(state.shifts,state.month,state.rate,state.settings)}
function shiftPay(s){return pay(s,state.rate,state.settings)}
function greeting(){const h=new Date().getHours();return h<12?'Доброго ранку 👋':h<18?'Добрий день 👋':'Добрий вечір 👋'}

function render(){
 const data=monthData();
 $('greeting').textContent=greeting();
 $('monthLabel').textContent=fmt.month(state.month);
 $('calendarMonthLabel').textContent=fmt.month(state.month);
 $('homeMonthLabel').textContent=fmt.month(state.month);
 $('rateLabel').textContent=`${state.rate} Kč`;
 $('homeRateValue').textContent=`${state.rate} Kč`;
 $('settingsRate').value=state.rate;
 $('goalAmount').value=Number(state.settings.goalAmount||0);
 $('todayTitle').textContent=new Date().toLocaleDateString('uk-UA',{weekday:'long',day:'numeric',month:'long'});
 $('countValue').textContent=data.selected.length;
 $('hoursValue').textContent=fmt.duration(data.mins);
 $('totalValue').textContent=fmt.money(data.total);
 $('totalHomeValue').textContent=fmt.money(data.total);
 $('avgValue').textContent=fmt.duration(data.selected.length?data.mins/data.selected.length:0);
 const goal=Number(state.settings.goalAmount||0);
 const progress=goal>0?Math.min(100,data.total/goal*100):0;
 $('goalFill').style.width=`${progress}%`;
 $('goalText').textContent=goal>0?`${fmt.money(data.total)} із ${fmt.money(goal)} · ${Math.round(progress)}%`:'Фінансова ціль вимкнена';
 renderActive();renderShiftList($('recentList'),data.selected.slice(0,3));renderShiftList($('allList'),data.selected);renderCalendar(data.selected);renderPlans();renderHomePlans();renderTodayOverview();renderSettings();
}
function renderActive(){
 const a=state.active;$('workMode').classList.toggle('inactive',!a);$('dayStatus').classList.toggle('active',!!a);$('startButton').hidden=!!a;$('manualStartButton').hidden=!!a;$('stopButton').hidden=!a;$('editStartButton').hidden=!a;$('cancelButton').hidden=!a;$('workModeLabel').textContent=a?`На роботі з ${fmt.time(a.start)}`:'Зміна не почата';$('dayStatus').textContent=a?'На роботі':'Не на роботі';$('todaySubtitle').textContent=a?'Активна зміна триває':'Все важливе в одному місці';
 clearInterval(timerId);
 const tick=()=>{if(!state.active){$('timer').textContent='0:00:00';$('livePay').textContent='0 Kč';return}const sec=Math.max(0,Math.floor((Date.now()-new Date(state.active.start))/1000));$('timer').textContent=`${Math.floor(sec/3600)}:${String(Math.floor(sec%3600/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;$('livePay').textContent=fmt.money(shiftPay({start:state.active.start,end:new Date().toISOString(),rate:state.rate,holiday:false,tips:0}))};
 tick();if(a)timerId=setInterval(tick,1000);
}
function renderShiftList(node,items){
 node.innerHTML='';if(!items.length){node.innerHTML='<div class="empty">Ще немає змін</div>';return}
 items.forEach(s=>{const row=document.createElement('div');row.className='shift';row.innerHTML=`<div class="shiftLeft"><div class="shiftDate">${fmt.date(s.start)}</div><div class="meta">${fmt.time(s.start)} → ${fmt.time(s.end)} · ${Number(s.rate||state.rate)} Kč/год</div></div><div><div class="money">${fmt.money(shiftPay(s))}</div><div class="hours">${fmt.duration(minutes(s.start,s.end))} год</div></div>`;row.onclick=()=>openShift(s.id);node.appendChild(row)});
}
function renderPlans(){
 const node=$('plansList');node.innerHTML='';
 const today=new Date().toISOString().slice(0,10);
 let sorted=[...state.plans].sort((a,b)=>a.date.localeCompare(b.date));
 if(planFilter==='today')sorted=sorted.filter(p=>p.date===today);
 if(planFilter==='open')sorted=sorted.filter(p=>!p.done);
 if(!sorted.length){node.innerHTML='<div class="empty">У цьому розділі планів немає</div>';return}
 sorted.forEach(p=>{
  const row=document.createElement('div');row.className='plan';
  row.innerHTML=`<span class="priorityDot ${p.priority||'normal'}"></span><button class="check ${p.done?'done':''}">${p.done?'✓':''}</button><div class="planText ${p.done?'done':''}">${p.text}<div class="meta">${new Date(p.date+'T12:00').toLocaleDateString('uk-UA',{weekday:'short',day:'numeric',month:'long'})}</div></div><button class="deletePlan">×</button>`;
  row.querySelector('.check').onclick=()=>{p.done=!p.done;save();render()};
  row.querySelector('.deletePlan').onclick=()=>{state.plans=state.plans.filter(x=>x.id!==p.id);save();render()};
  node.appendChild(row);
 });
}
function renderCalendar(items){
 const node=$('calendarGrid');node.innerHTML='';
 const [y,m]=state.month.split('-').map(Number),offset=(new Date(y,m-1,1).getDay()+6)%7;
 for(let i=0;i<offset;i++){const blank=document.createElement('div');blank.className='day blank';node.appendChild(blank)}
 const days=new Date(y,m,0).getDate(),today=new Date();
 for(let i=1;i<=days;i++){
  const dateKey=`${y}-${String(m).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
  const info=daySummary(state.shifts,dateKey,state.rate,state.settings);
  const planned=state.plans.some(p=>p.date===dateKey&&!p.done);
  const day=document.createElement('button');day.className='day';day.textContent=i;
  if(info.items.length){day.classList.add('worked');const amount=document.createElement('span');amount.className='dayAmount';amount.textContent=Math.round(info.pay);day.appendChild(amount)}
  if(planned)day.classList.add('planned');
  if(today.getFullYear()===y&&today.getMonth()===m-1&&today.getDate()===i)day.classList.add('today');
  day.onclick=()=>openDay(dateKey);
  node.appendChild(day);
 }
}
function changeMonth(delta){const [y,m]=state.month.split('-').map(Number),d=new Date(y,m-1+delta,1);state.month=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;render()}
function openMonth(){const [y,m]=state.month.split('-').map(Number);$('monthSelect').innerHTML=monthNames.map((n,i)=>`<option value="${i+1}">${n}</option>`).join('');$('yearSelect').innerHTML=Array.from({length:11},(_,i)=>y-5+i).map(v=>`<option>${v}</option>`).join('');$('monthSelect').value=m;$('yearSelect').value=y;$('monthDialog').showModal()}
function openShift(id=null){editingId=id;const s=id?state.shifts.find(x=>x.id===id):null,st=s?new Date(s.start):new Date(),en=s?new Date(s.end):new Date(Date.now()+8*3600000);$('shiftTitle').textContent=s?'Редагування зміни':'Нова зміна';$('deleteShift').hidden=!s;$('shiftDate').value=st.toISOString().slice(0,10);$('shiftStart').value=st.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});$('shiftEnd').value=en.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});$('shiftRate').value=s?Number(s.rate||state.rate):state.rate;$('shiftHoliday').checked=s?!!s.holiday:false;$('shiftTips').value=s?Number(s.tips||0):0;$('shiftNote').value=s?s.note||'':'';$('holidayField').hidden=!state.settings.holiday;$('tipsField').hidden=!state.settings.tips;$('shiftDialog').showModal()}
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
function openPlanDialog(dateValue=new Date().toISOString().slice(0,10)){
 $('planDate').value=dateValue;
 $('planText').value='';
 $('planPriority').value='normal';
 $('planDialog').showModal();
}

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
function openDay(dateKey){
 selectedDay=dateKey;
 const info=daySummary(state.shifts,dateKey,state.rate,state.settings);
 const plans=state.plans.filter(p=>p.date===dateKey);
 $('dayDialogTitle').textContent=new Date(dateKey+'T12:00').toLocaleDateString('uk-UA',{weekday:'long',day:'numeric',month:'long'});
 $('dayDialogSummary').innerHTML=`<div class="label">Підсумок дня</div><strong>${fmt.duration(info.minutes)} год · ${fmt.money(info.pay)}</strong>`;
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
  item.onclick=()=>{$('dayDialog').close();openShift(s.id)};
  list.appendChild(item);
 });
 $('dayDialog').showModal();
}

const bind=(id,event,handler)=>{const node=$(id);if(node)node.addEventListener(event,handler)};

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

bind('startButton','click',()=>{state.active={start:new Date().toISOString()};save();render()});
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
 state.active={start:date.toISOString()};save();$('startDialog').close();render();
});
bind('stopButton','click',()=>{
 if(!state.active)return;
 const shift={id:crypto.randomUUID(),start:state.active.start,end:new Date().toISOString(),rate:state.rate,holiday:false,tips:0,note:''};
 state.shifts.push(shift);state.active=null;save();render();toast(`Зміна збережена · ${fmt.money(shiftPay(shift))}`);
});
bind('cancelButton','click',()=>{if(confirm('Скасувати початок зміни?')){state.active=null;save();render()}});

bind('addShiftButton','click',()=>openShift());
bind('quickShift','click',()=>openShift());
bind('saveShift','click',()=>{
 const startDate=new Date(`${$('shiftDate').value}T${$('shiftStart').value}`);
 const endDate=new Date(`${$('shiftDate').value}T${$('shiftEnd').value}`);
 if(Number.isNaN(startDate.getTime())||Number.isNaN(endDate.getTime()))return alert('Вкажи правильний час');
 if(endDate<=startDate)return alert('Час виходу має бути пізніше');
 const shift={id:editingId||crypto.randomUUID(),start:startDate.toISOString(),end:endDate.toISOString(),rate:Number($('shiftRate').value||state.rate),holiday:$('shiftHoliday').checked,tips:Number($('shiftTips').value||0),note:$('shiftNote').value.trim()};
 if(editingId){const index=state.shifts.findIndex(item=>item.id===editingId);if(index>=0)state.shifts[index]=shift}else state.shifts.push(shift);
 save();$('shiftDialog').close();render();
});
bind('deleteShift','click',()=>{if(editingId&&confirm('Видалити цю зміну?')){state.shifts=state.shifts.filter(item=>item.id!==editingId);save();$('shiftDialog').close();render()}});

bind('addPlanButton','click',()=>openPlanDialog());
bind('quickPlan','click',()=>openPlanDialog());
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

function openView(id){
 document.querySelectorAll('.nav').forEach(node=>node.classList.toggle('active',node.dataset.view===id));
 document.querySelectorAll('.view').forEach(node=>node.classList.toggle('active',node.id===id));
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>openView(button.dataset.view)));
document.querySelectorAll('[data-open],[data-open-view]').forEach(button=>button.addEventListener('click',()=>openView(button.dataset.open||button.dataset.openView)));

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
