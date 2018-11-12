import { Component, OnInit } from '@angular/core';
import { RoleGuardService } from '../auth/role-guard.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Profile } from '../user/user.component';

@Component({
  selector: 'app-home',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  private profiles: Profile[];
  private userQuery: string = '';
  private userType: string = '';

  /**
   * Init services
   * @param roleGuardService role guard service
   * @param http client for API requests
   */
  constructor(private roleGuardService: RoleGuardService, private http: HttpClient) {
    let params = new HttpParams()
      .set('queryType', 'getUsers');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    })
    this.profiles = [];
    var response = this.http.get<Profile[]>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/Prod/users", { headers: headers, params: params });
    response.subscribe((data) => {
      data.forEach(element => {
        try {
          this.profiles.push(element)
        }
        catch (Error) {
          //Do Nothing
        }
      });
    });

  }

  /**
   * get User Type
   */
  ngOnInit(): void {
    this.roleGuardService.userType.subscribe(value => this.userType = value);
  }
}
