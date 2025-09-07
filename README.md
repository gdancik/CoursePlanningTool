
# Course Planning Tool  

| Version  | Frontend App | Backend App | Service Modules |
| ------------- | ------------- | ------------- | ------------- |
| main |[![frontend](https://github.com/gdancik/CoursePlanningTool/actions/workflows/frontend.yml/badge.svg?branch=main)](https://github.com/gdancik/CoursePlanningTool/actions/workflows/frontend.yml)  |  [![backend-app](https://github.com/gdancik/CoursePlanningTool/actions/workflows/backend-app.yml/badge.svg?branch=main)](https://github.com/gdancik/CoursePlanningTool/actions/workflows/backend-app.yml)| [![backend-services](https://github.com/gdancik/CoursePlanningTool/actions/workflows/backend-services.yml/badge.svg?branch=main)](https://github.com/gdancik/CoursePlanningTool/actions/workflows/backend-services.yml)|
| dev |[![frontend](https://github.com/gdancik/CoursePlanningTool/actions/workflows/frontend.yml/badge.svg?branch=dev)](https://github.com/gdancik/CoursePlanningTool/actions/workflows/frontend.yml)  |  [![backend-app](https://github.com/gdancik/CoursePlanningTool/actions/workflows/backend-app.yml/badge.svg?branch=dev)](https://github.com/gdancik/CoursePlanningTool/actions/workflows/backend-app.yml)| [![backend-services](https://github.com/gdancik/CoursePlanningTool/actions/workflows/backend-services.yml/badge.svg?branch=dev)](https://github.com/gdancik/CoursePlanningTool/actions/workflows/backend-services.yml)|





This is the repository for a forthcoming Course Planning Tool developed by students from [Eastern Connecticut State University](https://www.easternct.edu).

The repository includes a *backend* consisting of a Flask application, a *frontend* consisting of a *react* application, and a *nb* folder for working using Jupyter Notebooks to aid in development.

### Setup for developers

- Google authentication requires GS_AUTH_JSON environmental variable for OAuth 2.0 Client (https://console.cloud.google.com/auth/clients)
- Saving data requires a google service account with firebase enabled (https://console.cloud.google.com/iam-admin/serviceaccounts)

###  Running the backend (flask) server 

```
flask --app=backend:create_app run
```
Flask is now running on localhost:5000

## Running the frontend (node/react) server 

```
cd frontend && npm ci && npm start
```

React is now running on localhost:3000. Note that in *package.json*, we need to set proxy to handle API calls to flask running on port 5000.

The test react application has the following endpoints:
- / - homepage
- /login/ - fetches /login/ from flask
- /hello/ - fetches /api/hello/ from flask (login is required)

 
### Sample Jupyter notebook

Install the required packages:
```
pip install -r requirements.txt
```
- files: 
  - updateSyllabus.ipynb: Jupyter Notebook with sample code
  - CSC101_Syllabus.docx: sample syllabus to use as a template


### Issues

See [issues](/issues.md) for known issues.

