const WIDGET_KEY='moya_robota_widget_state_v1';
const WIDGET_VERSION=1;

const roundMoney=value=>Math.round((Number(value)||0)*100)/100;

export function buildWidgetState({profile,job,active,rate,currency,earned=0}){
 const now=new Date();
 const startedAt=active?.start||null;
 const elapsedSeconds=startedAt
  ?Math.max(0,Math.floor((Date.now()-new Date(startedAt).getTime())/1000))
  :0;

 return {
  schema:WIDGET_VERSION,
  appVersion:'v16.6 Optimization & Widget Foundation',
  updatedAt:now.toISOString(),
  profile:{
   id:profile?.id||null,
   name:profile?.name||'Мій профіль'
  },
  job:{
   id:job?.id||null,
   name:job?.name||'Основна робота',
   color:job?.color||'#4A67E8',
   rate:Number(rate||job?.rate||0),
   currency:currency||job?.currency||'Kč'
  },
  shift:{
   active:!!active,
   startedAt,
   elapsedSeconds,
   earned:roundMoney(earned),
   sessionId:active?.sessionId||null
  }
 };
}

export function saveWidgetState(snapshot){
 try{
  localStorage.setItem(WIDGET_KEY,JSON.stringify(snapshot));
  window.dispatchEvent(new CustomEvent('moya-robota-widget-state',{detail:snapshot}));
 }catch(error){
  console.warn('Widget state was not saved',error);
 }
 return snapshot;
}

export function readWidgetState(){
 try{
  const raw=localStorage.getItem(WIDGET_KEY);
  return raw?JSON.parse(raw):null;
 }catch{
  return null;
 }
}

export function clearWidgetState(){
 localStorage.removeItem(WIDGET_KEY);
}

export const widgetStateApi={
 key:WIDGET_KEY,
 schema:WIDGET_VERSION,
 read:readWidgetState
};
