import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import decode from 'jwt-decode';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  project = new Object;
  temp: string;
  user: string;
  statusSelect = new FormControl();
  changeStatus = false;
  taskNumber: number;
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.getProjectInformation(this.route.snapshot.paramMap.get('project_id'));
    this.user = decode(localStorage.getItem('token'))['username'];
    console.log(this.user);
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

  getProjectInformation(project_id: string): void {
    //TODO fetch from dynamo
    var params = new HttpParams({ fromString: 'queryType=query' });
    var query = {
      TableName: "Projects",
      KeyConditionExpression: "uniqueProjID = :p",
      ExpressionAttributeValues: {
        ":p": project_id
      }
    };
    var response = this.http.post<any>("https://gxyhy2wqxh.execute-api.eu-west-2.amazonaws.com/test/FetchDynamo", query, { params: params });
    response.subscribe((data) => {
      data.forEach(element => {
        this.project = {
          uniqueProjID: element['uniqueProjID'],
          name: element.project_name,
          manager: element.project_manager,
          skills: element.skills,
          team_size: element.team_size,
          max_team_size: element.max_team_size,
          description: element.description,
          developers: ['Dev A', 'Dev B'],
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
