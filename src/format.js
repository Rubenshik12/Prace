
export const fmt={
 time:v=>new Date(v).toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'}),
 date:v=>new Date(v).toLocaleDateString('uk-UA',{day:'2-digit',month:'2-digit',year:'numeric'}),
 day:v=>new Date(v).toLocaleDateString('uk-UA',{weekday:'long'}),
 duration:m=>{m=Math.round(m);return `${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}`},
 money:v=>`${Math.round(v).toLocaleString('uk-UA')} Kč`,
 month:key=>{const [y,m]=key.split('-').map(Number);const n=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];return `${n[m-1]} ${y}`}
};
