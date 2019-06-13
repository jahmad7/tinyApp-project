# TinyApp - Web Application

Application to shorten urls for logged in users. Application has a full session database, for users to register and store private urls that can be editted and shared publicly with other people.

## Getting Started

Fork and pull the repo to your computer to run the problem. The code is running using npm and the server will run on port 8000. To get server up and running go to terminal and cd to file, and run 'npm start'

### Prerequisites

Program runs on an express server and will also require the follwing modules: 

```
"dependencies": {
    "bcrypt": "2.0.0",
    "body-parser": "^1.19.0",
    "cookie-session": "^1.3.3",
    "ejs": "^2.6.1",
    "express": "^4.17.1"
  },
```

### Installing

A step by step explaination of setting up the express sever and using nodemon to keep the server project running while making edits to the code 

To run the server: 

```
npm install
npm start 
```

*npm install downloads the dependencies required for the program*

## Contributing

Completed with assitance of guidelines provided by Lighthouse Labs materials and mentors. 

## Versioning

Version 1.0 - NOTE that this version does not use a database, thus all data that is not hardcoded will be deleted, once the server is restarted or crashes.

## Authors

* **Junaid Ahmad** - *Initial work* - [JAHMAD7](https://github.com/jahmad7)

## ScreenShots

The website has not been editted for design yet, and has been designed only for function

### Login Page

![Login page screenshot](/screenshots/loginPage.png "Login Page")

Users' email address will be visable but password is censored. 

### Registration Page

![Registration page screenshot](/screenshots/registrationPage.png "Registration Page")

Users' will need to input a unique email address and password. If email is taken the page will redirect to start again. or if entries are invalid, redirect will occur.

### My URLs Page

![My URLs  page screenshot](/screenshots/MyURLsPage.png "My URLsa Page")

My URLS will show the short URL, the long URL as a hyperlink to the site, and the times the user has visited the site in the session. The page also includes buttoms to edit or delete the URL.

### Update URLs Page

![Update URLs page screenshot](/screenshots/updateURLpage.png "Update URLs Page")

Clicking the edit button on the My URLs page will bring user to the URL's independent page where they can edit the unique short URL's link to a new site, or delete the URL from the user's database All togehter.



## Acknowledgments

* Lighthouse Labs
