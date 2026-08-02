
const KEYS={
 shifts:'workTrackerDataV1',active:'workTrackerActiveV1',rate:'workTrackerRateV1',
 theme:'workThemeV1',plans:'workPlansV1',settings:'workSettingsV7'
};
export const storage={
 shifts:()=>JSON.parse(localStorage.getItem(KEYS.shifts)||'[]').map(s=>({...s,rate:s.rate||null,note:s.note||''})),
 saveShifts:v=>localStorage.setItem(KEYS.shifts,JSON.stringify(v)),
 active:()=>JSON.parse(localStorage.getItem(KEYS.active)||'null'),
 saveActive:v=>localStorage.setItem(KEYS.active,JSON.stringify(v)),
 rate:()=>Number(localStorage.getItem(KEYS.rate)||180),
 saveRate:v=>localStorage.setItem(KEYS.rate,String(v)),
 theme:()=>localStorage.getItem(KEYS.theme)||'light',
 saveTheme:v=>localStorage.setItem(KEYS.theme,v),
 plans:()=>JSON.parse(localStorage.getItem(KEYS.plans)||'[]'),
 savePlans:v=>localStorage.setItem(KEYS.plans,JSON.stringify(v)),
 settings:()=>Object.assign({
  overtime:false,overtimeAfter:8,overtimePercent:25,
  weekend:false,weekendPercent:25,
  holiday:false,holidayPercent:100,
  tips:false,paySplit:true
 },JSON.parse(localStorage.getItem(KEYS.settings)||'{}')),
 saveSettings:v=>localStorage.setItem(KEYS.settings,JSON.stringify(v))
};
