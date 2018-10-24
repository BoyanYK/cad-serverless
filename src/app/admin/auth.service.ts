import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay} from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public jwtHelper: JwtHelperService){}

  public isLoggedIn = false;

  public redirectUrl: string;

  public isAuthenticated(): boolean{
    const token = localStorage.getItem('token');

    return !this.jwtHelper.isTokenExpired(token);
  }

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val => this.isLoggedIn = true)
    );
  };

  logout(): void {
    this.isLoggedIn = false;
  }
}
