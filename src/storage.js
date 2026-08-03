
function safeJSON(key,fallback){
 try{
  const raw=localStorage.getItem(key);
  return raw===null?fallback:JSON.parse(raw);
 }catch(error){
  console.warn('Помилка локальних даних:',key,error);
  return fallback;
 }
}
const KEYS={
 shifts:'workTrackerDataV1',active:'workTrackerActiveV1',rate:'workTrackerRateV1',
 theme:'workThemeV1',plans:'workPlansV1',settings:'workSettingsV7',dayNotes:'workDayNotesV1',workTasks:'workTasksV1',lastBackup:'workLastBackupV1'
};
export const storage={
 shifts:()=>safeJSON(KEYS.shifts,[]).map(s=>({...s,rate:s.rate||null,note:s.note||''})),
 saveShifts:v=>localStorage.setItem(KEYS.shifts,JSON.stringify(v)),
 active:()=>safeJSON(KEYS.active,null),
 saveActive:v=>localStorage.setItem(KEYS.active,JSON.stringify(v)),
 rate:()=>Number(localStorage.getItem(KEYS.rate)||180),
 saveRate:v=>localStorage.setItem(KEYS.rate,String(v)),
 theme:()=>localStorage.getItem(KEYS.theme)||'light',
 saveTheme:v=>localStorage.setItem(KEYS.theme,v),
 plans:()=>safeJSON(KEYS.plans,[]),
 savePlans:v=>localStorage.setItem(KEYS.plans,JSON.stringify(v)),
 settings:()=>Object.assign({
  overtime:false,overtimeAfter:8,overtimePercent:25,
  weekend:false,weekendPercent:25,
  holiday:false,holidayPercent:100,
  tips:false,paySplit:true,goalAmount:0
 },safeJSON(KEYS.settings,{})),
 saveSettings:v=>localStorage.setItem(KEYS.settings,JSON.stringify(v)),
 dayNotes:()=>safeJSON(KEYS.dayNotes,{}),
 saveDayNotes:v=>localStorage.setItem(KEYS.dayNotes,JSON.stringify(v)),
 workTasks:()=>safeJSON(KEYS.workTasks,[]),
 saveWorkTasks:v=>localStorage.setItem(KEYS.workTasks,JSON.stringify(v)),
 lastBackup:()=>localStorage.getItem(KEYS.lastBackup)||'',
 saveLastBackup:v=>localStorage.setItem(KEYS.lastBackup,v),
 clearAll:()=>Object.values(KEYS).forEach(key=>localStorage.removeItem(key))
};
