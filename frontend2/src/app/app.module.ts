import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogContentExampleDialog, ViewCalendarComponent } from './calendar/view-calendar/view-calendar.component';
import { CreateEventComponent } from './calendar/create-event/create-event.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule }   from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { EventDialogComponent } from './calendar/event-dialog/event-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    ViewCalendarComponent,
    CreateEventComponent,
    DialogContentExampleDialog,
    EventDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatNativeDateModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
