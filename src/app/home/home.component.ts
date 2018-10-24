import { Component, OnInit } from '@angular/core';
import { RoleGuardService } from '../auth/role-guard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private roleGuardService: RoleGuardService) { }

  userType: string = '';

  ngOnInit(){
    this.roleGuardService.userType.subscribe(value => this.userType = value);
  }

}
