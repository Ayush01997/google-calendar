import { Component, OnInit } from "@angular/core";
  import { SharedService } from "../../common/shared.service";
  import {calculate_time_slot } from '../../helper/index'

@Component({
  selector: "app-view-calendar",
  templateUrl: "./view-calendar.component.html",
  styleUrls: ["./view-calendar.component.css"],
})
export class ViewCalendarComponent implements OnInit {
  calendarData : any = {}
  availableTime:any = [];
  selected: Date | null;
  isDataLoaded : boolean = false;

  constructor(private shared : SharedService) {}

  ngOnInit(): void {
    this.getCalendar()
  }

  filterDates = (date: Date): boolean => {
    const day = date.getDay();

    /* Prevent Saturday and Sunday for select. */
    return day !== 0 && day !== 6 
  }

  onDateSelect() {
    console.log(this.selected)
  }

  getCalendar(){
    this.shared.getMyCalendar(8).subscribe(res => {
      console.log(res)
      this.calendarData = res
      this.isDataLoaded = true
      this.availableTime = calculate_time_slot(res.startTime, res.endTime ,parseInt(res.duration))
    })
  }


myFilter = (d: Date | null): boolean => {
  const day = (d || new Date()).getDay();
  //console.log(day);
  // Prevent Saturday and Sunday from being selected.
  let days =  this.calendarData.availableDays.split(",").map(Number);
  console.log(days);
  if(days.includes(day)){
    return true
  }else{
    return false
  }
}
}
