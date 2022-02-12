import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './calendar/calendar.component';
import { MatNativeDateModule} from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { SetAvailabilityComponent } from './set-availability/set-availability.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SetupCalendarComponent } from './setup-calendar/setup-calendar.component';
import { ValidateAuthComponent } from './validate-auth/validate-auth.component';
import { ViewCalendarComponent } from './view-calendar/view-calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    SetAvailabilityComponent,
    SetupCalendarComponent,
    ValidateAuthComponent,
    ViewCalendarComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxMaterialTimepickerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    AppRoutingModule     
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
