import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../common/shared.service';

@Component({
  selector: 'app-validate-team-auth',
  templateUrl: './validate-team-auth.component.html',
  styleUrls: ['./validate-team-auth.component.css']
})
export class ValidateTeamAuthComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http : HttpClient, private shared : SharedService) { }

  ngOnInit(): void {
    console.log("second")
   const access_token = this.route.snapshot.queryParamMap.get('access_token');
   console.log("access_token")
   if(access_token){
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${access_token}`
    }
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    this.http.get<any>(`https://graph.microsoft.com/v1.0/me/calendar`,requestOptions).subscribe((res)=>{
      console.log(res)
      if(res.owner){
        let data = {"name" : res.owner.name , "email" : res.owner.address }
        localStorage.setItem("userDetail", JSON.stringify(data))
        this.router.navigate(['dashboard'])
      }else{
        this.router.navigate([''])
      }
    },(err) => {
      this.router.navigate(['/'])
    }) 
   }else{
    this.router.navigate([''])
   }
    
  }


}
