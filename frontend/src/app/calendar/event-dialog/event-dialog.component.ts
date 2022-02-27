import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css']
})
export class EventDialogComponent implements OnInit {
  result : any
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
   let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   let daysNumber = this.data.availableDays.split(",")
   this.result = {
     eventName : this.data.eventName,
     eventDescription : this.data.eventDescription,
     duration : `${this.data.duration} min`,
     email : this.data.email,
     availableTime : `${this.data.startTime} ${this.data.endTime}`,
     availableDays : days.filter((e,i) => daysNumber.includes(i.toString())).join(" , ")
   }
  } 

}
