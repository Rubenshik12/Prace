
import {storage} from './storage.js';
export const state={
 shifts:storage.shifts(),active:storage.active(),rate:storage.rate(),theme:storage.theme(),
 plans:storage.plans(),settings:storage.settings(),month:new Date().toISOString().slice(0,7),
 save(){storage.saveShifts(this.shifts);storage.saveActive(this.active);storage.saveRate(this.rate);storage.saveTheme(this.theme);storage.savePlans(this.plans);storage.saveSettings(this.settings)}
};
