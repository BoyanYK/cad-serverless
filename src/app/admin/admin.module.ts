import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule, MatInputModule, MatGridListModule, MatCardModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MatCardModule
  ],
  declarations: [
    AdminComponent,
    //LoginComponent
  ]
})
export class AdminModule { }
