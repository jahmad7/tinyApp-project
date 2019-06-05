"use strict"

//import modules.
const express = require('express');
const app = express();
const PORT = 8000;
const bodyParser = require("body-parser");

//add ejs and body parsing to our express library 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//database to hold all of our urls 
let urlDatabase = {
    'b2xVn2': 'http://www.lighthouse.ca',
    '9sm5xK': 'http://www.google.com'
}

//***** FUNCTIONS  */

function generateRandomString(){
    let short = ( Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5));
    return short;
}

//*********** */



//home page route 
app.get('/', (request, response) => {
    response.send("hello");
});

//urls page route 
app.get('/urls', (request, response) =>{
    let templateVars = {urls: urlDatabase };
    response.render('urls_index', templateVars);
});

//url post route
app.post("/urls", (request, response) => {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = request.body.longURL;
    response.redirect(`urls/${shortURL}`);
});


//new url post 
app.get('/urls/new', (request,response)=>{
    response.render("urls_new");
});

//short URL get request for page 
app.get('/urls/:shortURL', (request, response) => {
    let longURLPass = urlDatabase[request.params.shortURL];
    let templateVars = {shortURL: request.params.shortURL, longURL: longURLPass};
    response.render('urls_show',templateVars);
});

//redirect to actual webstie 
app.get("/u/:shortURL", (request, response) => {
    const longURL = urlDatabase[request.params.shortURL];
    console.log(longURL)
    response.redirect(longURL);

});

app.post(`/urls/:shortURL/delete`,(request, response) => {
    const shortURL = request.params.shortURL;
    delete urlDatabase[shortURL];
    console.log(urlDatabase)
    response.redirect("/urls");
});

app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`);
});