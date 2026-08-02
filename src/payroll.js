
export function minutesBetween(start, end) {
  return Math.max(0, (new Date(end) - new Date(start)) / 60000);
}

export function calculateShiftPay(shift, baseRate, settings) {
  const totalMinutes = minutesBetween(shift.start, shift.end);
  const rate = Number(shift.rate || baseRate);
  let pay = totalMinutes / 60 * rate;

  if (settings.overtimeEnabled) {
    const threshold = settings.overtimeAfter * 60;
    const normal = Math.min(totalMinutes, threshold);
    const extra = Math.max(0, totalMinutes - threshold);
    pay = normal / 60 * rate + extra / 60 * rate * (1 + settings.overtimePercent / 100);
  }

  const day = new Date(shift.start).getDay();
  if (settings.weekendEnabled && (day === 0 || day === 6)) {
    pay *= 1 + settings.weekendPercent / 100;
  }

  if (settings.holidayEnabled && shift.holiday) {
    pay *= 1 + settings.holidayPercent / 100;
  }

  return pay;
}

export function monthSummary(shifts, monthKey, baseRate, settings) {
  const selected = shifts.filter(s => s.start.slice(0, 7) === monthKey);
  let minutes = 0, first = 0, second = 0;

  for (const shift of selected) {
    const duration = minutesBetween(shift.start, shift.end);
    const pay = calculateShiftPay(shift, baseRate, settings);
    minutes += duration;
    if (new Date(shift.start).getDate() <= 15) first += pay;
    else second += pay;
  }

  return { selected, minutes, first, second, total: first + second };
}
