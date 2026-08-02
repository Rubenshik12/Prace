
export const format = {
  time(value) {
    return new Date(value).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  },
  date(value) {
    return new Date(value).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },
  duration(minutes) {
    const rounded = Math.round(minutes);
    return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')}`;
  },
  money(value) {
    return `${Math.round(value).toLocaleString('uk-UA')} Kč`;
  },
  month(monthKey) {
    const [year, month] = monthKey.split('-').map(Number);
    const names = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
    return `${names[month - 1]} ${year}`;
  }
};
