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
      "username": "DifferentPerson",
      "first_name": "Different",
      "last_name": "Person",
      "email": "example@email.com",
      "description": "Some Lorem ipsumd asd sad as das da dolor sit amet, consectetur adipiscing elit. Curabitur a gravida massa, eget",
      "role": "Administrator",
      "skills": ["This", "That", "Then", "There", "Java", "Haskell"],
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
