require("../db/connection");
const mongoose = require("mongoose");

const userDetailSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    socketId :String ,
    suscribed : Boolean,
    Number: {
        type: String,
        Num: String,
        isVerified: Boolean
    },
    location: {
        lat: String,
        lon: String,
        city: String,
        postcode: String
    },
    moreDetail: {
        name: String,
        dob: Date,
        gender: String,
        phone : String,
        preference : String
    },
    userprofileimage: {
        path: String
    },
    likedUser: [],
    viewedUser:[],
    superlikes:[],
    matches:[{
        userId : String,
        name : String,
        roomId : String
    }],
    messages:[
        {
            message : String,
            user : String,
            isviewed : Boolean
        }
    ]
});

const UserDetail = new mongoose.model("userdetail", userDetailSchema);

module.exports = UserDetail;