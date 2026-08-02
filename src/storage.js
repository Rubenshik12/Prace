
const KEYS={
 shifts:'workTrackerDataV1',active:'workTrackerActiveV1',rate:'workTrackerRateV1',
 theme:'workThemeV1',plans:'workPlansV1'
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
 savePlans:v=>localStorage.setItem(KEYS.plans,JSON.stringify(v))
};
