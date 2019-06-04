const express = require('express');
const app = express();
const PORT = 8000;

var urlDatabase = {
    'b2xVn2': 'http://www.lighthouse.ca',
    '9sm5xK': 'http://www.google.com'
}

//home page route 
app.get('/', (request, response) => {
    response.send("hello");
})

//url route 
.get('/url.json', (request, response)=> {
    response.json(urlDatabase);
})

// hello route 
.get("/hello", (request, response) => {
    response.send("<html><body>Hello <b>World</b></body></html>\n");
  })

.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`);
});