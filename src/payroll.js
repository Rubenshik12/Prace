
export const minutes=(a,b)=>Math.max(0,(new Date(b)-new Date(a))/60000);

export function pay(shift,baseRate,settings={}){
 const total=minutes(shift.start,shift.end);
 const rate=Number(shift.rate||baseRate);
 let result=total/60*rate;

 if(settings.overtime){
  const threshold=Number(settings.overtimeAfter||8)*60;
  const normal=Math.min(total,threshold);
  const extra=Math.max(0,total-threshold);
  result=normal/60*rate+extra/60*rate*(1+Number(settings.overtimePercent||0)/100);
 }

 const day=new Date(shift.start).getDay();
 if(settings.weekend&&(day===0||day===6)){
  result*=1+Number(settings.weekendPercent||0)/100;
 }
 if(settings.holiday&&shift.holiday){
  result*=1+Number(settings.holidayPercent||0)/100;
 }
 if(settings.tips){
  result+=Number(shift.tips||0);
 }
 return result;
}

export function summary(shifts,month,baseRate,settings={}){
 const selected=shifts.filter(s=>s.start.slice(0,7)===month).sort((a,b)=>new Date(b.start)-new Date(a.start));
 let mins=0,first=0,second=0;
 selected.forEach(s=>{
  const d=minutes(s.start,s.end),p=pay(s,baseRate,settings);
  mins+=d;
  new Date(s.start).getDate()<=15?first+=p:second+=p;
 });
 return {selected,mins,first,second,total:first+second};
}

export function daySummary(shifts,dateKey,baseRate,settings={}){
 const items=shifts.filter(s=>s.start.slice(0,10)===dateKey).sort((a,b)=>new Date(a.start)-new Date(b.start));
 return {
  items,
  minutes:items.reduce((sum,s)=>sum+minutes(s.start,s.end),0),
  pay:items.reduce((sum,s)=>sum+pay(s,baseRate,settings),0)
 };
}
