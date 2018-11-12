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
  private message: string;
  private route: string;
  updatePassword: boolean = false;

  constructor(public authService: AuthService, public router: Router, public http: HttpClient, public roleGuard: RoleGuardService) {
    this.setMessage();
    console.log(authService.isLoggedIn);
    if (authService.isLoggedIn) {
      router.navigate(['/home']);
    }
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


  onSubmit() {
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
    let that = this;
    this.cognitoUser.completeNewPasswordChallenge(this.updatePasswordForm.controls['newPassword'].value, { preferred_username: this.loginForm.controls['username'].value }, {
      onSuccess: function (result) {
        console.log('Successfully changed password');
        that.updatePassword = false;
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
        let accessToken = result.getAccessToken().getJwtToken();
        console.log(accessToken);
        console.log("Logged in");
        localStorage.setItem('token', accessToken);
        //let redirect = this.authService.redirectUrl ? '/admin' : '/login';
        //alert("Succesfull Login!!");
        let route = '../home';
        console.log("After navigate");
        that.redirect(route);
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
        that.updatePassword = true;
        console.log(that.updatePassword);
        //alert("New Password Required");
      }
    });
  }

  redirect(path: string) {
    //console.log(this.router.navigate([path]));
    this.roleGuard.updateUserType();
    this.authService.login();
    this.router.navigate([path]);
  }

}
