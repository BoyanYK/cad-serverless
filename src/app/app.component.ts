import { Component } from '@angular/core';
import { RoleGuardService } from './auth/role-guard.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import decode from 'jwt-decode';

interface Notification {
  date: string,
  message: string,
  project_id: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private notifications: Object[];
  private path: string = '';
  private userType: string = '';
  /**
   * Constructor initializing services
   * @param roleGuardService Role Guard Service for keeping track of User Type
   * @param router Router to handle redirects
   * @param http Client to handle API requests
   */
  constructor(private roleGuardService: RoleGuardService, private router: Router, private location: Location, private http: HttpClient) {
    router.events.subscribe((val) => {
      this.path = this.location.path();
    });
    this.notifications = [];
    this.getNotifications();
  }

  /**
   * 
   */
  ngOnInit(): void {
    this.roleGuardService.userType.subscribe(value => this.userType = value);
  }

  /**
   * Logout method
   */
  onLogout(): void {
    localStorage.clear();
    this.roleGuardService.updateUserType();
  }

  /**
   * Handler to get notifications for the current user from the database
   */
  getNotifications(): void {
    try {
      var params = new HttpParams({ fromString: 'username=' + decode(localStorage.getItem('token'))["username"] });
      var response = this.http.get<Notification[]>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/notifications", {
        params, headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        })
      });
      response.subscribe((data) => {
        //Clear list of notifications before updating it
        try {
          this.notifications = [];
          data.forEach(notification => {
            this.notifications.push(notification)
          });
          this.notifications.forEach(a => console.log(a));
        } catch{ }
      });
    } catch (InvalidTokenSpecified) {
      //Do nothing
    }
  }

  /**
   * Open Project that has been clicked from notification, which also removes the notification for that project
   * @param notification Notification that has been clicked
   */
  openProject(notification): void {
    let index = this.notifications.indexOf(notification);
    this.notifications.splice(index, 1);
    this.http.request<any>("delete", "https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/notifications", {
      body: {
        username: decode(localStorage.getItem('token'))["username"],
        notifications: this.notifications
      }
    });
    this.router.navigate(['../project/' + notification.projectId]);
  }
}