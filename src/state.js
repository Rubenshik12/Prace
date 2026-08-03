
import {storage} from './storage.js?v=v12-3-ui-polish-20260803-12';
export const state={
 shifts:storage.shifts(),active:storage.active(),rate:storage.rate(),theme:storage.theme(),
 plans:storage.plans(),settings:storage.settings(),dayNotes:storage.dayNotes(),workTasks:storage.workTasks(),month:new Date().toISOString().slice(0,7),
 save(){storage.saveShifts(this.shifts);storage.saveActive(this.active);storage.saveRate(this.rate);storage.saveTheme(this.theme);storage.savePlans(this.plans);storage.saveSettings(this.settings);storage.saveDayNotes(this.dayNotes);storage.saveWorkTasks(this.workTasks)}
};
