import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCalendarComponent } from './calendar/view-calendar/view-calendar.component';

const routes: Routes = [
  {path: "viewCalendar", component: ViewCalendarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
