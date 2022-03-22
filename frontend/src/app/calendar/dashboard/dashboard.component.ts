import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/common/shared.service';
import { EditEventComponent } from './edit-event/edit-event.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  email_id;   // will get email id of logged in user.
  userName; 
  userCalendar: any[] = []

  constructor(
    private sharedService: SharedService,
    private router: Router,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {

    let userDetails = localStorage.getItem('userDetail')
    if(userDetails) {
      let data = JSON.parse(userDetails);
      this.email_id = data.email;
      this.userName = data.name;
    }

    this.sharedService.getMyCalendar(this.email_id).subscribe(data => {
      this.userCalendar = data.data
      console.log(this.userCalendar)
    }, error => console.log(error))
  }

  onCreateEvent() {
    this.router.navigate(['setAvailability'])
  }

  onEdit(eventDetails: any) {
    console.log(eventDetails)
    const dialogRef = this.dialog.open(EditEventComponent, {
      width: '600px',
      height: '600px',
      data: {eventDetails}
    });
  }

  onDelete(id:number, index: number) {
    this.sharedService.deleteEvent(id).subscribe(data=>{
      console.log(data)
      this.userCalendar.splice(index, 1);
    })
  }

}
