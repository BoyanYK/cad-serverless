import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import decode from 'jwt-decode';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  project = new Object;
  developers = [];
  temp: string;
  user: string;
  statusSelect = new FormControl();
  devSelect = new FormControl();
  changeStatus = false;
  taskNumber: number;
  detailsEditable = true;
  constructor(private route: ActivatedRoute, private http: HttpClient, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getProjectInformation(this.route.snapshot.paramMap.get('project_id'));
    this.user = decode(localStorage.getItem('token'))['username'];
    console.log(this.user);
  }

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
    console.log(this.devSelect.value);
    this.detailsEditable = !this.detailsEditable;
    this.devSelect.reset();
  }

  notifyDevelopers(developers: string[], projectId: string, projectName: string): void {
    var response = this.http.post("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/notifications", {
      usernames: developers,
      notification: {
        date: Date.now(),
        message: "You have been added to project " + projectName,
        project_id: projectId
      }
    });
    console.log(response);
    response.subscribe(data => console.log(data));
  }

  updateProject(): void {
    // TODO currently adding a developer overwrites old ones!
    // * seems to be done now ^
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

  updateDevelopers(): void {
    // var params = new HttpParams({ fromString: 'queryType=scan' });
    // var query = {
    //   TableName: 'UserProfiles',
    //   FilterExpression: "#rl = :r",
    //   ExpressionAttributeNames: {
    //     "#rl": "role"
    //   },
    //   ExpressionAttributeValues: {
    //     ":r": "Developer"
    //   }
    // };
    var params = new HttpParams()
      .set('queryType', 'getDevelopers')
    var headers = new HttpHeaders({
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

  getProjectInformation(project_id: string): void {
    //TODO fetch from dynamo
    var params = new HttpParams()
      .set('queryType', 'getProject')
      .set('projectId', project_id);
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    })
    var response = this.http.get<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/projects", { headers: headers, params: params });
    response.subscribe((data) => {
      data.forEach(element => {
        this.project = {
          uniqueProjID: element['uniqueProjID'],
          name: element['name'],
          manager: element['manager'],
          skills: element.skills,
          description: element.description,
          status: element.status,
          developers: element.developers,
          tasks: [
            {
              name: "Task 1",
              date_assigned: "15.02.2016",
              date_due: "31.01.2017",
              assignee: "Dev B",
              status: "In progress"
            },
            {
              name: "Task 2",
              date_assigned: "15.02.2016",
              date_due: "31.01.2017",
              assignee: "New_User",
              status: "Done"
            },
            {
              name: "Task 1",
              date_assigned: "15.02.2016",
              date_due: "31.01.2017",
              assignee: "Dev B",
              status: "In progress"
            },
            {
              name: "Task 2",
              date_assigned: "15.02.2016",
              date_due: "31.01.2017",
              assignee: "New_User",
              status: "Done"
            }]
        };
      });
    });
  }

}
