import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
//TODO uncomment once layout is done
import { RoleGuardService } from '../auth/role-guard.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  profiles: Object[];

  constructor(private roleGuardService: RoleGuardService, private http: HttpClient) {
    var params = new HttpParams({ fromString: 'queryType=scan' });
    var query = {
      TableName: 'UserProfiles'
    };
    this.profiles = new Array();
    //TODO structure/interface UserProfile to use insead of <any>
    var response = this.http.post<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/FetchDynamo", query, { params: params });
    response.subscribe((data) => {
      data.forEach(element => {
        this.profiles.push({
          name: element.first_name + " " + element.last_name,
          email: element.email,
          skills: element.skills,
          description: element.description
        })
      });
    });
  }

  userType: string = '';

  ngOnInit() {
    //TODO uncomment once layout is done
    this.roleGuardService.userType.subscribe(value => this.userType = value);
  }

}
