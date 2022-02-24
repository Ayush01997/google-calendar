import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { SharedService } from 'src/app/common/shared.service';

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

  constructor(private route: ActivatedRoute, private datePipe: DatePipe, private shared : SharedService) { }

  ngOnInit(): void {
    this.getEventTime()
  }


  onSubmit(setupEvent) {
    console.log()
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
    this.shared.createEvent(body).subscribe(res => {
      console.log(res)
    })
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
