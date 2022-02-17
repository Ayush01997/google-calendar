import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private data:any = {};
  constructor(private http: HttpClient) { }

  setData(data:any){
      this.data = data;
      console.log("data right now", this.data)
  }

  getData():any{
      return this.data;
  }

  setMyCalendar() {
    let setupCalendarUrl = "http://localhost:3000/setupCalendar";
    return this.http.post<any>(setupCalendarUrl, this.data)
  }

  getMyCalendar(id:any){
    let getCalendarUrl = `http://localhost:3000/getCalendar/${id}`;
    return this.http.post<any>(getCalendarUrl, {});
  }
}
