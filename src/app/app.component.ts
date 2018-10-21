import { Component } from '@angular/core';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  username: string;
  password: string;
  newPassword: string;
  title = 'Project Management System';
  poolData = {
    UserPoolId: 'eu-west-2_3zeUtzVmY', // your user pool id here
    ClientId: '4a0daeapv6uc7n13nq4aud1kij' // your app client id here
  };
  userPool = new CognitoUserPool(this.poolData);
  userData = {
    Username: '', // your username here
    Pool: this.userPool
  };
  authenticationData = {
    Username: '',
    Password: ''
  };
  cognitoUser;
  authenticationDetails;
  

  onSubmit() {
    alert("Attempting to login");
    this.authenticationData.Username = this.username;
    this.userData.Username = this.username;
    this.authenticationData.Password = this.password;
    this.authenticationDetails = new AuthenticationDetails(this.authenticationData);
    this.cognitoUser = new CognitoUser(this.userData);
    console.log(this.cognitoUser);
    console.log(this.authenticationDetails);
    this.login(this.cognitoUser, this.authenticationDetails);
    console.log("executed login");
  }

  onUpdatePassword() {
    alert("Attempting to Change Password");
    this.cognitoUser.completeNewPasswordChallenge(this.newPassword, {preferred_username: 'TestUser'}, {
      onSuccess: function (result){
        console.log('In the onSuccess.');
      },
      authSuccess: function (result){
        //Password has been updated.
        console.log('In the AuthSuccess.');
      },
      onFailure: function(err) {
        console.log(err);
      }
    });
  }

  onLogout() {
    alert("Logging out");
    this.cognitoUser.signOut();
  }

  login(cognitoUser, authenticationDetails): void {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        var accessToken = result.getAccessToken().getJwtToken();
        console.log(accessToken);
        //alert("Succesfull Login!!");
      },

      onFailure: function (err) {
        console.log(err);
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
}