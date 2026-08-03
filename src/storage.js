
function safeJSON(key,fallback){
 try{
  const raw=localStorage.getItem(key);
  return raw===null?fallback:JSON.parse(raw);
 }catch(error){
  console.warn('Помилка локальних даних:',key,error);
  return fallback;
 }
}

const LEGACY_KEYS={
 shifts:'workTrackerDataV1',active:'workTrackerActiveV1',rate:'workTrackerRateV1',
 theme:'workThemeV1',plans:'workPlansV1',settings:'workSettingsV7',
 dayNotes:'workDayNotesV1',workTasks:'workTasksV1',lastBackup:'workLastBackupV1'
};
const STORE_KEY='workProfilesV13';
const LEGACY_SNAPSHOT_KEY='workLegacySnapshotV13';

const defaultSettings=()=>({
 overtime:false,overtimeAfter:8,overtimePercent:25,
 weekend:false,weekendPercent:25,
 holiday:false,holidayPercent:100,
 tips:false,paySplit:true,goalAmount:0,
 startReminder:false,startReminderTime:'08:00',
 endReminder:false,endReminderHours:10,
 unfinishedShiftReminder:true,
 lastStartReminderDate:'',
 lastEndReminderSession:''
});
const uid=()=>crypto.randomUUID();

function legacyData(){
 return {
  shifts:safeJSON(LEGACY_KEYS.shifts,[]).map(s=>({...s,rate:s.rate||null,note:s.note||''})),
  active:safeJSON(LEGACY_KEYS.active,null),
  rate:Number(localStorage.getItem(LEGACY_KEYS.rate)||180),
  theme:localStorage.getItem(LEGACY_KEYS.theme)||'light',
  plans:safeJSON(LEGACY_KEYS.plans,[]),
  settings:Object.assign(defaultSettings(),safeJSON(LEGACY_KEYS.settings,{})),
  dayNotes:safeJSON(LEGACY_KEYS.dayNotes,{}),
  workTasks:safeJSON(LEGACY_KEYS.workTasks,[]),
  lastBackup:localStorage.getItem(LEGACY_KEYS.lastBackup)||''
 };
}

function createJob(name='Основна робота',data={}){
 return {id:data.id||uid(),name:(name||'Основна робота').trim()||'Основна робота',rate:Number(data.rate||180),currency:data.currency||'Kč',color:data.color||'#4A67E8',archived:!!data.archived,note:data.note||'',createdAt:data.createdAt||new Date().toISOString()};
}
function migrateProfileJobs(profile){
 const data=profile.data||{};
 if(!Array.isArray(data.jobs)||!data.jobs.length){
  const job=createJob(profile.job||'Основна робота',{rate:Number(data.rate||180),currency:profile.currency||'Kč'});
  data.jobs=[job];data.activeJobId=job.id;
 }
 if(!data.activeJobId||!data.jobs.some(job=>job.id===data.activeJobId&&!job.archived))data.activeJobId=(data.jobs.find(job=>!job.archived)||data.jobs[0]).id;
 const defaultJobId=data.activeJobId;
 data.shifts=(Array.isArray(data.shifts)?data.shifts:[]).map(item=>({...item,jobId:item.jobId||defaultJobId}));
 data.plans=(Array.isArray(data.plans)?data.plans:[]).map(item=>({...item,jobId:item.jobId||defaultJobId}));
 data.workTasks=(Array.isArray(data.workTasks)?data.workTasks:[]).map(item=>({...item,jobId:item.jobId||defaultJobId}));
 if(data.active&&!data.active.jobId)data.active.jobId=defaultJobId;
 profile.data=data;return profile;
}
function createProfile(name='Мій профіль',data=null){
 const d=data||{};const defaultJob=createJob(d.job||'Основна робота',{rate:Number(d.rate||180),currency:d.currency||'Kč'});
 return migrateProfileJobs({id:uid(),name:name.trim()||'Мій профіль',job:d.job||'',currency:d.currency||'Kč',createdAt:new Date().toISOString(),data:{jobs:Array.isArray(d.jobs)&&d.jobs.length?d.jobs:[defaultJob],activeJobId:d.activeJobId||defaultJob.id,shifts:Array.isArray(d.shifts)?d.shifts:[],active:d.active||null,rate:Number(d.rate||180),theme:d.theme==='dark'?'dark':'light',plans:Array.isArray(d.plans)?d.plans:[],settings:Object.assign(defaultSettings(),d.settings||{}),dayNotes:d.dayNotes&&typeof d.dayNotes==='object'?d.dayNotes:{},workTasks:Array.isArray(d.workTasks)?d.workTasks:[],lastBackup:d.lastBackup||''}});
}

