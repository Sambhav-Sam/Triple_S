require("../db/connection");
const mongoose=require("mongoose");

const userDetailSchema = new mongoose.Schema({
    _id : {
        type : String
    },
    Number :{
        type : String,
        Num : String,
        isVerified : Boolean
    },
    location :{
        lat : String,
        lon : String,
        city : String,
        postcode : String
    },
    moreDetail : {
        name : String,
        dob : String ,
        gender : Boolean
    }
});

const UserDetail = new mongoose.model("userdetail",userDetailSchema);

module.exports = UserDetail;