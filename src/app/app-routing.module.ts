import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { UserComponent } from './user/user.component';

const appRoutes: Routes = [
  // TODO Change below line to LoginComponent!!!
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] } //TODO uncomment after layout is done
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    CommonModule
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
