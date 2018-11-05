import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatChipInputEvent } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';


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
  constructor(public dialog: MatDialog) {
    console.log("Hello from projects");
    let a: Task = {
      name: "Task",
      date_assigned: Date.now(),
      date_due: Date.now(),
      description: "Pls",
      assignee: "Boyan",
      status: "done"
    }

    console.log(a);
  }

  ngOnInit() {
  }

  openNewProjectDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      id: 1,
      title: 'Angular For Beginners',
      seniorDevs: [
        { value: "Dev1", viewValue: "Dev1" },
        { value: "Dev2", viewValue: "Dev2" },
        { value: "Dev3", viewValue: "Dev3" }
      ]
    };

    this.dialog.open(CreateProjectDialog, dialogConfig);

    /* const dialogRef = this.dialog.open(CreateProjectDialog, {
      width: '250px',
      project: {a: 2},
      seniorDevs: [
        { value: "Dev1", viewValue: "Dev1" },
        { value: "Dev2", viewValue: "Dev2" },
        { value: "Dev3", viewValue: "Dev3" }
      ]
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    }); */
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
    manager: new FormControl(),
    skills: new FormControl(),
    description: new FormControl()
  });
  skills = [];
  constructor(
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}