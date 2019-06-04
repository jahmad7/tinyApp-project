const express = require('express');
const app = express();
const PORT = 8000;

let urlDatabase = {
    'b2xVn2': 'http://www.lighthouse.ca',
    '9sm5xK': 'http://www.google.com'
}

app.get('/', (request, response) => {
    response.send("hello");
})
.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`);
});