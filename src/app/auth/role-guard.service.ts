import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../admin/auth.service';
import decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class RoleGuardService implements CanActivate{
  getUserType() {
    // Get JWT token, decode it, extract groups array, get first item 
    return decode(localStorage.getItem('token'))['cognito:groups'][0];
  }
  userType: BehaviorSubject<string> = new BehaviorSubject<string>(this.getUserType());

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean{
    const expectedRole = route.data.expectedRole;

    const token = localStorage.getItem('token');

    const tokenPayload = decode(token);

    if (!this.auth.isAuthenticated() || tokenPayload['cognito:groups'][0] !== expectedRole)
    {
      this.router.navigate(['../login']);
      return false;
    }
    this.userType.next("test");
    return true;
  }

  
}
