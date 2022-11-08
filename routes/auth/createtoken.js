const User = require("../../src/models/userauth");
const jwt = require("jsonwebtoken");

const createToken = async (id)=>{
    const token = await jwt.sign({_id:id},process.env.SECRET,{
        expiresIn : "10000000000"
    });
    const user = await User.findOne({_id : id});
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

module.exports = createToken;

