import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatChipInputEvent } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import decode from 'jwt-decode';


export interface ProjectData {
    uniqueProjectID: string,
    name: string,
    manager: string,
    skills: string[],
    developers: Developer[],
    description: string,
    status: string,
}

export interface Developer {
    value: string;
    viewValue: string;
}

interface Task {
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
export class ProjectsComponent {
    public search: string;
    public projects: ProjectData[];
    public isSenior: boolean = false;
    constructor(public dialog: MatDialog, public http: HttpClient, public router: Router) {
        this.search = '';
        this.getProjects();
        this.isSenior = decode(localStorage.getItem('token'))['cognito:groups'][0] === 'Senior_Developer'
    }

    /**
     * Get List of all Projects from API
     */
    getProjects(): void {
        let params = new HttpParams()
            .set('queryType', 'getProjects');
        this.projects = new Array();
        let response = this.http.get<ProjectData[]>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/Prod/projects",
            {
                params: params,
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                })
            });
        response.subscribe((data) => {
            data.forEach(element => {
                this.projects.push(element);
            });
        });
    }

    /**
     * Open the Project page of the project that has been clicked
     * @param project Project to open
     */
    openProject(project): void {
        this.router.navigate(['../project/' + project.uniqueProjID]);
    }

    /**
     * Create a dialog for new project creation
     */
    openNewProjectDialog(): void {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '500px';

        this.dialog.open(CreateProjectDialog, dialogConfig);
    }
}

@Component({
    selector: 'create-project-dialog',
    templateUrl: 'create-project-dialog.html',
})
export class CreateProjectDialog {
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    public seniorDevs: Object[];
    public project: FormGroup;
    public skills = [];
    /**
     * Init services
     * @param http Client for API requests
     * @param snackBar snackbar for API responses visualisation
     * @param router for navigation
     * @param formBuilder for creating the dialog form
     * @param dialogRef for closing the dialog
     */
    constructor(public http: HttpClient, private snackBar: MatSnackBar, public router: Router, private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<CreateProjectDialog>) {
        this.seniorDevs = [];
        this.project = formBuilder.group({
            name: ['', Validators.required],
            manager: ['', Validators.required],
            skills: [''],
            description: ['', Validators.required]
        });
        this.getSeniorDevelopers();
    }

    /**
     * Get List of Senior Developers
     */
    getSeniorDevelopers(): void {
        var params = new HttpParams()
            .set('queryType', 'getSeniorDevs');
        var headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        });

        var response = this.http.get<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/Prod/users", { headers: headers, params: params });
        response.subscribe((data) => {
            console.log(data);
            data.forEach(profile => {
                this.seniorDevs.push({
                    value: profile.username,
                    viewValue: profile.first_name + " " + profile.last_name,
                })
            });
        });
    }

    /**
     * Add new skill to list
     * @param event Chip event
     */
    add(event: MatChipInputEvent): void {
        console.log(event.value);
        const input = event.input;
        const value = event.value;
        // Add new skill
        if ((value || '').trim()) {
            this.skills.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    /**
     * Remove skill from list
     * @param skill to remove
     */
    remove(skill: string): void {
        const index = this.skills.indexOf(skill);

        if (index >= 0) {
            this.skills.splice(index, 1);
        }
    }

    /**
     * Submit new Project to database
     */
    submit(): void {
        if (this.project.invalid || this.skills === undefined || this.skills.length == 0) {
            console.log(this.project);
            return;
        }
        var tableUpdate = {
            uniqueProjID: btoa(this.project.controls['name'].value + "<>" + this.project.controls['manager'].value + "<>" + Date.now()),
            name: this.project.controls['name'].value,
            manager: this.project.controls['manager'].value,
            skills: this.skills,
            description: this.project.controls['description'].value
        }
        postToDynamo(this.http, tableUpdate, this.snackBar, this.router, "Project created successfully", "Project creation failed");


        this.dialogRef.close();
    }

    /**
     * Close dialog
     */
    close() {
        this.dialogRef.close();
    }

}

/**
 * Function to handle the posting to Dynamo
 * @param http Client
 * @param query Query to execute
 * @param snack snackbar for response
 * @param router for navigation
 * @param success message on success
 * @param fail message on fail
 */
function postToDynamo(http, query, snack, router, success, fail) {
    console.log(query);
    http.post('https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/Prod/projects', query,
        {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            })
        })
        .subscribe(
            res => {
                console.log(res);
                snack.open(success, 'Dismiss', {
                    panelClass: ['snackbar-style-success'],
                    duration: 1500
                });
                router.navigate(['../project/' + query.uniqueProjID]);
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