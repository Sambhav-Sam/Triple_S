const bcrypt = require("bcrypt");
const User = require("../../models/userauth");
const createToken = require("../../../routes/auth/createtoken");

const findUser = async (email, password,res) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const salt = user.salt;
            const salt1 = salt.substr(0, 20);
            const salt2 = salt.slice(20);
            const saltedpassword = salt1 + password + salt2;
            const verifypassword = await bcrypt.compare(saltedpassword, user.hash);
            if(verifypassword)
            {
                const token = await createToken(user._id);
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 6000000),
                    httpOnly: true
                });
                const result = {
                    status : true,
                    statuscode : 200,
                    userid : user._id
                }
                return result;
            }
            else
            {
                console.log("wrong password entered");
                const result ={
                    status : false ,
                    error : "wrong password entered",
                    statuscode : 401
                }
                return result;
            }
        }
        else {
            console.log("user not found");
            const result ={
                status : false ,
                error : "user not found",
                statuscode : 401
            }
            return result;
        }
    } catch (error) {
        console.log(error);
        const result ={
            status : false ,
            error : error,
            statuscode : 401
        }
        return result;
    }
}

module.exports = findUser;