import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../common/shared.service';
import { calculate_time_slot } from '../../helper/index';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-calendar',
  templateUrl: './view-calendar.component.html',
  styleUrls: ['./view-calendar.component.css'],
})
export class ViewCalendarComponent implements OnInit {
  calendarData: any = {};
  availableTime: any = [];
  duration: any;
  selected: Date | null = new Date();
  isDataLoaded: boolean = false;

  constructor(private shared: SharedService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
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
    console.log(this.selected);
  }
  onTimeSelect(time) {
    console.log(time);
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.router.navigate(["/createEvent", {time: time, date: this.selected,duration: this.duration}])
      }
    });
  }

  getCalendar() {
    this.shared.getMyCalendar(8).subscribe((res) => {
      console.log(res);
      this.calendarData = res;
      this.isDataLoaded = true;
      this.duration = res.duration;
      this.availableTime = calculate_time_slot(
        res.startTime,
        res.endTime,
        parseInt(res.duration)
      );
    });
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    //console.log(day);
    // Prevent Saturday and Sunday from being selected.
    let days = this.calendarData.availableDays.split(',').map(Number);
    console.log(days);
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
