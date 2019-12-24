# project: Asynchronous Server Technologies project

## Introduction

This project is a simple web API with a dashboard.

## Installation instructions

If you want to use this project you should clone the git repository, then type the command "npm install" before running the program using "npm run dev" or "npm run start".To test the unit tests use the command "npm test". You can also use Travis to achieve it.


## The principales features of this system

	1) sign In, sign Up, sign Out for a user

	2) add/delete/update/display metrics 

## routes

/homePage (GET): render the home page of the website
/ (GET) : render the index page
/ (POST) : try to connect to the index page
/login (GET) : render the login page
/login (POST): try connection with login and password
/signup (GET): render the sign up page
/addMetric (GET): render the page to add a metric (session required)
/addMetric (POST): add a metric wih the properties entered in the form (session required)
/updateMetric (GET): render the page to update a specific metric (session required)
/updateMetric (POST): update the value of a specific metric (session required)
/deleteMetric (GET): render the page to delete a metric (session required)
/logout(GET): log out the user and render the login page (session required)
/updatePassword (GET): render the page to change our password(session required)
/updatePassword (POST): change the current password(session required)
/delete(GET): delete the current user and run the login page (session required)
/user (POST): try to create a new user if he/she does not already exist
/user/:username: get the information about the current user (session required)
/metrics (GET): get all the metrics from the current user (session required)
/metrics/:id (POST) : save the metric with its attributes (session required) 
/metrics/:id (DELETE) : delete the metric using its key (session required) 
/metrics/:id/:timestamp/:username (DELETE): delete the metric corresponding (session required)
/metric (POST): delete a metric (session required)


## parameters

id: the id of the concerned metric
timestamp: the timesstamp of the concerned metric
username: the username of the current user

## authorization

We usually use "authCheck" to check if the current user's session is allowed to achieve the desired action


## List of contributors

Bruno Charlene and Flaquer Laura