# Course Planning Tool  [![frontend](https://github.com/gdancik/CoursePlanningTool/actions/workflows/frontend.yml/badge.svg)](https://github.com/gdancik/CoursePlanningTool/actions/workflows/frontend.yml) [![backend](https://github.com/gdancik/CoursePlanningTool/actions/workflows/backend.yml/badge.svg)](https://github.com/gdancik/CoursePlanningTool/actions/workflows/backend.yml) [![nb](https://github.com/gdancik/CoursePlanningTool/actions/workflows/notebooks.yml/badge.svg)](https://github.com/gdancik/CoursePlanningTool/actions/workflows/notebooks.yml)

This is the repository for a forthcoming Course Planning Tool developed by students from [Eastern Connecticut State University](https://www.easternct.edu).

The repository includes a *backend* consisting of a Flask application, a *frontend* consisting of a *react* application, and a *nb* folder for working using Jupyter Notebooks to aid in development.


###  Running the backend (flask) server 

```
cd backend && flask run
```
Flask is now running on localhost:5000

The test flask application includes the following endpoints:
- / - homepage
- /login/ - logs in user
- /logout/ - logs out user
- /api/hello/ - returns greeting (login required)
- /api/hi/ - returns greeting (login not required)
- /generate/ - generates a word document

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
