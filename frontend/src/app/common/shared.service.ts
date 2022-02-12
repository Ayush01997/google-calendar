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
  }

  getData():any{
      return this.data;
  }

  setMyCalendar() {
    let setupCalendarUrl = "http://localhost:3000/setupCalendar";
    return this.http.post<any>(setupCalendarUrl, this.data)
  }
}
