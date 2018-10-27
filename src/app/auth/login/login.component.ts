import { Component, NgModule, OnInit } from '@angular/core';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../admin/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RoleGuardService } from '../role-guard.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/* @NgModule({
  exports: [
    FormGroup,
    FormControl
  ]
}) */

export class LoginComponent {
  message: string;
  route: string;
  rrouter: Router;

  constructor(public authService: AuthService, public router: Router, public http: HttpClient, public roleGuard: RoleGuardService) {
    this.setMessage();
    this.rrouter = router;
  }
  //public authService: AuthService;

  /* ngOnInit(){
    this.setMessage();
  } */

  setMessage() {
    this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
  }

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });



  updatePasswordForm = new FormGroup({
    newPassword: new FormControl('')
  });

  //username: string;
  //password: string;
  //newPassword: string;
  title = 'Project Management System';
  poolData = {
    UserPoolId: 'eu-west-2_3zeUtzVmY', // your user pool id here
    ClientId: '4a0daeapv6uc7n13nq4aud1kij' // your app client id here
  };
  userPool = new CognitoUserPool(this.poolData);
  userData = {
    Username: '',
    Pool: this.userPool
  };
  authenticationData = {
    Username: '',
    Password: ''
  };
  cognitoUser;
  authenticationDetails;

  //TODO get this out of here
  testApi() {
    var params = new HttpParams({ fromString: 'tableName=UserProfiles' });
    var response = this.http.get<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/getusers", { params });
    response.subscribe((data) => {
      data.forEach(element => {
        console.log(element);
      });
    });

    /* const req = this.http.post('https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/Create_User', {
      title: 'foo',
      body: 'bar',
      userId: 1
    })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      ); */
  }
  //TODO get above out of here

  onSubmit() {
    alert("Attempting to login");
    this.authenticationData.Username = this.loginForm.controls['username'].value,
      this.userData.Username = this.loginForm.controls['username'].value,
      this.authenticationData.Password = this.loginForm.controls['password'].value,
      this.authenticationDetails = new AuthenticationDetails(this.authenticationData);
    this.cognitoUser = new CognitoUser(this.userData);
    console.log(this.cognitoUser);
    console.log(this.authenticationDetails);
    this.login(this.cognitoUser, this.authenticationDetails);
    console.log("executed login");
    //nthis.redirect(this.route);
  }

  onUpdatePassword() {
    alert("Attempting to Change Password");
    this.cognitoUser.completeNewPasswordChallenge(this.updatePasswordForm.controls['newPassword'].value, { preferred_username: this.loginForm.controls['username'].value }, {
      onSuccess: function (result) {
        console.log('Successfully changed password');
      },
      authSuccess: function (result) {
        //Password has been updated.
        console.log('In the AuthSuccess.');
      },
      onFailure: function (err) {
        console.log(err);
      }
    });
  }

  onLogout() {
    alert("Logging out");
    this.cognitoUser.signOut();
  }

  login(cognitoUser, authenticationDetails): void {
    this.message = 'Trying to login...';
    let that = this;
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        var accessToken = result.getAccessToken().getJwtToken();
        console.log(accessToken);
        console.log("Logged in");
        localStorage.setItem('token', accessToken);
        //let redirect = this.authService.redirectUrl ? '/admin' : '/login';
        //alert("Succesfull Login!!");
        that.route = '../home';
        console.log("After navigate");
        that.redirect(that.route);
      },

      onFailure: function (err) {
        console.log(new Error().stack);
        that.route = '../error';
        //alert(err);
      },

      mfaRequired: function (codeDeliveryDetails) {
        var verificationCode = prompt('Please input verification code', '');
        cognitoUser.sendMFACode(verificationCode, this);
      },

      newPasswordRequired: function (userAttributes, requiredAttributes) {
        console.log("new pass required");
        //alert("New Password Required");
      }
    });
  }

  redirect(path: string) {
    //console.log(this.router.navigate([path]));
    this.roleGuard.updateUserType();
    this.router.navigate([path]);
  }

}
