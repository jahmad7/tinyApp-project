//***** FUNCTIONS  */
const bcrypt = require('bcrypt');

module.exports = {
    generateRandomString(){
        let short = ( Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5));
        return short;
    },
    
    validEmail(users, email){
        for (let user in users){
            //email already exists
            if(users[user].email === email){
                return false;
            }
        }
        return true;
    },

    validLogin(users, email, password){
        for (let user in users){
            let compareEmail = users[user].email;
            let comparePassword = users[user].password;

            if (compareEmail === email && bcrypt.compareSync(password, comparePassword)){
                return users[user].id;
            }
        }
        return null;
    }

};