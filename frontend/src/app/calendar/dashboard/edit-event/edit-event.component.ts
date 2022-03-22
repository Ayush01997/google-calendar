import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/common/shared.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  eventDetails: any

  eventFrom: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {

    
    this.eventDetails = this.data.eventDetails
    console.log(this.eventDetails.email)

    // event form
    this.eventFrom = this.fb.group({
      id: [this.eventDetails.id],
      email: [this.eventDetails.email],
      eventName: [this.eventDetails.eventName],
      eventDescription: [this.eventDetails.eventDescription],
      duration: [this.eventDetails.duration],
      startTime: [this.eventDetails.startTime],
      endTime: [this.eventDetails.endTime],
    })
  }

  onEditForm() {
    console.log(this.eventFrom.value)
    let data = this.eventFrom.value;
    this.sharedService.updateEvent(data).subscribe(data=>{
      console.log(data)
      this.dialogRef.close();
    },(err) => {
      console.log(err)
    })
  }

}
