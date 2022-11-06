require("../db/connection");
const mongoose = require("mongoose");

const userDetailSchema = new mongoose.Schema({
    _id: {
        type: String
    },
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
        gender: Boolean
    },
    userprofileimage: {
        path: String
    },
    likedUser: [],
    viewedUser:[],
    superlikes:[],
    matches:[]
});

const UserDetail = new mongoose.model("userdetail", userDetailSchema);

module.exports = UserDetail;