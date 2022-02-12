import { Component, OnInit } from "@angular/core";

import data from "../../data.json";
import {calculate_time_slot } from '../helper/index'

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  selected: Date | null;

  availableTime = [];
  x = 30; //minutes interval
  times = []; // time array
  tt = 0; // start time
  ap = ["AM", "PM"]; // AM-PM

  constructor() {
    console.log(data.availableHr.startTime);
    // this.generateTime();
    // let startIndex = this.times.findIndex(
    //   (e) => e == data.availableHr.startTime
    // );
    // let endIndex = this.times.findIndex((e) => e == data.availableHr.endTime);
    // console.log(startIndex);
    // console.log(endIndex);
    // this.availableTime = this.times.slice(startIndex, endIndex + 1);
    //console.log(finalTime)
    this.availableTime = calculate_time_slot('10:30','16:45', 15)
    console.log(this.availableTime)
  }

  ngOnInit(): void {}

  filterDates = (date: Date): boolean => {
    const day = date.getDay();

    /* Prevent Saturday and Sunday for select. */
    return day !== 0 && day !== 6 ;
      
  }
  

  generateTime() {
    //loop to increment the time and push results in array
    for (var i = 0; this.tt < 24 * 60; i++) {
      var hh = Math.floor(this.tt / 60); // getting hours of day in 0-24 format
      var mm = this.tt % 60; // getting minutes of the hour in 0-55 format
      let time =
        ("0" + (hh % 12)).slice(-2) +
        ":" +
        ("0" + mm).slice(-2) +
        this.ap[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
      if (
        time == "00:00AM" ||
        time == "00:30AM" ||
        time == "00:00PM" ||
        time == "00:30PM"
      ) {
        time = time.replace("00:", "12:");
      }
      this.times[i] = time;
      this.tt = this.tt + this.x;
    }
    console.log(this.times);
  }

myFilter = (d: Date | null): boolean => {
  const day = (d || new Date()).getDay();
  // Prevent Saturday and Sunday from being selected.
  if(data.availableDays.includes(day)){
    return true
  }else{
    return false
  }
}

}
