import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../admin/auth.service';
import decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class RoleGuardService implements CanActivate {
  getUserType() {
    // Get JWT token, decode it, extract groups array, get first item 
    try {
      return decode(localStorage.getItem('token'))['cognito:groups'][0];
    } catch{
      return "";
    }
  }
  userType: BehaviorSubject<string> = new BehaviorSubject<string>(this.getUserType());

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    try {
      const expectedRole = route.data.expectedRole;

      const token = localStorage.getItem('token');

      const tokenPayload = decode(token);

      if (!this.auth.isAuthenticated() || tokenPayload['cognito:groups'][0] !== expectedRole) {
        this.router.navigate(['../home']);
        return false;
      }
      return true;
    } catch{
      this.router.navigate(['../home']);
      return false;
    }
  }

  updateUserType(): void {
    this.userType.next(this.getUserType());
  }


}
