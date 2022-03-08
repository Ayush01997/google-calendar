import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { SharedService } from 'src/app/common/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  date
  duration;
  eventStartDateTime;
  eventEndDateTime;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private shared : SharedService, private router: Router) { }

  ngOnInit(): void {
    this.getEventTime()
  }


  onSubmit(setupEvent) {
   
    let body = {
      'summary' : setupEvent.value.eventName,
      'description': setupEvent.value.eventDescription, 
      start : {
        dateTime : this.eventStartDateTime,
        'timeZone': 'Asia/Kolkata',
      },
      'end': {
        'dateTime': this.eventEndDateTime,
        'timeZone': 'Asia/Kolkata',
      },
      'attendees': [
        {'email': setupEvent.value.email}
      ],
    }
    console.log(this.shared.getData())
    
    this.shared.createEvent(body).subscribe(res => {
      console.log(res)
      this.createDialog({...body, location : setupEvent.value.location})  
    },(err) => {
      console.log(err)
    })
  }

  createDialog(data){
    let startTime = moment(data.start.dateTime).format("hh:mm a")
    let endTime = moment(data.end.dateTime).format("hh:mm a")
    let day = moment(data.end.dateTime).format("dddd, MMMM Do YYYY")
    console.log(startTime, endTime ,day)
    let sharedData = this.shared.getData()
    let body = {
      summary : data.summary,
      description : data.description,
      name : sharedData.name,
      location : data.location,
      time : `${startTime} - ${endTime} ${day}`
    }
    this.openDialog(body)
  }

  openDialog(data : any) {
    const dialogRef = this.dialog.open(EventDialogComponent,{
      width      : '100%',
      maxWidth   : '600px',
      height     : 'auto',
      hasBackdrop: true,
      maxHeight  : '700px',
      panelClass : 'app-event-dialog',
      data : data
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(["/viewCalendar"])
    });
  }

  getEventTime() {
    let time = this.route.snapshot.paramMap.get('time');
    let date:any = this.route.snapshot.paramMap.get('date');
    console.log('date', date)
    this.duration = this.route.snapshot.paramMap.get('duration');
    let dateRes = moment(date).format('YYYY-MM-DD')
    console.log('dateres', dateRes)
    let timeRes =  new Date(dateRes+" "+time)
    this.eventStartDateTime = moment(timeRes, 'yyyy-MM-ddThh:mm:ssZ')
    this.eventEndDateTime = moment(this.eventStartDateTime, 'YYYY-MM-DD[T]HH:mm:ss').add(this.duration,'minutes').format('YYYY-MM-DD[T]HH:mm:ssZ')

    console.log("start< " , this.eventEndDateTime)

  }

}

// @Component({
//   selector: 'event-dialog',
//   templateUrl: '../event-dialog.html',
// })
// export class EventDialog {}