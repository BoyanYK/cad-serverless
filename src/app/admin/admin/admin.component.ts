import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';


export interface Role {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})



export class AdminComponent {
    public roles: Role[];

    createUserForm = new FormGroup({
        firstName: new FormControl(),
        lastName: new FormControl(),
        username: new FormControl(),
        password: new FormControl(),
        role: new FormControl(),
    });

    /**
     * Init services
     * @param http client for API requests
     * @param snackBar for API response vizualization
     */
    constructor(public http: HttpClient, public snackBar: MatSnackBar) {
        this.roles = [
            { value: 'Administrator', viewValue: "Administrator" },
            { value: 'Senior_Developer', viewValue: "Senior Developer" },
            { value: 'Developer', viewValue: "Developer" }
        ];
    }

    /**
     * Create a request to API Gateway to create a new user
     */
    createNewUser(): void {
        var headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', localStorage.getItem('token'));
        var params = new HttpParams()
            .set('firstName', this.createUserForm.controls['firstName'].value)
            .set('lastName', this.createUserForm.controls['lastName'].value)
            .set('password', this.createUserForm.controls['password'].value)
            .set('role', this.createUserForm.controls['role'].value)
            .set('username', this.createUserForm.controls['username'].value)
            .set('email', this.createUserForm.controls['username'].value + "@cad-cw-aws.com");
        //console.log(params);
        const req = this.http.post('https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/Prod/Create_User', null, { headers: headers, params: params }).subscribe(
            res => {
                //console.log(res);
                this.snackBar.open('User created successfully', 'Dismiss', { panelClass: ['snackbar-style-success'] });
            },
            err => {
                //console.log("Error occured", err);
                this.snackBar.open('User creation failed', 'Dismiss', { panelClass: ['snackbar-style-fail'] });
            }
        );
    }

}
