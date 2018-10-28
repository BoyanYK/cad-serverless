import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  newItem = {
    TableName: "UserProfiles",
    Item: {
      "username": "SampleuserProfileFromFrontend",
      "first_name": "Test",
      "last_name": "User",
      "email": "example@email.com",
      "description": "Some Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a gravida massa, eget",
      "role": "Administrator",
      "skills": ["This", "That", "Then", "There"],
      "Notifications": [{
        "Date": "Date",
        "Message": "Message",
        "Link": "Link_To_Page"
      },
      {
        "Date": "Date",
        "Message": "Message",
        "Link": "Link_To_Page"
      }
      ]
    }
  }

  constructor(private http: HttpClient, public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  updateUserProfiles() {
    const req = this.http.post('https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/update-user-profiles', this.newItem)
      .subscribe(
        res => {
          console.log(res);
          this.snackBar.open('Profile update successfully', 'Dismiss', { panelClass: ['snackbar-style-success'] });
        },
        err => {
          console.log("Error occured", err);
          this.snackBar.open('Profile update failed', 'Dismiss', { panelClass: ['snackbar-style-fail'] });
        }
      );
  }

}
