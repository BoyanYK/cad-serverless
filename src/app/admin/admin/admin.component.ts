import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  createUserForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    username: new FormControl(),
    password: new FormControl(),
    role: new FormControl(),
  });

  constructor(public http: HttpClient) { }

  ngOnInit() {
  }

  createNewUser(): void {
    //https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/Create_User

    /**
     * * Example for how authorisation header is passed for later when integrating with API Gateway Auth feature
     * const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
      };
     */
    var params = new HttpParams()
      .set('firstName', this.createUserForm.controls['firstName'].value)
      .set('lastName', this.createUserForm.controls['lastName'].value)
      .set('username', this.createUserForm.controls['username'].value)
      .set('password', this.createUserForm.controls['password'].value)
      .set('role', this.createUserForm.controls['role'].value);
    const req = this.http.post('https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/Create_User', { params })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured", err);
        }
      );
  }

}
