# Cloud Application Development Coursework 1

## Project Management Web Application

### 1. Requirements

1.  **Basic Capabilities**

    -   Have different roles
    -   Create and store user information
    -   Modify attributes of users and projects
    -   Define users as project managers or allocate developers to projects
    -   Employees list themselves and their skills
    -   Ability to create projects

2.  **Advanced Capabilities**
    -   Search users and projects
    -   Send emails to users upon when an action involving them has been completed
    -   List projects based on status

### 2. Approach

-   **Roles**

    -   Admin
    -   HR
    -   Senior Developer
    -   Developer

        _Only Senior Developers can be Project Managers_
        _Only admin can create new users and assign their position within the company_
        _Everyone can list details/skills about themselves in their personal page_

-   **Projects**

    -   Have specification and tags for relevant skills
    -   HR and Senior Developers can create projects
    -   HR and Senior Developers can assign Project Managers
    -   HR and Senior Developers can assign developers to projects
    -   A Senior Developer can not be a Project Manager on more than 2 projects at the same time
    -   A Developer can not participate in more than 2 projects at the same time
    -   Only Project Manager can change status and specification of projects

-   **Additional features list, if time permits**
    -   Anyone can create tickets related to web application issues
        -   Admins get emails for any such ticket
    -   Developers can add comments beneath a project board that they are part of
    -   When adding developers to a project, sort them based on relevant skills
    -   Sort projects based on status or team completeness
    -   Developers can apply to be part of an incomplete team => Project Manager gets a notification about it and can approve/reject them from a notification menu while inside the appplication
    -   Autocomplete while searching users/projects
            

### 3. Overview of function operation/usage scenarios

-   **User Login**
    1.  Visit login page, enter credentials and submit
    2.  Access authentication based on AWS Cognito
    3.  Options available after login differ based on user role  
        _Everyone has access to a personal details page where they can update their skills and short information about themselves_
        _Everyone has a notification page where all actions that have not been seen are_
        ```mermaid
        graph TD;
         Visit_Login_Page-->Submit_Details;
         Submit_Details-->AWS_Cognito_Authentication;
        ```
-   **User Creation**
    1.  Admin is logged in
    2.  Selects create new user
    3.  Fills in First, Last Name, a password and role, submits details
    4.  AWS Lambda function uses details to create a new user in AWS Cognito pool, as well as a user in AWS DynamoDB  
            Afterwarwards, the user can log in
-   **Project Creation**
    1.  HR or Senior Developer is logged in
    2.  Selects create new project
    3.  Fills in unique project name, specification, team size and tags for required skills  
            _Step 3 requires communication to the database through AWS Lambda_
-   **Project Manager selection**
    1.  HR or Senior Developer is logged in 
    2.  Selects a project without a Project Manager
    3.  Selects pick a Project Manager
    4.  Selects a Project Manager from a list of all available Senior Developers
    5.  AWS Lambda function is triggered to update the projects list in DynamoDB, and to notify the selected developer of their new project to supervise  
            _Steps 2,3 and 4 require communication to the database through AWS Lambda_
-   **Developer selection**
    1.  HR or Senior Developer is logged in 
    2.  Selects a project with incomplete team
    3.  Selects pick a developer
    4.  Selects a developer from a list of all available ones
    5.  AWS Lambda function is triggered to update the projects list in DynamoDB, and to notify the selected developer of their new project to supervise  
            _Steps 2,3 and 4 require communication to the database through AWS Lambda_
-   **Project update**
    1.  Project Manager is logged in
    2.  Goes to Projects board
    3.  Selects my projects, then one that is supervised by them
    4.  Selects edit and changes the status/description/tasks
    5.  Saves changes and a AWS Lambda function is triggered to reflect that
        * Project information is updated
        * All developers on the project have their notification list in the database updated 
        _Steps 2,3 and 4 require communication to the database through AWS Lambda_

* **Tables structure**
    * Users Table
    ```js
      {
          "User_ID": 100,
          "First_Name": "First",
          "Last_Name": "Last",
          "Email": "email@email.com"
          "Description": "Some Description",
          "Role": "Role",
          "Notifications": [{
                  "Date": "Date",
                  "Message": "Message"
                  "Link": "Link_To_Page"
              },
              {
                  "Date": "Date",
                  "Message": "Message",
                  "Link": "Link_To_Page"
              }
          ]
      }
    ```
    * Projects Table
    ```js
    {
        "Project_ID": 100,
        "Project_Name": "Name",
        "Project_Manager": "Senior_Dev_A",
        "Project_Description": "Some Description",
        "Team_Size": 3,
        "Role": "Role",
        "Developers": [
            "Developer_A",
            "Developer_B",
            "Developer_C"
        ]
      }
    ```
### 4. Libraries and other resources
* [AWS Cognito User Creation](https://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html)
* [AWS Cognito User Authentication](https://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-identity-user-pools-javascript-example-authenticating-admin-created-user.html)
* [Notifications](https://github.com/jacob-meacham/angular-notification-icons)
* [Login routing](https://medium.com/@ryanchenkie_40935/angular-authentication-using-route-guards-bf7a4ca13ae3)
* [Toolbar](https://theinfogrid.com/tech/developers/angular/responsive-navbar-angular-flex-layout/)
* [Colour palette](https://www.materialpalette.com/)
* [FlexLayout](https://blog.angularindepth.com/angular-flex-layout-flexbox-and-grid-layout-for-angular-component-6e7c24457b63)