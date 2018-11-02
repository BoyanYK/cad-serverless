import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule, MatInputModule, MatGridListModule, MatChipsModule, MatBadgeModule, MatDialogModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthModule } from './auth/auth.module'
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './auth/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { RoleGuardService } from './auth/role-guard.service';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from '@angular/material/card';
import { UserComponent } from './user/user.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { NgMasonryGridModule } from 'ng-masonry-grid';
import { ProjectsComponent, CreateProjectDialog } from './projects/projects.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    UserComponent,
    ProfilesComponent,
    ProjectsComponent,
    CreateProjectDialog
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
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatGridListModule,
    FlexLayoutModule,
    MatCardModule,
    MatChipsModule,
    NgMasonryGridModule,
    MatBadgeModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200'],
      }
    }),
    HttpClientModule
    //LoginComponent
  ],
  entryComponents: [CreateProjectDialog],
  providers: [AuthGuard, RoleGuardService],
  bootstrap: [AppComponent]
})


export class AppModule { }
