import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import decode from 'jwt-decode';

interface Profile {
  username;
  first_name;
  last_name;
  email;
  description;
  role;
  skills;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {



  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  private isSkillsEditable: boolean = false;
  private isDescEditable: boolean = false;
  private profile: Profile;
  // private profile = {
  //   TableName: "UserProfiles",
  //   Item: {
  //     "username": "",
  //     "first_name": "",
  //     "last_name": "",
  //     "email": "",
  //     "description": "",
  //     "role": "",
  //     "skills": [],
  //     //"Notifications": []
  //   }
  //}

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.profile = {} as Profile;
    this.getProfile();

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add the new skill
    if ((value || '').trim()) {
      this.profile.skills.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(skill: string): void {
    const index = this.profile.skills.indexOf(skill);

    if (index >= 0) {
      this.profile.skills.splice(index, 1);
    }
  }

  ngOnInit() {
  }

  toggleDescEdit(updateSkills: boolean) {
    if (updateSkills) {
      this.updateUserProfiles();
    }
    this.isDescEditable = !this.isDescEditable;
  }

  toggleSkillsEdit(updateSkills: boolean) {
    if (updateSkills) {
      this.updateUserProfiles();
    }
    this.isSkillsEditable = !this.isSkillsEditable;
  }

  updateUserProfiles() {
    this.http.put('https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/users', this.profile)
      .subscribe(
        res => {
          console.log(res);
          this.snackBar.open('Profile updated successfully', 'Dismiss', {
            panelClass: ['snackbar-style-success'],
            duration: 1500
          });
        },
        err => {
          console.log("Error occured", err);
          this.snackBar.open('Profile update failed', 'Dismiss', {
            panelClass: ['snackbar-style-fail'],
            duration: 1500
          });
        }
      );
  }

  getProfile() {
    //var params = new HttpParams({ fromString: 'queryType=getUser' });
    var params = new HttpParams()
      .set('queryType', 'getUser')
      .set('username', decode(localStorage.getItem('token'))["username"]);
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    })
    // console.log(decode(localStorage.getItem('token'))["username"]);
    // var query = {
    //   TableName: "UserProfiles",
    //   KeyConditionExpression: "username = :u",
    //   ExpressionAttributeValues: {
    //     ":u": decode(localStorage.getItem("token"))["username"]
    //   }
    // }

    this.http.get<Profile>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/users", { headers: headers, params: params })
      .subscribe((data) => {
        this.profile = data[0];
      });
  }
}
