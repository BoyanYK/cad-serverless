import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public redirectUrl: string;
  private _isLoggedIn = false;
  constructor(public jwtHelper: JwtHelperService) { }


  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }


  /**
   * Gettter for if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');

    return !this.jwtHelper.isTokenExpired(token);
  }

  /**
   * Log in
   */
  login(): void {
    this._isLoggedIn = true;
  };

  /**
   * Logout
   */
  logout(): void {
    this._isLoggedIn = false;
  }
}
