import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public isEditable: boolean = false;

  profile = {
    firstName: 'Boyan',
    lastName: 'Kostadinov',
    username: 'BoyanYK',
    email: 'example@email.com',
    role: 'Administrator',
    skills: [
      "This", "That", "Then", "There", "Java", "Haskell"
    ]
  };

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

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.newItem.Item.skills.push(value.trim());
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


  toggleEdit(updateSkills: boolean) {
    if (updateSkills) {
      //TODO Get new json from chips and call updateUserProfiles
      this.updateUserProfiles();
    }
    this.isEditable = !this.isEditable;
  }

  updateUserProfiles() {
    this.http.post('https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/update-user-profiles', this.newItem)
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
}
