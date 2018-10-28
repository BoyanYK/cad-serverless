import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

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

  constructor(public http: HttpClient, public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  createNewUser(): void {

    //console.log(this.createUserForm);
    //console.log(this.createUserForm.controls['firstName'].value);
    //https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/Create_User
    /* "firstName": this.createUserForm.controls['firstName'].value,
      "lastName": this.createUserForm.controls['lastName'].value,
      "password": this.createUserForm.controls['password'].value,
      "role": this.createUserForm.controls['role'].value,
      "username": this.createUserForm.controls['username'].value, */

    /**
     * * Example for how authorisation header is passed for later when integrating with API Gateway Auth feature
     * const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
      };
     */
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    var params = new HttpParams()
      .set('firstName', this.createUserForm.controls['firstName'].value)
      .set('lastName', this.createUserForm.controls['lastName'].value)
      .set('password', this.createUserForm.controls['password'].value)
      .set('role', this.createUserForm.controls['role'].value)
      .set('username', this.createUserForm.controls['username'].value);
    const req = this.http.post('https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/Create_User', null, { headers: headers, params: params }).subscribe(
      res => {
        console.log(res);
        this.snackBar.open('User created successfully', 'Dismiss', { panelClass: ['snackbar-style-success'] });
      },
      err => {
        console.log("Error occured", err);
        this.snackBar.open('User creation failed', 'Dismiss', { panelClass: ['snackbar-style-fail'] });
      }
    );
  }

}
