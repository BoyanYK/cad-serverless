import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatChipInputEvent } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';


export interface ProjectData {
  manager: string;
  team_size: number;
  skills_needed: string[];
  members: string[];
  description: string;
  tasks: Task[]
}

export interface Dev {
  value: string;
  viewValue: string;
}

export interface Task {
  name: string;
  date_assigned: number;
  date_due: number;
  description: string;
  assignee: string; //username
  status: string; //pending, in-progress or done
  //? Maybe will do later, if time permits? comments: Comment[] 
}
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Object[]; //TODO extract Senior Devs with first/last name + username, to use in project creation
  constructor(public dialog: MatDialog, public http: HttpClient) {
    console.log("Hello from projects");
    let a: Task = {
      name: "Task",
      date_assigned: Date.now(),
      date_due: Date.now(),
      description: "Pls",
      assignee: "Boyan",
      status: "done"
    }

    var params = new HttpParams({ fromString: 'queryType=scan' });
    var query = {
      TableName: 'Projects'
    };
    this.projects = new Array();
    //TODO structure/interface UserProfile to use insead of <any>
    var response = this.http.post<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/FetchDynamo", query, { params: params });
    response.subscribe((data) => {
      data.forEach(element => {
        this.projects.push({
          name: element.project_name,
          manager: element.project_manager,
          skills: element.skills,
          team_size: element.team_size,
          description: element.description
        })
      });
    });
  }

  getProjects(): void {

  }

  ngOnInit() {
  }

  openNewProjectDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      seniorDevs: [
        { value: "porreq", viewValue: "porreq" },
        { value: "Dev2", viewValue: "Dev2" },
        { value: "Dev3", viewValue: "Dev3" }
      ]
    };

    this.dialog.open(CreateProjectDialog, dialogConfig);
  }
}

@Component({
  selector: 'create-project-dialog',
  styleUrls: ['create-project-dialog.css'],
  templateUrl: 'create-project-dialog.html',
})
export class CreateProjectDialog {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  seniorDevs: Object[];
  project = new FormGroup({
    name: new FormControl(),
    manager: new FormControl(),
    skills: new FormControl(),
    teamSize: new FormControl(),
    description: new FormControl()
  });
  skills = [];
  constructor(public http: HttpClient, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateProjectDialog>,
    @Inject(MAT_DIALOG_DATA) data/* , public seniorDevs: Dev[] */) {
    this.seniorDevs = data.seniorDevs;
    /* this.seniorDevs = [
      { value: "Dev1", viewValue: "Dev1" },
      { value: "Dev2", viewValue: "Dev2" },
      { value: "Dev3", viewValue: "Dev3" }
    ]; */

  }

  add(event: MatChipInputEvent): void {
    console.log(event.value);
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {
      this.skills.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(skill: string): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  submit(): void {

    var tableUpdate = {
      TableName: 'Projects',
      Item: {
        project_name: this.project.controls['name'].value,
        project_manager: this.project.controls['manager'].value,
        skills: this.skills,
        team_size: this.project.controls['teamSize'].value,
        description: this.project.controls['description'].value
      }
    }
    console.log(tableUpdate);
    postToDynamo(this.http, tableUpdate, this.snackBar, "Project created successfully", "Project creation failed");


    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}

function postToDynamo(http, query, snack, success, fail) {
  console.log(query);
  http.post('https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/update-user-profiles', query)
    .subscribe(
      res => {
        console.log(res);
        snack.open(success, 'Dismiss', { panelClass: ['snackbar-style-success'] });
      },
      err => {
        console.log("Error occured", err);
        snack.open(fail, 'Dismiss', { panelClass: ['snackbar-style-fail'] });
      }
    );
}