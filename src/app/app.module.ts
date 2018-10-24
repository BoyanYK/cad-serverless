import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule, MatInputModule} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthModule } from './auth/auth.module'
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './auth/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { RoleGuardService } from './auth/role-guard.service';


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AdminModule,
    AuthModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200'],
      }
    }),
    HttpClientModule
    //LoginComponent
  ],
  providers: [AuthGuard, RoleGuardService],
  bootstrap: [AppComponent]
})


export class AppModule { }
