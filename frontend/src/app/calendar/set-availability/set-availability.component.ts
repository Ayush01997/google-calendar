import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import  {SharedService} from '../../common/shared.service'

@Component({
  selector: 'app-set-availability',
  templateUrl: './set-availability.component.html',
  styleUrls: ['./set-availability.component.css']
})
export class SetAvailabilityComponent implements OnInit {
  startTime: string
  endTime: string
  sharedData : any = {}
  time: any;
  time2: any;

  duration : string = ''

  constructor(private shared : SharedService, private router: Router) { }

  ngOnInit(): void {
    this.sharedData = this.shared.getData()
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
    //console.log(formData.value)
    console.log(this.duration)
    let obj = formData.value;
    let weekDays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
    let keys = Object.keys(obj);
    let filtered = keys.filter(k =>{ return obj[k] })
    let days = filtered.map((day)=> { return weekDays.indexOf(day)})
    console.log(this.startTime)
    console.log(this.endTime)
    console.log(days)
    let data = {
      "startTime" : this.startTime,
      "endTime" : this.endTime,
      "duration" : this.duration,
      "availableDays" : days.join() 
    }
    this.shared.setData({...this.sharedData, ... data})
    this.router.navigate(['/setup-event'])
  }

}
