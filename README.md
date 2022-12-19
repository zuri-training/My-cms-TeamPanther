# My-cms-TeamPanther

## A platform that allows users spin up a basic website - and allows as much customizations as possible.

This project is in line with the stepwise Milestones and tasks provided by the Zuri Instructors and Mentors and so far, as at the 7th of December, 2022; it contains the following:

## Milestone 2

- Definition of a start folder structure for our project.
- Initialized project folders
- Initialized base project files (some of which are empty for the time-being).
- Initialized npm packages (see in package.json)
- A .gitignore file to exclude heavy object collections like node_nodules
- A .env file to store some private variables
- A server.js application that we propose to use if necessary, as an HTTP server for the website.

# Module for Authentication (Milestone 3)

## Check authBranch for this folder

The folder was separated purposely for testing. We will update the main branch with the implementation once testing is complete.

This module contains relevant files to describe the flow of our authentication. We created two routes, Login and Registration.
We also connected to a database (MongoDB). To test, start the index.js in the authentication branch with 'npm run dev'. Try to create a user and validate by logging in

## Contents

- Base Web Server (app.js [secondary] & index.js [main]) with login, and registration routes created.
- Basic definition of user schema model. (More fields will be added).
- Email validation with validator package from npm
- JWT authentication and authorization beta implementations with jasonwenbtoken package from npm
- MongoDB database connection
- Authentication middleware

# Issues

- On the main branch, we will use one server app, server.js. We are yet to implement that.

# Contributors

TeamPanther Backend Developers, Headed by Chukwuezi Precious

## PROGRESS

Project is still ongoing. Pages and styles are being created and logic to connect frontend with backend is on going

## Live version of Project

[panther-cms](panther-cms.herokuapp.com)
