import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../common/shared.service';
import { calculate_time_slot, formatAMPM } from '../../helper/index';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-view-calendar',
  templateUrl: './view-calendar.component.html',
  styleUrls: ['./view-calendar.component.css'],
})
export class ViewCalendarComponent implements OnInit {
  calendarData: any = {};
  availableTime: any = [];
  duration: any;
  email: any;
  selected: Date | null = new Date();
  isDataLoaded: boolean = false;
  error = '';

  constructor(
    private shared: SharedService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email');
    console.log(this.email)
    this.getCalendar();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  filterDates = (date: Date): boolean => {
    const day = date.getDay();

    /* Prevent Saturday and Sunday for select. */
    return day !== 0 && day !== 6;
  };

  onDateSelect() {
    //console.log(this.selected);
    let timeMin = moment(this.selected)
      .startOf('day')
      .format('YYYY-MM-DD[T]HH:mm:ssZ');
    let timeMax = moment(this.selected)
      .endOf('day')
      .format('YYYY-MM-DD[T]HH:mm:ssZ');
    let y = formatAMPM(new Date('2022-02-25T04:00:00Z'));
    console.log(y);
    let body = {
      id: this.email,
      timeMin: timeMin,
      timeMax: timeMax,
    };
    console.log(body);
    this.shared.getUsersSchedule(body).subscribe(
      (res) => {
        console.log();
        let slots = res[body['id']].busy;
        let array: any = [];
        slots.forEach((ele) => {
          array.push(formatAMPM(new Date(ele.start)));
        });
        //console.log(this.availableTime)
        //console.log(array)
        this.availableTime = this.availableTime.filter(
          (val) => !array.includes(val)
        );
        console.log(this.availableTime);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  onTimeSelect(time) {
    console.log(time);
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate([
          '/createEvent',
          { time: time, date: this.selected, duration: this.duration, location: this.calendarData.location },
        ]);
      }
    });
  }

  getCalendar() {
    this.shared.getMyCalendar(this.email).subscribe(
      (res) => {
        console.log(res);
        if(res.status){
        let data = res.data[0]
        this.calendarData = data
        console.log("calendat data: ", this.calendarData)
        this.shared.setData(data);
        localStorage.setItem('calendarId', this.email)
        this.isDataLoaded = true;
        const expirationDate = this.newExpirationDate();
        if (data.access_token && data.refresh_token) {
          this.storeTokenData(
            data.access_token,
            data.refresh_token,
            expirationDate
          );
        }
        this.duration = data.duration;
        this.availableTime = calculate_time_slot(
          data.startTime,
          data.endTime,
          parseInt(data.duration)
        );
        this.error = ''
      }else{
        this.error = res.message
      }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  newExpirationDate() {
    var expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    return expiration;
  }

  storeTokenData(token, refreshToken, expirationDate) {
    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem('expirationDate', expirationDate);
  }

  myFilter = (d: Date): boolean => {
    //console.log(d)
    let today = new Date();
    // if(d >= new Date()){
    //   console.log("sssssssssssssss")
    //   return true
    // }
    // if(d < today){
    //   return false
    // }

    const day = (d || new Date()).getDay();
    //console.log(day);
    // Prevent Saturday and Sunday from being selected.
    let days = this.calendarData.availableDays.split(',').map(Number);
    // console.log(days);
    // return true
    if (days.includes(day)) {
      return true;
    } else {
      return false;
    }
  };
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: '../dialog-material.html',
})
export class DialogContentExampleDialog {}
