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
export class LoginComponent {
  private message: string;
  private route: string;
  private updatePassword: boolean = false;
  private readonly title = 'Project Management System';
  private readonly poolData = {
    UserPoolId: 'eu-west-2_3zeUtzVmY', // your user pool id here
    ClientId: '4a0daeapv6uc7n13nq4aud1kij' // your app client id here
  };
  private userPool = new CognitoUserPool(this.poolData);
  private userData = {
    Username: '',
    Pool: this.userPool
  };
  private authenticationData = {
    Username: '',
    Password: ''
  };
  private cognitoUser;
  private authenticationDetails;
  private loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });
  private updatePasswordForm = new FormGroup({
    newPassword: new FormControl('')
  });

  /**
   * Init services
   * @param authService for authentication
   * @param router for nagivation
   * @param http for API requests
   * @param roleGuard for permissions
   */
  constructor(public authService: AuthService, public router: Router, public http: HttpClient, public roleGuard: RoleGuardService) {
    this.setMessage();
    console.log(authService.isLoggedIn);
    if (authService.isLoggedIn) {
      router.navigate(['/home']);
    }
  }

  /**
   * Set auth message
   */
  setMessage() {
    this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
  }

  /**
   * On login attempt
   */
  onSubmit() {
    this.authenticationData.Username = this.loginForm.controls['username'].value,
      this.userData.Username = this.loginForm.controls['username'].value,
      this.authenticationData.Password = this.loginForm.controls['password'].value,
      this.authenticationDetails = new AuthenticationDetails(this.authenticationData);
    this.cognitoUser = new CognitoUser(this.userData);
    this.login(this.cognitoUser, this.authenticationDetails);
  }

  /**
   * On Cognito responding to update password
   */
  onUpdatePassword() {
    let that = this;
    this.cognitoUser.completeNewPasswordChallenge(this.updatePasswordForm.controls['newPassword'].value, { preferred_username: this.loginForm.controls['username'].value }, {
      onSuccess: function (result) {
        that.updatePassword = false;
      },
      authSuccess: function (result) {
        //Password has been updated.
      },
      onFailure: function (err) {
        //console.log(err);
      }
    });
  }

  /**
   * From Cognito documentation, login function
   * @param cognitoUser cognito user reference
   * @param authenticationDetails Form details
   */
  login(cognitoUser, authenticationDetails): void {
    this.message = 'Trying to login...';
    let that = this;
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        let accessToken = result.getAccessToken().getJwtToken();
        localStorage.setItem('token', accessToken);
        let route = '../home';
        that.redirect(route);
      },

      onFailure: function (err) {
        //console.log(new Error().stack);
        that.route = '../error';
      },

      mfaRequired: function (codeDeliveryDetails) {
        var verificationCode = prompt('Please input verification code', '');
        cognitoUser.sendMFACode(verificationCode, this);
      },

      newPasswordRequired: function (userAttributes, requiredAttributes) {
        alert("new pass required");
        that.updatePassword = true;
      }
    });
  }

  /**
   * Redirect after login
   * @param path Path to rediurect to
   */
  redirect(path: string) {
    //console.log(this.router.navigate([path]));
    this.roleGuard.updateUserType();
    this.authService.login();
    this.router.navigate([path]);
  }

}
