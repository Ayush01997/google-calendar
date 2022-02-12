import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../common/shared.service';

@Component({
  selector: 'app-validate-auth',
  templateUrl: './validate-auth.component.html',
  styleUrls: ['./validate-auth.component.css']
})
export class ValidateAuthComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http : HttpClient, private shared : SharedService) { }

  ngOnInit(): void {
    const access_token = this.route.snapshot.queryParamMap.get('access_token');
    console.log(access_token)
    this.http.post<any>(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${access_token}`,{}).subscribe((res)=>{
      console.log(res)
      if(res.user_id){
        this.shared.setData({"name" : res.name , "email" : res.email })
        this.router.navigate(['setAvailability'])
      }else{
        this.router.navigate(['setAvailability'])
      }
    },(err) => {
      this.router.navigate(['/'])
    })
  }

}
