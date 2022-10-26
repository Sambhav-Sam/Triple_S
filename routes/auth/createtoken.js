const User = require("../../src/models/userauth");
const jwt = require("jsonwebtoken");

const createToken = async (id,user)=>{
    const token = await jwt.sign({_id:id},process.env.SECRET,{
        expiresIn : "100 minutes"
    });
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

module.exports = createToken;
