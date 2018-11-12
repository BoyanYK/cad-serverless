import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import decode from 'jwt-decode';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ProjectData } from '../projects/projects.component';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  private project: ProjectData;
  private developers = [];
  private temp: string;
  private user: string;
  private statusSelect = new FormControl();
  private devSelect = new FormControl();
  private changeStatus = false;
  private taskNumber: number;
  private detailsEditable = true;
  /**
   * Init services
   * @param route Get project id from route
   * @param http client for API requests
   * @param snackBar for visualizing API responses
   */
  constructor(private route: ActivatedRoute, private http: HttpClient, public snackBar: MatSnackBar) { }

  /**
   * Startup actions
   */
  ngOnInit(): void {
    this.getProjectInformation(this.route.snapshot.paramMap.get('project_id'));
    this.user = decode(localStorage.getItem('token'))['username'];
    this.project = {} as ProjectData;
    console.log(this.user);
  }

  /**
   * Change state
   * If updateProject, generate request and call project update
   * @param updateProject whether to push update to database
   */
  toggleDetailsEdit(updateProject: boolean): void {
    if (updateProject)
    //TODO this is ready to push to database
    {
      if (this.devSelect.value === null) {
        alert("You must select at least one developer");
        return;
      }
      if (this.project['developers'] === undefined) this.project['developers'] = [];
      this.project['developers'].push(...this.devSelect.value);
      this.project['status'] = this.statusSelect.value;
      this.notifyDevelopers(this.devSelect.value, this.project['uniqueProjID'], this.project['name']);
      this.updateProject();
    }
    this.updateDevelopers();
    this.detailsEditable = !this.detailsEditable;
    this.devSelect.reset();
  }

  /**
   * Notify developers they've been added to a project
   * @param developers list of developers to notify
   * @param projectId project ID
   * @param projectName project name
   */
  notifyDevelopers(developers: string[], projectId: string, projectName: string): void {
    let response = this.http.post("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/notifications", {
      usernames: developers,
      notification: {
        date: Date.now(),
        message: "You have been added to project " + projectName,
        project_id: projectId
      }
    }, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        })
      });
    response.subscribe(data => { }, err => { });
  }

  /**
   * Push project updates to database
   */
  updateProject(): void {
    this.http.put('https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/projects', this.project,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        })
      })
      .subscribe(
        res => {
          console.log(res);
          this.snackBar.open('Profile updated successfully', 'Dismiss', { panelClass: ['snackbar-style-success'] });
        },
        err => {
          console.log("Error occured", err);
          this.snackBar.open('Profile update failed', 'Dismiss', { panelClass: ['snackbar-style-fail'] });
        }
      );
  }

  /*
  * This is for when Tasks are implemented in Database/API
  editStatus(id: number, submit: boolean, task): void {
    if (submit) {
      console.log(this.statusSelect.value);
      task.status = this.statusSelect.value;
    } else {
      this.taskNumber = -1;
    }
    this.taskNumber = id;
    this.changeStatus = !this.changeStatus;
  }
  */

  /**
   * Update list of developers
   */
  updateDevelopers(): void {
    let params = new HttpParams()
      .set('queryType', 'getDevelopers')
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    })

    this.http.get<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/users", { headers: headers, params: params })
      .subscribe((data) => {
        console.log(data);
        this.developers = []; //Clear list to avoid duplication
        data.forEach(profile => {
          this.developers.push({
            value: profile.username,
            viewValue: profile.first_name + " " + profile.last_name,
          })
        });
      });
  }

  /**
   * Fetch project information
   * @param project_id Project id
   */
  getProjectInformation(project_id: string): void {
    //TODO fetch from dynamo
    let params = new HttpParams()
      .set('queryType', 'getProject')
      .set('projectId', project_id);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    })
    var response = this.http.get<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/projects", { headers: headers, params: params });
    response.subscribe((data) => {
      this.project = data[0];
    });
  }

}
