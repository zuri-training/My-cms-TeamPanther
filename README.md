# Name of Project : CMS (Content Management System)

## A platform that allows users spin up a basic website - and allows as much customizations as possible.

- This project is in line with the stepwise Milestones and tasks provided by the Zuri Instructors and Mentors and so far, as at the 7th of December, 2022; it contains the following:

# Name of Team:

## Team Panther

# Link live version Web Application

[Click here](panther-cms.herokuapp.com) to see access the hosted page. Or copy and pase "panther-cms.herokuapp.com" into your browser.

# Project Date and Duration

- December 1, 2022 - December 14, 2022

# Roles

The current status of this web application has only three roles: "admin", "previleged-user", "user".

## Admin ("admin")

A user with the role of "admin" has unlimited access to every part of this application. In fact, an admin will be responsible for software patches and database management for for the web application.

## Privileged-User ("privileged-user")

A user with this role is considered first registered (authenticated) and has access just below levels of the admin. These users can also get access to the backend of the web application, and can perform CRUD operations on users registered within their defined template.But this user will not be able to perform some operations that may infringe on the integrity of the web application

## User ("user")

An individual earns this role when he is authenticated (signed up) and can therefore explore and use the resources of the web application. However, their power level is below that of the privileged users.

# Other Types of Users

This category lies the unauthenticated users, who are restricted to important features of the web application.

# Summary of User Access Privileges

| Authenticated User                   | Unauthenticated User                           |
| :----------------------------------- | :--------------------------------------------- |
| Full access to the platform          | Visit the platform to view basic info about it |
| Access to backend of created website | View and interact with the document            |
| Ability to create more pages         | Register to setup a new website                |
| Ability to change template           | Setup website by filling up some information   |
| Unique address                       | Browse through available templates             |
| Ability to add social media links    |                                                |

### NOTEWORTHY

- Authenticated user is analogous to the "privileged-user" role while Unauthenticated user is analogous to the "user" role.

# How to Start

1. Access the endpoint through the link.
2. Sign-up/register to obtain access to spinning up the website of your choice.
3. Once logged in, you can access and choose your any web template from our plethora of cool choices.
4. Fill up the basic information to spin up your websites.
5. You can also create links to social media pages or blogs in the template of your choice.

## Un-Hosted Testing

- Clone the repository and update your local machine and run the command below in the right directory; to install all the dependencies in the package.json file.

```
npm install
```

Then start the application by using:

```
npm run dev
```

The application starts. Interact with it using lifeServer embedded in VScode or with postMan.

# Resources Used

The following resources were helpful in preparing this application:

- Figma -> For the Product Design
- Postman -> For Development and testing of API endpoints
- Slack and WhatsApp -> For communication among developers and product designers
- Github -> For collaboration amongst developers, providing an online repository to host source code documentation.
- VsCode -> The Main Editor used among the developers
- MongoDB Atlas -> For data-bse provision and management.

# Application Features and Packages

The cms web application was implemented with the following packages:

## Packages

- Authentication enablement with packages like Json Web Tokens (JWT), nodemailer, bcrypt.
- Security enablement with packages like express-mongo-sanitize, xss-clean, validator, helmet.
- Development Dependencies like nodemon for application server development and testing.

## Features

- The website can spin up child websites.
- Lists for pricing and premium resources
- The website provides cool templates from diverse areas of life the user may likely want to explore, and/or chooses.
- The cms platform provides a dashboard for privileged users to manage and scale contents.
- Frequently asked questions, blog posts and comments are also embedded in the design.

# Contributors and Roles

| Name                 | Description      | Role                  |
| :------------------- | :--------------- | :-------------------- |
| PRODUCT DESIGNERS    |
| Emmanuella Obazele   | Product Designer | Member                |
| Robinson Barikpoa    | Product Designer | Overall Team Leader   |
| Gerald Ilozor        | Product Design   | Member                |
| Obi Theodora         | Product Designer | Member                |
| Ifedimeji Omoniyi    | Product Designer | Member                |
| Salome Kingsley      | Product Designer | Member                |
| Bakare Waliyilahi    | Product Designer | Member                |
| Favour omobude       | product designer | Member                |
| Ramatlai Kekere-Ekun | Product designer | Member                |
| DEVELOPERS           |
| Okun Williams        | Frontend         | Member                |
| Abudu Rodiyyah       | Frontend         | Member                |
| Remilekun Olayinka   | Fullstack        | Member                |
| Oluwatowo Rosanwo    | Fullstack        | Dev-Team Leader       |
| Precious Chukwuezi   |  Backend         | Asst. Dev-Team Leader |

# Issues

- The times-cope restricted the implementation of the full requirements, so just samples of expected web-app behavior are required.
