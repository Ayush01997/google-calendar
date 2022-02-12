import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-setup-calendar',
  templateUrl: './setup-calendar.component.html',
  styleUrls: ['./setup-calendar.component.css']
})
export class SetupCalendarComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    console.log("ok")
  }

  onSetupCalendar() {
    this.authService.getAuth()
  }

}
