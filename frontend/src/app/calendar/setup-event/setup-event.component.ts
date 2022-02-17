import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/common/shared.service';

@Component({
  selector: 'app-setup-event',
  templateUrl: './setup-event.component.html',
  styleUrls: ['./setup-event.component.css']
})
export class SetupEventComponent implements OnInit {
  sharedData: any = {};

  constructor(private shared : SharedService) { }

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
      console.log(data)
    }, (err) => {
      console.log(err)
    })
  }

}
