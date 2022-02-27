import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/common/shared.service';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';

@Component({
  selector: 'app-setup-event',
  templateUrl: './setup-event.component.html',
  styleUrls: ['./setup-event.component.css']
})
export class SetupEventComponent implements OnInit {
  sharedData: any = {};

  constructor(private shared : SharedService, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.sharedData = this.shared.getData()
  }

  onSubmit(formData) {
    //console.log(formData.value)
    console.log({...this.sharedData,...formData.value})
    let storageData = localStorage.getItem('userDetail')?JSON.parse(localStorage.getItem('userDetail')):null
    console.log(storageData)
    this.shared.setData({...this.sharedData,...formData.value,...storageData})
   
    this.shared.setMyCalendar().subscribe((data)=> {
      let result = this.shared.getData()
        this.openDialog(result)
    }, (err) => {
      console.log(err)
    })
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
      console.log("wwww")
      this.router.navigate(["/setAvailability"])
    });
  }


}
