import { Component } from '@angular/core';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { RoleGuardService } from './auth/role-guard.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import decode from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  path: string = '';
  notificationsCounter: number;
  notifications: Object[];
  constructor(private roleGuardService: RoleGuardService, private router: Router, private location: Location, private http: HttpClient) {
    router.events.subscribe((val) => {
      this.path = this.location.path();
    });
    this.notifications = [];
    this.notificationsCounter = null;
    this.getNotifications();
  }

  userType: string = '';

  ngOnInit() {
    //TODO uncomment once layout is done
    this.roleGuardService.userType.subscribe(value => this.userType = value);
  }

  onLogout() {
    console.log("Logging out");
    localStorage.clear();
    this.roleGuardService.updateUserType();
    //this.cognitoUser.signOut();
  }

  incrNots() {
    this.notificationsCounter++;
  }

  getNotifications() {
    try {
      var params = new HttpParams({ fromString: 'username=' + decode(localStorage.getItem('token'))["username"] });
      var response = this.http.get<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/notifications", {
        params, headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        })
      });
      response.subscribe((data) => {
        //Clear list of notifications before updating it
        try {
          this.notifications = [];
          this.notificationsCounter = data.Items[0].Notifications.length;
          data.Items[0].Notifications.forEach(notification => {
            this.notifications.push({
              message: notification.message,
              date: notification.date,
              projectId: notification.project_id
            })
          });
        } catch{ }
      });
    } catch (InvalidTokenSpecified) {
      //Do nothing
      console.log(InvalidTokenSpecified);
    }
  }

  openProject(notification) {
    var index = this.notifications.indexOf(notification);
    this.notifications.splice(index, 1);
    console.log(this.notifications);
    var response = this.http.request<any>("delete", "https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/notifications", {
      body: {
        username: decode(localStorage.getItem('token'))["username"],
        notifications: this.notifications
      }
    });
    console.log(response);
    response.subscribe(data => console.log(data));
    this.notificationsCounter--;
    this.router.navigate(['../project/' + notification.projectId]);
  }
  /* 
    //TODO refactor entire class, only cognito user is necessary
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
    } */
}