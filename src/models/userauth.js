require("../db/connection");
const mongoose=require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    tokens : [{
        token : {
            type : String
        }
    }]
});

userSchema.plugin(passportLocalMongoose);

//model
const User = new mongoose.model("User",userSchema);

module.exports = User;