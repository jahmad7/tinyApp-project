"use strict"

//import modules.
const express = require('express');
const app = express();
const PORT = 8000;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const USERDATA = require("./xUserData");
const FUNCTIONS = require("./functionCalls");

//add ejs, body parsing and cookie parse to our express library 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
//use static files 
app.use(express.static("static"));

console.log(USERDATA.currentUser)

//home page route 
app.get('/', (request, response) => {
    let templateVars = {
        user: USERDATA.currentUser
    };
    response.render('index', templateVars);
});

//urls page route 
app.get('/urls', (request, response) =>{
    let templateVars = {
        user: USERDATA.currentUser
    };
    response.render('urls_index', templateVars);
});

app.post('/registration', (request, response) => {    //GO TO GO  
    let email = request.body.email;
    let password = request.body.password;
    let userID = FUNCTIONS.generateRandomString();

    if (FUNCTIONS.validEmail(USERDATA.users, email)){
        if(email && password){
            USERDATA.currentUser = {
                id: userID,
                email: email,
                password: password,
                urlDb: null
            };
            USERDATA[userID] = USERDATA.currentUser;
            
            response.cookie("userID", userID).redirect("/urls");
        }else{
            response.status(403).redirect('/registration');
        }
    } else{response.status(403).redirect('/registration');}  
});

app.get('/registration', (request, response) => {  //GOOD TO GO
    let templateVars = {
        user: USERDATA.currentUser
    };
    response.render('registration', templateVars);
});

//url post route
app.post("/urls", (request, response) => {
    let shortURL = FUNCTIONS.generateRandomString();
    USERDATA.currentUser.urlDb[shortURL] = request.body.longURL;
    console.log(USERDATA.currentUser)
    response.redirect(`urls/${shortURL}`);
});


    app.get('/urls/new', (request,response)=>{
        let templateVars = {
            urls: USERDATA.urlDatabase,
            user: USERDATA.currentUser
        };

        if (USERDATA.currentUser.id !== null){
            console.log(USERDATA.currentUser.id);
            response.render("urls_new", templateVars);
        }else {
            console.log(USERDATA.currentUser.id);
            response.render('index', templateVars);
        }
    });


//short URL get request for page 
app.get('/urls/:shortURL', (request, response) => {
    let longURLPass = USERDATA.currentUser.urlDb[request.params.shortURL];
    let templateVars = {
        shortURL: request.params.shortURL,
        longURL: longURLPass,
        user: USERDATA.currentUser
    };
    response.render('urls_show',templateVars);
});

//redirect to actual webstie 
app.get("/u/:shortURL", (request, response) => {
    const longURL = USERDATA.shortURLsObject[request.params.shortURL];
    response.redirect(longURL);

});

app.post(`/urls/:shortURL/delete`,(request, response) => {
    const shortURL = request.params.shortURL;
    delete USERDATA.currentUser.urlDb[shortURL];
    response.redirect("/urls");
});

app.post(`/urls/:shortURL/update`,(request, response) => {
    const shortURL = request.params.shortURL;
    const newURL = request.body.longURL;

    USERDATA.currentUser.urlDb[shortURL] = newURL;

    response.redirect("/urls");
});

app.post(`/login`, (request, response) => {
    const email = request.body.email;
    const password = request.body.password;
    const userID = FUNCTIONS.validLogin(USERDATA.users, email, password);
    if (userID){
        //set current user to the data of the login user 
        USERDATA.currentUser.id = userID;
        USERDATA.currentUser.email = USERDATA.users[userID].email;
        USERDATA.currentUser.password = USERDATA.users[userID].password;
        USERDATA.currentUser.urlDb = USERDATA.users[userID].urlDb;

        //making a cookie
        response.cookie("userID", USERDATA.currentUser.id).redirect("/urls");
    }else{response.status(403).redirect('/urls')}

});

app.post(`/logout`, (request, response) => {
    USERDATA.currentUser.id = null;
    USERDATA.currentUser.email = null;
    USERDATA.currentUser.password = null;
    response.clearCookie('userID') .redirect('/urls');
});

app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`);
});