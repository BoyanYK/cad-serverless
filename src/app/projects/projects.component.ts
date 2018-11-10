import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatChipInputEvent } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';


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
    styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
    id: string;
    search: string;
    projects: Object[]; //TODO extract Senior Devs with first/last name + username, to use in project creation
    constructor(public dialog: MatDialog, public http: HttpClient, public router: Router) {
        this.search = '';
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
                    uniqueProjID: element['uniqueProjID'],
                    name: element.name,
                    manager: element.manager,
                    skills: element.skills,
                    team_size: element.team_size,
                    max_team_size: element.max_team_size,
                    description: element.description,
                    developers: element.developers
                })
            });
        });
    }

    searchProjects(projectName: string): void {
        var params = new HttpParams({ fromString: 'queryType=query' });
        var query = {
            TableName: "Projects",
            KeyConditionExpression: "project_name = :p",
            ExpressionAttributeValues: {
                ":p": projectName
            }
        };
        var response = this.http.post<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/FetchDynamo", query, { params: params });
        response.subscribe((data) => {
            data.forEach(element => {
                this.projects = [{
                    uniqueProjID: element['uniqueProjID'],
                    name: element.name,
                    manager: element.manager,
                    skills: element.skills,
                    team_size: element.team_size,
                    max_team_size: element.max_team_size,
                    description: element.description,
                    developers: ['Dev A', 'Dev B']
                }];
            });
        });
    }

    getProjects(): void {

    }

    ngOnInit() {
    }


    openProject(project): void {
        this.router.navigate(['../project/' + project.uniqueProjID]);
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
    project: FormGroup;
    skills = [];
    constructor(public http: HttpClient, private snackBar: MatSnackBar, public router: Router, private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<CreateProjectDialog>,
        @Inject(MAT_DIALOG_DATA) data/* , public seniorDevs: Dev[] */) {
        this.seniorDevs = [];

        var response = this.http.get<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/Get_Senior_Devs");
        response.subscribe((data) => {
            data.Items.forEach(profile => {
                this.seniorDevs.push({
                    value: profile.username,
                    viewValue: profile.first_name + " " + profile.last_name,
                })
            });
        });
        /* this.seniorDevs = [
          { value: "Dev1", viewValue: "Dev1" },
          { value: "Dev2", viewValue: "Dev2" },
          { value: "Dev3", viewValue: "Dev3" }
        ]; */
        this.project = formBuilder.group({
            name: ['', Validators.required],
            manager: ['', Validators.required],
            skills: [''],
            teamSize: ['', Validators.required],
            description: ['', Validators.required]
        });
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
        if (this.project.invalid || this.skills === undefined || this.skills.length == 0) {
            console.log(this.project);
            return;
        }
        var tableUpdate = {
            TableName: 'Projects',
            Item: {
                uniqueProjID: btoa(this.project.controls['name'].value + "<>" + this.project.controls['manager'].value + "<>" + Date.now()),
                project_name: this.project.controls['name'].value,
                project_manager: this.project.controls['manager'].value,
                skills: this.skills,
                team_size: 0,
                max_team_size: this.project.controls['teamSize'].value,
                description: this.project.controls['description'].value
            }
        }
        postToDynamo(this.http, tableUpdate, this.snackBar, this.router, "Project created successfully", "Project creation failed");


        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

}

function postToDynamo(http, query, snack, router, success, fail) {
    console.log(query);
    http.post('https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/update-user-profiles', query)
        .subscribe(
            res => {
                console.log(res);
                snack.open(success, 'Dismiss', {
                    panelClass: ['snackbar-style-success'],
                    duration: 1500
                });
                router.navigate(['../project/' + query.Item.uniqueProjID]);
            },
            err => {
                console.log("Error occured", err);
                snack.open(fail, 'Dismiss', {
                    panelClass: ['snackbar-style-fail'],
                    duration: 1500
                });
            }
        );
}