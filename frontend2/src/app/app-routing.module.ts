import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEventComponent } from './calendar/create-event/create-event.component';
import { ViewCalendarComponent } from './calendar/view-calendar/view-calendar.component';

const routes: Routes = [
  {path: "viewCalendar", component: ViewCalendarComponent},
  {path : 'createEvent', component: CreateEventComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
