import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { SetAvailabilityComponent } from './calendar/set-availability/set-availability.component';
import { SetupCalendarComponent } from './setup-calendar/setup-calendar.component';
import { ValidateAuthComponent } from './validate-auth/validate-auth.component';
import { ViewCalendarComponent } from './view-calendar/view-calendar.component';
import { SetupEventComponent } from './calendar/setup-event/setup-event.component';


const routes: Routes = [
  {path: "", component: SetupCalendarComponent},
  {path: "viewCalendar", component: ViewCalendarComponent},
  {path: "validate-auth", component: ValidateAuthComponent},
  {path : '', component : CalendarComponent, children : [
    {path : 'setAvailability', component : SetAvailabilityComponent},
    {path : 'setup-event', component : SetupEventComponent}
  ]},
  
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forRoot(routes)],
    CommonModule
  ]
})
export class AppRoutingModule { }
