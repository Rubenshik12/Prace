
import { state } from './state.js';
import { storage } from './storage.js';
import { calculateShiftPay, monthSummary, minutesBetween } from './payroll.js';
import { format } from './format.js';
import { appTemplate, renderShiftRows } from './ui.js';

document.getElementById('app').innerHTML = appTemplate();
const $ = id => document.getElementById(id);
let timerId = null;
let editingId = null;

function persist() {
  state.persist();
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  $('settingsTheme').value = state.theme;
}

function pay(shift) {
  return calculateShiftPay(shift, state.rate, state.settings);
}

function render() {
  const summary = monthSummary(state.shifts, state.month, state.rate, state.settings);
  $('monthLabel').textContent = format.month(state.month);
  $('rateLabel').textContent = `${state.rate} Kč`;
  $('settingsRate').value = state.rate;
  $('countValue').textContent = summary.selected.length;
  $('hoursValue').textContent = format.duration(summary.minutes);
  $('firstValue').textContent = format.money(summary.first);
  $('secondValue').textContent = format.money(summary.second);
  $('totalValue').textContent = format.money(summary.total);

  const avg = summary.selected.length ? summary.minutes / summary.selected.length : 0;
  $('averageValue').textContent = format.duration(avg);

  renderActive();
  renderShiftRows($('shiftList'), summary.selected.slice(0, 5), pay, openShift);
  renderShiftRows($('historyList'), summary.selected, pay, openShift);
}

function renderActive() {
  const active = state.active;
  $('activeCard').classList.toggle('inactive', !active);
  $('startButton').hidden = !!active;
  $('manualStartButton').hidden = !!active;
  $('stopButton').hidden = !active;
  $('cancelButton').hidden = !active;
  $('statusText').textContent = active ? `На роботі з ${format.time(active.start)}` : 'Зміна не почата';
  $('statusBadge').textContent = active ? 'Триває' : '';
  clearInterval(timerId);

  const tick = () => {
    if (!state.active) {
      $('timer').textContent = '0:00:00';
      $('livePay').textContent = '0 Kč';
      return;
    }
    const seconds = Math.max(0, Math.floor((Date.now() - new Date(state.active.start)) / 1000));
    $('timer').textContent =
      `${Math.floor(seconds/3600)}:${String(Math.floor(seconds%3600/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
    const tempShift = { start: state.active.start, end: new Date().toISOString(), rate: state.rate };
    $('livePay').textContent = format.money(pay(tempShift));
  };

  tick();
  if (active) timerId = setInterval(tick, 1000);
}

function toast(message) {
  const node = document.getElementById('toast');
  node.textContent = message;
  node.classList.add('show');
  setTimeout(() => node.classList.remove('show'), 2500);
}

function openShift(id = null) {
  editingId = id;
  const shift = id ? state.shifts.find(s => s.id === id) : null;
  const start = shift ? new Date(shift.start) : new Date();
  const end = shift ? new Date(shift.end) : new Date(Date.now() + 8 * 3600000);

  $('shiftDialogTitle').textContent = shift ? 'Редагування зміни' : 'Нова зміна';
  $('deleteShift').hidden = !shift;
  $('shiftDate').value = start.toISOString().slice(0, 10);
  $('shiftStart').value = start.toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'});
  $('shiftEnd').value = end.toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'});
  $('shiftRate').value = shift ? Number(shift.rate || state.rate) : state.rate;
  $('shiftDialog').showModal();
}

$('startButton').onclick = () => {
  state.active = { start: new Date().toISOString() };
  persist();
  render();
};

$('manualStartButton').onclick = () => {
  const now = new Date();
  $('startDate').value = now.toISOString().slice(0, 10);
  $('startTime').value = now.toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'});
  $('startDialog').showModal();
};

$('cancelStart').onclick = () => $('startDialog').close();
$('saveStart').onclick = () => {
  const start = new Date(`${$('startDate').value}T${$('startTime').value}`);
  if (start > new Date()) return alert('Час не може бути в майбутньому');
  state.active = { start: start.toISOString() };
  persist();
  $('startDialog').close();
  render();
};

$('stopButton').onclick = () => {
  if (!state.active) return;
  const shift = {
    id: crypto.randomUUID(),
    start: state.active.start,
    end: new Date().toISOString(),
    rate: state.rate
  };
  state.shifts.push(shift);
  state.active = null;
  persist();
  render();
  toast(`Зміна збережена · ${format.money(pay(shift))}`);
};

$('cancelButton').onclick = () => {
  if (confirm('Скасувати початок зміни?')) {
    state.active = null;
    persist();
    render();
  }
};

$('monthCard').onclick = () => {
  const [year, month] = state.month.split('-').map(Number);
  const names = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
  $('monthSelect').innerHTML = names.map((name, index) => `<option value="${index+1}">${name}</option>`).join('');
  $('yearSelect').innerHTML = Array.from({length:11},(_,i)=>year-5+i).map(y=>`<option>${y}</option>`).join('');
  $('monthSelect').value = month;
  $('yearSelect').value = year;
  $('monthDialog').showModal();
};
$('cancelMonth').onclick = () => $('monthDialog').close();
$('saveMonth').onclick = () => {
  state.month = `${$('yearSelect').value}-${String($('monthSelect').value).padStart(2,'0')}`;
  $('monthDialog').close();
  render();
};

$('rateCard').onclick = () => {
  $('rateInput').value = state.rate;
  $('rateDialog').showModal();
};
$('cancelRate').onclick = () => $('rateDialog').close();
$('saveRate').onclick = () => {
  state.rate = Number($('rateInput').value || 0);
  persist();
  $('rateDialog').close();
  render();
};

$('addShiftButton').onclick = () => openShift();
$('saveShift').onclick = () => {
  const start = new Date(`${$('shiftDate').value}T${$('shiftStart').value}`);
  const end = new Date(`${$('shiftDate').value}T${$('shiftEnd').value}`);
  if (end <= start) return alert('Час виходу має бути пізніше');

  const shift = {
    id: editingId || crypto.randomUUID(),
    start: start.toISOString(),
    end: end.toISOString(),
    rate: Number($('shiftRate').value || state.rate)
  };

  if (editingId) {
    const index = state.shifts.findIndex(s => s.id === editingId);
    state.shifts[index] = shift;
  } else {
    state.shifts.push(shift);
  }

  persist();
  $('shiftDialog').close();
  render();
};

$('deleteShift').onclick = () => {
  if (editingId && confirm('Видалити цю зміну?')) {
    state.shifts = state.shifts.filter(s => s.id !== editingId);
    persist();
    $('shiftDialog').close();
    render();
  }
};

$('settingsRate').oninput = e => {
  state.rate = Number(e.target.value || 0);
  persist();
  render();
};
$('settingsTheme').onchange = e => {
  state.theme = e.target.value;
  persist();
  applyTheme();
};
$('themeButton').onclick = () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  persist();
  applyTheme();
};

document.querySelectorAll('.nav').forEach(button => {
  button.onclick = () => {
    document.querySelectorAll('.nav').forEach(n => n.classList.toggle('active', n === button));
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === button.dataset.view));
  };
});

applyTheme();
render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
