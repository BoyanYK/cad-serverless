//Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

//My components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { LoginComponent } from './auth/login/login.component';
import { AuthModule } from './auth/auth.module'
import { AuthGuard } from './auth/auth.guard';
import { RoleGuardService } from './auth/role-guard.service';
import { UserComponent } from './user/user.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { ProjectsComponent, CreateProjectDialog } from './projects/projects.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectSearchPipe } from './projects/ProjectSearchPipe';
import { NotFoundComponent } from './not-found/not-found.component';

//Material
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule, MatInputModule, MatGridListModule, MatChipsModule, MatBadgeModule, MatDialogModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';


//Additional libraries
import { JwtModule } from '@auth0/angular-jwt';
import { NgMasonryGridModule } from 'ng-masonry-grid';

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
  ],
  entryComponents: [CreateProjectDialog],
  providers: [AuthGuard, RoleGuardService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})


export class AppModule { }
