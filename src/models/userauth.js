require("../db/connection");
const mongoose=require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    verify :{
        type : Boolean,
    },
    salt :{
        type : String
    },
    hash :{
        type : String
    },
    googleid :{
        type : String
    },
    tokens : [{
        token : {
            type : String
        }
    }]
});

//model
const User = new mongoose.model("User",userSchema);

module.exports = User;