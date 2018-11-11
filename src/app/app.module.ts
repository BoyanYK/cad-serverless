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
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { MatMenuModule } from '@angular/material/menu';
import { ProjectSearchPipe } from './projects/ProjectSearchPipe';
import { NotFoundComponent } from './not-found/not-found.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    ProfilesComponent,
    ProjectsComponent,
    CreateProjectDialog,
    ProjectDetailsComponent,
    ProjectSearchPipe,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    AdminModule,
    AppRoutingModule,
    ReactiveFormsModule,
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
    MatMenuModule,
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
