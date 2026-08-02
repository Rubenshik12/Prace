
const KEYS = {
  shifts: 'workTrackerDataV1',
  active: 'workTrackerActiveV1',
  rate: 'workTrackerRateV1',
  theme: 'workThemeV1',
  settings: 'workSettingsV6'
};

export const storage = {
  loadShifts() {
    return JSON.parse(localStorage.getItem(KEYS.shifts) || '[]')
      .map(s => ({ ...s, rate: s.rate || null, note: s.note || '' }));
  },
  saveShifts(shifts) { localStorage.setItem(KEYS.shifts, JSON.stringify(shifts)); },
  loadActive() { return JSON.parse(localStorage.getItem(KEYS.active) || 'null'); },
  saveActive(active) { localStorage.setItem(KEYS.active, JSON.stringify(active)); },
  getRate() { return Number(localStorage.getItem(KEYS.rate) || 180); },
  setRate(rate) { localStorage.setItem(KEYS.rate, String(rate)); },
  getTheme() { return localStorage.getItem(KEYS.theme) || 'light'; },
  setTheme(theme) { localStorage.setItem(KEYS.theme, theme); },
  loadSettings() {
    return Object.assign({
      overtimeEnabled: false,
      overtimeAfter: 8,
      overtimePercent: 25,
      weekendEnabled: false,
      weekendPercent: 25,
      holidayEnabled: false,
      holidayPercent: 100
    }, JSON.parse(localStorage.getItem(KEYS.settings) || '{}'));
  },
  saveSettings(settings) { localStorage.setItem(KEYS.settings, JSON.stringify(settings)); }
};