function ensureStore(){
 let store=safeJSON(STORE_KEY,null);
 if(store&&Array.isArray(store.profiles)&&store.profiles.length){
  let changed=false;store.profiles=store.profiles.map(profile=>{const before=JSON.stringify(profile.data?.jobs||null);const migrated=migrateProfileJobs(profile);if(before!==JSON.stringify(migrated.data.jobs))changed=true;return migrated});
  if(!store.activeProfileId||!store.profiles.some(p=>p.id===store.activeProfileId)){store.activeProfileId=store.profiles[0].id;changed=true}
  if(store.schema!==2){store.schema=2;changed=true}if(changed)localStorage.setItem(STORE_KEY,JSON.stringify(store));return store;
 }
 const legacy=legacyData();
 if(!localStorage.getItem(LEGACY_SNAPSHOT_KEY)){
  localStorage.setItem(LEGACY_SNAPSHOT_KEY,JSON.stringify({
   savedAt:new Date().toISOString(),
   data:legacy
  }));
 }
 const first=createProfile('Мій профіль',legacy);
 store={schema:1,activeProfileId:first.id,profiles:[first]};
 localStorage.setItem(STORE_KEY,JSON.stringify(store));
 return store;
}

function getStore(){return ensureStore()}
function saveStore(store){localStorage.setItem(STORE_KEY,JSON.stringify(store))}
function activeProfile(store=getStore()){
 return store.profiles.find(p=>p.id===store.activeProfileId)||store.profiles[0];
}
function read(field,fallback){
 const value=activeProfile()?.data?.[field];
 return value===undefined?fallback:value;
}
function write(field,value){
 const store=getStore();
 const profile=activeProfile(store);
 profile.data[field]=value;
 saveStore(store);
}

