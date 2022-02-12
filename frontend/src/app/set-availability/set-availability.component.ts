import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-set-availability',
  templateUrl: './set-availability.component.html',
  styleUrls: ['./set-availability.component.css']
})
export class SetAvailabilityComponent implements OnInit {
  startTime: string
  endTime: string

  time: any;
  time2: any;

  constructor() { }

  ngOnInit(): void {
  }

  selectFirstTime(event) {
    this.startTime = event
    console.log(this.startTime)
  }

  selectSecondTime(event) {
    this.endTime = event
    console.log(this.endTime)
  }

  onSubmit(formData) {
    console.log(formData.value)
    let obj = formData.value;
    let weekDays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
    let keys = Object.keys(obj);
    let filtered = keys.filter(k =>{ return obj[k] })
    let days = filtered.map((day)=> { return weekDays.indexOf(day)})
    console.log(days)
  }

}
