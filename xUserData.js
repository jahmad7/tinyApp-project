// git ignored user data information 

let users = {
    "sowjf": {
        id: "sowjf",
        email: "user@example.com",
        //purple-monkey-dinosaour
        password: "$2b$10$0YE3sVPpZjFNBglERodpAu9aI8U4tGSiIFbhsIBWEMtBnUDObXSVK",
        urlDb: {
            'b2xVn2': 'http://www.lighthouse.ca',
            '9sm5xK': 'http://www.google.com'
        },
        visitLog: {
            'b2xVn2': 0,
            '9sm5xK': 0
        }
    },
    "sedgr": {
        id: "sedgr",
        email: "user2@example.com",
        //dishwasher-funk
        password: "$2b$10$QYbp1B8QIBXzzwTMwn25veSrl7WGIrno6V3nOb3WPl2QpMcrZ84si",
        urlDb: {
            'b2xVx2': 'http://www.lighthouse.ca',
            '9sm5yK': 'http://www.google.com'
        },
        visitLog: {
            'b2xVn2': 0,
            '9sm5xK': 0
        }
    }
};

function createShortURLsObejct(users) {
    let shortURLsObject = {};

    for(let user in users){
        for (let urlkey in users[user].urlDb){
            shortURLsObject[urlkey] = users[user].urlDb[urlkey];
        }
    }
    return shortURLsObject;
}

function modifyURL(userID, shortURL, longURL){
    users[userID].urlDb[shortURL] = longURL;
}



module.exports = {
    users,
    createShortURLsObejct,
    modifyURL
};