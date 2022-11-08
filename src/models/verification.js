require("../db/connection");
const mongoose=require("mongoose");

const verifyUserSchema = new mongoose.Schema({
    _id : {
        type : String,
        required : true,
        unique : false
    },
    code :{
        type : String,
        required : true,
    }
});

const VerifyUser = new mongoose.model("verifyuser",verifyUserSchema);

module.exports = VerifyUser;