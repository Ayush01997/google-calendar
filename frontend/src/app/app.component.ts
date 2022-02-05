import { startOfDay } from "date-fns";
import { Component } from "@angular/core";
import { CalendarView, CalendarEvent } from "angular-calendar";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  mdlSampleIsOpen: boolean = false;

  openModal(open: boolean): void {
    this.mdlSampleIsOpen = open;
  }
  setView(view: CalendarView) {
    this.view = view;
  }

  events: CalendarEvent[] = [
    {
      start: startOfDay(new Date()),
      title: "First event",
    },
    {
      start: startOfDay(new Date()),
      title: "Second event",
    },
  ];

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);
    this.mdlSampleIsOpen = true
    //let x=this.adminService.dateFormat(date)
    //this.openAppointmentList(x)
  }
}
