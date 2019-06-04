"use strict"
const express = require('express');
const app = express();
const PORT = 8000;
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

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

//urls route handler to send data to our ejs template 
app.get('/urls', (request, response) =>{
    let templateVars = {urls: urlDatabase };
    response.render('urls_index', templateVars);
});

//new url route
app.post("/urls", (request, response) => {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = request.body.longURL;
    
    response.redirect("http://localhost:8000/urls/" + shortURL);
});

app.get('/urls/new', (request,response)=>{
    response.render("urls_new");
});

app.get('/urls/:shortURL', (request, response) => {
    let longURLPass = urlDatabase[request.params.shortURL];
    let templateVars = {shortURL: request.params.shortURL, longURL: longURLPass};
    response.render('urls_show',templateVars);
    
    //response.redirect(longURLPass);
});

//redirect to actual webstie 
app.get("/u/:shortURL", (request, response) => {
    const longURL = urlDatabase[request.params.shortURL];
    console.log(longURL)
    response.redirect(longURL);
  });

app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`);
});