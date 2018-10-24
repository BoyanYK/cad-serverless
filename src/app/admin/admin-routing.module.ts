import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';

import { RoleGuardService as RoleGuard } from '../auth/role-guard.service';

const routes: Routes = [
  {
    path: 'admin', component: AdminComponent, canActivate: [RoleGuard],
    data: { expectedRole: 'Administrator'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
