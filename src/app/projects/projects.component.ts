import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


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

  /* openNewProjectDialog() {
    const dialogRef = this.dialog.open(CreateProjectDialog, {
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
    });
  } */
}
/* 
@Component({
  selector: 'create-project-dialog',
  templateUrl: 'create-project-dialog.html',
})
export class CreateProjectDialog {

  constructor(
    public dialogRef: MatDialogRef<CreateProjectDialog>,
    @Inject(MAT_DIALOG_DATA) public project: PData, public seniorDevs: Dev[]) {
    this.seniorDevs = [
      { value: "Dev1", viewValue: "Dev1" },
      { value: "Dev2", viewValue: "Dev2" },
      { value: "Dev3", viewValue: "Dev3" }
    ];

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

} */