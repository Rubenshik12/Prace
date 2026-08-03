import {storage} from './storage.js?v=v16-9-statistics-chart-fix-20260804-04-34';

export const state={
 month:new Date().toISOString().slice(0,7),
 loadProfile(){
  this.jobs=storage.jobs();
  this.activeJobId=storage.activeJobId();
  this.activeJob=storage.activeJob();
  this.calendarJobFilter='all';
  this.statsJobFilter='all';
  this.plansJobFilter='all';
  this.shifts=storage.shifts();
  this.active=storage.active();
  this.rate=storage.rate();
  this.theme=storage.theme();
  this.plans=storage.plans();
  this.settings=storage.settings();
  this.dayNotes=storage.dayNotes();
  this.workTasks=storage.workTasks();
  this.profile=storage.activeProfile();
  return this;
 },
 save(){
  storage.saveShifts(this.shifts);
  storage.saveActive(this.active);
  storage.saveRate(this.rate);
  storage.saveTheme(this.theme);
  storage.savePlans(this.plans);
  storage.saveSettings(this.settings);
  storage.saveDayNotes(this.dayNotes);
  storage.saveWorkTasks(this.workTasks);
 }
};
state.loadProfile();
