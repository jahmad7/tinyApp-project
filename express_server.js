"use strict"

//import modules.
const PORT = 8000;
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require("cookie-session");

//modular code 
const USERDATA = require("./xUserData");
const FUNCTIONS = require("./functionCalls");

//add modules to our express server 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//use static files on server for css and other static files 
app.use(express.static("static"));

//set cookie session information
app.use(cookieSession({
    name: 'session',
    keys: ["why in the world does isNaN never work"],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }));


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

    if (USERDATA.currentUser.id !== null){
        response.render('urls_index', templateVars);
    }else {
        response.render('index', templateVars);
    }
});

app.post('/registration', (request, response) => {   
    const email = request.body.email;
    const password = request.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userID = FUNCTIONS.generateRandomString();

    if (FUNCTIONS.validEmail(USERDATA.users, email)){
        if(email && hashedPassword){
            USERDATA.currentUser = {
                id: userID,
                email: email,
                password: hashedPassword,
                urlDb: {},
                visitLog: {}
            };
            USERDATA.users[userID] = JSON.parse(JSON.stringify(USERDATA.currentUser));

            let templateVars = {
                user: USERDATA.currentUser
            };

            console.log("current user: ",USERDATA.currentUser);
            console.log("userdata: ", USERDATA.users);
            
            request.user_id = userID;
            response.render('urls_index', templateVars);
        }else{
            response.status(403).redirect('/registration');
        }
    } else{response.status(403).redirect('/registration');}  
});

app.get('/registration', (request, response) => {  
    let templateVars = {
        user: USERDATA.currentUser
    };
    response.render('registration', templateVars);
});

//url post route
app.post("/urls", (request, response) => {
    let shortURL = FUNCTIONS.generateRandomString();
    console.log(request.body.longURL);
    console.log(USERDATA.currentUser.urlDb[shortURL]);
    USERDATA.currentUser.urlDb[shortURL] = request.body.longURL;
    console.log(USERDATA.currentUser)
    response.redirect(`urls/${shortURL}`);
});

//to create a new short url
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

    if (USERDATA.currentUser.id !== null){
        response.render('urls_show', templateVars);
    } else {
        response.render('index', templateVars);
    }
});

//redirect to actual webstie 
app.get("/u/:shortURL", (request, response) => {

    const longURL = USERDATA.shortURLsObject[request.params.shortURL];

    //visting log to create track of how many time the site is visited 
    USERDATA.currentUser.visitLog[request.params.shortURL] += 1;

    response.redirect(longURL);
});

//deleting url from url account
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
        USERDATA.currentUser.visitLog = USERDATA.users[userID].visitLog;

        //making a cookie
        request.session.user_id = USERDATA.currentUser.id
        response.redirect("/urls");
    }else{response.status(403).redirect('/')}

});

app.post(`/logout`, (request, response) => {
 
    USERDATA.currentUser.id = null;
    USERDATA.currentUser.email = null;
    USERDATA.currentUser.password = null;
    USERDATA.currentUser.visitLog = {};
    USERDATA.currentUser.urlDb = {};

    request.session = null;

    response.redirect('/urls');
});

app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`);
});