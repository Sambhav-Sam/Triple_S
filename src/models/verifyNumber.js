require("../db/connection");
const mongoose=require("mongoose");

const verifyNumberSchema = new mongoose.Schema({
    _id : {
        type : String,
        required : true
    },
    code :{
        type : String,
        required : true,
    },
    number:{
        type : String,
        required : true
    }
});

const VerifyNumber = new mongoose.model("verifynumber",verifyNumberSchema);

module.exports = VerifyNumber;