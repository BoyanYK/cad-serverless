import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../admin/auth.service';
import decode from 'jwt-decode';

@Injectable()

export class RoleGuardService implements CanActivate{

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
    return true;
  }
}
