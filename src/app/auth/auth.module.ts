import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent }    from './login/login.component';
import { AdminRoutingModule } from '../admin/admin-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  declarations: [
    //LoginComponent
  ]
})
export class AuthModule { }
