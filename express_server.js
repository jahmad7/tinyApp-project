"use strict"
const express = require('express');
const app = express();
const PORT = 8000;
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
    'b2xVn2': 'http://www.lighthouse.ca',
    '9sm5xK': 'http://www.google.com'
}

//***** FUNCTIONS  */

function generateRandomString(longURL){

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
    console.log(request.body);
    response.send("OK");
});
app.get('/urls/new', (request,response)=>{
    response.render("urls_new");
});

app.get('/urls/:shortURL', (request, response) => {
    let templateVars = {shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL]};
    response.render('urls_show',templateVars);
});

app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`);
});