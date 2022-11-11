const express = require("express");
const bodyParser = require("body-parser");
const isAuth = require("../../routes/auth/isauth");
const Chat = require("../models/chat");



const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));


router.post("/", async (req, res) => {
    try {
        //authenticating user
        const user = await isAuth(req);
        const userid = user._id
        const message = req.body.msg;
        const roomId = req.body.roomId;
        
        const find = await Chat.findOne({roomId : roomId});
        if(find)
        {
            //update the chat data
            await Chat.findOneAndUpdate({roomId : roomId}, {$push :{chat :{userid : userid,msg : message}}});
        }
        else{
            //create a new chat window
            const newchat = new Chat ({
                roomId : roomId,
                chat : [
                    {
                        userid : userid,
                        msg : message
                    }
                ]
            });
            await newchat.save();
        }

    } catch (error) {
        console.log(error);
        res.send(error);
    }

});


module.exports = router;