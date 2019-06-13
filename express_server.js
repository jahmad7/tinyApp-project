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
        user: USERDATA.users[request.session.user_id]
    };

    response.render('index', templateVars);
});

//urls page route 
app.get('/urls', (request, response) =>{
    let templateVars = {
        user: USERDATA.users[request.session.user_id]
    };
    if (USERDATA.users[request.session.user_id] !== undefined){
        response.render('urls_index', templateVars).status(300);
    } else {
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
            //create key for new user

            //add new user id to users object
            USERDATA.users[userID] = {
                id: userID,
                email: email,
                password: hashedPassword,
                urlDb: {},
                visitLog: {}
            };

            request.session.user_id = userID;

            let templateVars = {
                user: USERDATA.users[request.session.user_id]
            };     

            response.render('urls_index', templateVars);
        }else {
            response.status(403).redirect('/registration');
        }
    } else {
        response.status(403).redirect('/registration');
    }  
});

app.get('/registration', (request, response) => {  
    let templateVars = {
        user: USERDATA.users[request.session.user_id]
    };
    response.render('registration', templateVars);
});

//url post route
app.post("/urls", (request, response) => {
    let shortURL = FUNCTIONS.generateRandomString();
    USERDATA.modifyURL(request.session.user_id, shortURL, request.body.longURL);
    response.redirect(`urls/${shortURL}`);
});

//to create a new short url
app.get('/urls/new', (request,response)=>{
    let templateVars = {
        urls: USERDATA.urlDatabase,
        user: USERDATA.users[request.session.user_id]
    };

    if (USERDATA.users[request.session.user_id] !== undefined){
        response.render('urls_new', templateVars);
    } else {
        response.render('index', templateVars).status(401);
    }
});


//short URL get request for page 
app.get('/urls/:shortURL', (request, response) => {

    let longURLPass = USERDATA.users[request.session.user_id].urlDb[request.params.shortURL];

    let templateVars = {
        shortURL: request.params.shortURL,
        longURL: longURLPass,
        user: USERDATA.users[request.session.user_id]
    };

    if (USERDATA.users[request.session.user_id].id !== null){
        response.render('urls_show', templateVars);
    } else {
        response.render('index', templateVars);
    }
});

//redirect to actual webstie 
app.get('/u/:shortURL', (request, response) => {

    let shortURLsObject = USERDATA.createShortURLsObejct(USERDATA.users);
    const longURL = shortURLsObject[request.params.shortURL];


    //if user is logged in, visting log to create track of how many time the site is visited 
    if (request.session.user_id){
        USERDATA.users[request.session.user_id].visitLog[request.params.shortURL] += 1;
    }

    response.redirect(longURL);
});

//deleting url from url account
app.post(`/urls/:shortURL/delete`,(request, response) => {
    let templateVars = {
        user: USERDATA.users[request.session.user_id]
    };

    if (USERDATA.users[request.session.user_id] !== undefined){
        const shortURL = request.params.shortURL;
        delete USERDATA.users[request.session.user_id].urlDb[shortURL];
        response.redirect("/urls");
    } else {
        response.render('index', templateVars).status(401);
    }
});

app.post(`/urls/:shortURL/update`,(request, response) => {

    let templateVars = {
        user: USERDATA.users[request.session.user_id]
    };

    if (USERDATA.users[request.session.user_id] !== undefined){
        const shortURL = request.params.shortURL;
        const newURL = request.body.longURL;
        USERDATA.modifyURL(request.session.user_id, shortURL, newURL);
        response.redirect("/urls");

    } else {
        response.render('index', templateVars).status(401);
    }
    
});

app.post(`/login`, (request, response) => {
    const email = request.body.email;
    const password = request.body.password;
    const userID = FUNCTIONS.validLogin(USERDATA.users, email, password);
    if (userID){
        //making a cookie
        request.session.user_id = userID;
        response.redirect("/urls");
    } else {
        response.status(403).redirect('/');
    }

});

app.post(`/logout`, (request, response) => {
    request.session = null;

    response.redirect('/');
});

app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`);
});