
export const minutes=(a,b)=>Math.max(0,(new Date(b)-new Date(a))/60000);
export const pay=(shift,baseRate)=>minutes(shift.start,shift.end)/60*Number(shift.rate||baseRate);
export function summary(shifts,month,baseRate){
 const selected=shifts.filter(s=>s.start.slice(0,7)===month).sort((a,b)=>new Date(b.start)-new Date(a.start));
 let mins=0,first=0,second=0;
 selected.forEach(s=>{const d=minutes(s.start,s.end),p=pay(s,baseRate);mins+=d;new Date(s.start).getDate()<=15?first+=p:second+=p});
 return {selected,mins,first,second,total:first+second};
}
