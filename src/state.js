
import { storage } from './storage.js';

export const state = {
  shifts: storage.loadShifts(),
  active: storage.loadActive(),
  rate: storage.getRate(),
  theme: storage.getTheme(),
  settings: storage.loadSettings(),
  month: new Date().toISOString().slice(0, 7),

  persist() {
    storage.saveShifts(this.shifts);
    storage.saveActive(this.active);
    storage.setRate(this.rate);
    storage.setTheme(this.theme);
    storage.saveSettings(this.settings);
  }
};
