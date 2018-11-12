import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import decode from 'jwt-decode';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  private isSkillsEditable: boolean = false;
  private isDescEditable: boolean = false;

  private profile = {
    TableName: "UserProfiles",
    Item: {
      "username": "",
      "first_name": "",
      "last_name": "",
      "email": "",
      "description": "",
      "role": "",
      "skills": [],
      //"Notifications": []
    }
  }

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.getProfile();

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add the new skill
    if ((value || '').trim()) {
      this.profile.Item.skills.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(skill: string): void {
    const index = this.profile.Item.skills.indexOf(skill);

    if (index >= 0) {
      this.profile.Item.skills.splice(index, 1);
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
    this.http.post('https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/update-user-profiles', this.profile)
      .subscribe(
        res => {
          console.log(res);
          this.snackBar.open('Profile updated successfully', 'Dismiss', { panelClass: ['snackbar-style-success'] });
        },
        err => {
          console.log("Error occured", err);
          this.snackBar.open('Profile update failed', 'Dismiss', { panelClass: ['snackbar-style-fail'] });
        }
      );
  }

  getProfile() {
    var params = new HttpParams({ fromString: 'queryType=query' });
    console.log(decode(localStorage.getItem('token'))["username"]);
    var query = {
      TableName: "UserProfiles",
      KeyConditionExpression: "username = :u",
      ExpressionAttributeValues: {
        ":u": decode(localStorage.getItem("token"))["username"]
      }
    }

    this.http.post<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/FetchDynamo", query, { params: params })
      .subscribe((data) => {
        this.profile.Item.username = data[0]["username"];
        this.profile.Item.first_name = data[0]["first_name"];
        this.profile.Item.last_name = data[0]["last_name"];
        this.profile.Item.email = data[0]["email"];
        this.profile.Item.description = data[0]["description"];
        this.profile.Item.role = data[0]["role"];
        this.profile.Item.skills = data[0]["skills"];
      });

    /* var params = new HttpParams({ fromString: 'tableName=UserProfiles' });
    this.profiles = new Array();
    var response = this.http.get<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/getusers", { params });
    response.subscribe((data) => {
      data.forEach(element => {
        this.profiles.push({
          name: element.first_name + " " + element.last_name,
          email: element.email,
          skills: element.skills,
          description: element.description
        })
      });
    }); */
  }
}
