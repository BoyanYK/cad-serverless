import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
//TODO uncomment once layout is done
//import { RoleGuardService } from '../auth/role-guard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  profiles: Object[];

  constructor() {
    this.profiles = [
      {
        name: "This User",
        email: "example@mail.com",
        skills: ["This", "That", "Then", "There"],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a gravida massa, eget"
      },
      {
        name: "This User",
        email: "example@mail.com",
        skills: ["This", "That", "Then", "There"],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a gravida massa, eget"
      },
      {
        name: "This User",
        email: "example@mail.com",
        skills: ["This", "That", "Then", "There"],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a gravida massa, eget"
      },
      {
        name: "This User",
        email: "example@mail.com",
        skills: ["This", "That", "Then", "There"],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a gravida massa, eget"
      }
    ]
  }

  //TODO uncomment once layout is done
  //constructor(private roleGuardService: RoleGuardService) { }

  userType: string = '';

  ngOnInit(){
    //TODO uncomment once layout is done
    //this.roleGuardService.userType.subscribe(value => this.userType = value);
  }

}
