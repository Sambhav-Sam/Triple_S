const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
const User = require("../../models/userauth");



const createUser = async (username, email, password) => {
    try {
        const salt1 = randomstring.generate(20);
        const salt2 = await bcrypt.genSalt();
        const saltedpassword = salt1 + password + salt2;
        const salt = salt1 + salt2;
        const hash = await bcrypt.hash(saltedpassword, 10);
        
        const newuser = new User({
            username: username,
            email: email,
            verify : false,
            salt: salt,
            hash: hash,
        })

        const result = await newuser.save();
        return result;
    } catch (error) {
        console.log(error);
    }

};


module.exports = createUser;