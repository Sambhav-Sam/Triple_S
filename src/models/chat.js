require("../db/connection");
const mongoose=require("mongoose");

const chatSchema = new mongoose.Schema({
    roomId : {
        type : String,
    },
    chat : [{
        userid : String,
        msg : String
    }]
});

const Chat = new mongoose.model("chat",chatSchema);

module.exports = Chat;