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
            if(users[user].email == email){
                return false;
            }
        }
        return true;
    },

    validLogin(users, email, password){
        for (let user in users){
            console.log(users[user]);
            let compareEmail = users[user].email;
            let comparePassword = users[user].password;
            console.log(user);
            console.log("compare email: ",compareEmail, " passed email: ", email);
            console.log("compare password: ",comparePassword, "passed password: ", password);

            console.log(compareEmail === email && bcrypt.compareSync(password, comparePassword));

            if (compareEmail === email && bcrypt.compareSync(password, comparePassword)){
                console.log("returned ID: ",users[user].id);
                return users[user].id;
            }
        }
        return null;
    }

};