export const storage={
 // Existing API now transparently reads/writes the active profile.
 shifts:()=>read('shifts',[]).map(s=>({...s,rate:s.rate||null,note:s.note||''})),
 saveShifts:v=>write('shifts',v),
 active:()=>read('active',null),
 saveActive:v=>write('active',v),
 rate:()=>{const profile=activeProfile();const job=profile.data.jobs.find(item=>item.id===profile.data.activeJobId)||profile.data.jobs[0];return Number(job?.rate||profile.data.rate||180)},
 saveRate:v=>{const store=getStore();const profile=activeProfile(store);const job=profile.data.jobs.find(item=>item.id===profile.data.activeJobId);if(job)job.rate=Number(v);profile.data.rate=Number(v);saveStore(store)},
 theme:()=>read('theme','light'),
 saveTheme:v=>write('theme',v),
 plans:()=>read('plans',[]),
 savePlans:v=>write('plans',v),
 settings:()=>Object.assign(defaultSettings(),read('settings',{})),
 saveSettings:v=>write('settings',v),
 dayNotes:()=>read('dayNotes',{}),
 saveDayNotes:v=>write('dayNotes',v),
 workTasks:()=>read('workTasks',[]),
 saveWorkTasks:v=>write('workTasks',v),
 lastBackup:()=>read('lastBackup',''),
 saveLastBackup:v=>write('lastBackup',v),

 jobs:()=>activeProfile().data.jobs.map(job=>({...job})),
 activeJobId:()=>activeProfile().data.activeJobId,
 activeJob:()=>{const profile=activeProfile();const job=profile.data.jobs.find(item=>item.id===profile.data.activeJobId)||profile.data.jobs[0];return {...job}},
 switchJob:id=>{const store=getStore();const profile=activeProfile(store);const job=profile.data.jobs.find(item=>item.id===id&&!item.archived);if(!job)throw new Error('Роботу не знайдено');if(profile.data.active)throw new Error('Спочатку заверши активну зміну');profile.data.activeJobId=id;profile.data.rate=Number(job.rate||180);profile.currency=job.currency||profile.currency||'Kč';saveStore(store)},
 createJob:payload=>{const store=getStore();const profile=activeProfile(store);const job=createJob(payload.name,payload);profile.data.jobs.push(job);profile.data.activeJobId=job.id;profile.data.rate=job.rate;profile.currency=job.currency;saveStore(store);return job.id},
 updateJob:(id,patch)=>{const store=getStore();const profile=activeProfile(store);const job=profile.data.jobs.find(item=>item.id===id);if(!job)throw new Error('Роботу не знайдено');if(typeof patch.name==='string')job.name=patch.name.trim()||job.name;if(patch.rate!==undefined)job.rate=Number(patch.rate||0);if(typeof patch.currency==='string')job.currency=patch.currency;if(typeof patch.color==='string')job.color=patch.color;if(typeof patch.note==='string')job.note=patch.note.trim();if(profile.data.activeJobId===id){profile.data.rate=job.rate;profile.currency=job.currency}saveStore(store)},
 archiveJob:id=>{const store=getStore();const profile=activeProfile(store);const activeJobs=profile.data.jobs.filter(job=>!job.archived);if(activeJobs.length<=1)throw new Error('Не можна архівувати єдину активну роботу');if(profile.data.active?.jobId===id)throw new Error('Спочатку заверши активну зміну');const job=profile.data.jobs.find(item=>item.id===id);if(!job)throw new Error('Роботу не знайдено');job.archived=true;if(profile.data.activeJobId===id){const next=profile.data.jobs.find(item=>!item.archived);profile.data.activeJobId=next.id;profile.data.rate=next.rate;profile.currency=next.currency}saveStore(store)},

 profiles:()=>getStore().profiles.map(({data,...profile})=>({
  ...profile,
  rate:Number(data.rate||180),
  shiftCount:Array.isArray(data.shifts)?data.shifts.length:0
 })),
 activeProfile:()=>{
  const {data,...profile}=activeProfile();
  return {...profile,rate:Number(data.rate||180)};
 },
 activeProfileId:()=>getStore().activeProfileId,
 switchProfile:id=>{
  const store=getStore();
  if(!store.profiles.some(p=>p.id===id))throw new Error('Профіль не знайдено');
  store.activeProfileId=id;
  saveStore(store);
 },
 createProfile:({name,job='',currency='Kč',rate=180})=>{
  const store=getStore();
  const profile=createProfile(name,{job,currency,rate,theme:read('theme','light')});
  profile.job=job;
  profile.currency=currency;
  store.profiles.push(profile);
  store.activeProfileId=profile.id;
  saveStore(store);
  return profile.id;
 },
 updateProfile:(id,patch)=>{
  const store=getStore();
  const profile=store.profiles.find(p=>p.id===id);
  if(!profile)throw new Error('Профіль не знайдено');
  if(typeof patch.name==='string')profile.name=patch.name.trim()||profile.name;
  if(typeof patch.job==='string')profile.job=patch.job.trim();
  if(typeof patch.currency==='string')profile.currency=patch.currency;
  if(patch.rate!==undefined)profile.data.rate=Number(patch.rate||0);
  saveStore(store);
 },
 deleteProfile:id=>{
  const store=getStore();
  if(store.profiles.length<=1)throw new Error('Не можна видалити єдиний профіль');
  store.profiles=store.profiles.filter(p=>p.id!==id);
  if(store.activeProfileId===id)store.activeProfileId=store.profiles[0].id;
  saveStore(store);
 },
 exportStore:()=>structuredClone(getStore()),
 importStore:store=>{
  if(!store||!Array.isArray(store.profiles)||!store.profiles.length)throw new Error('Некоректні профілі');
  localStorage.setItem(STORE_KEY,JSON.stringify(store));
 },
 clearAll:()=>{
  localStorage.removeItem(STORE_KEY);
  Object.values(LEGACY_KEYS).forEach(key=>localStorage.removeItem(key));
 }
};
