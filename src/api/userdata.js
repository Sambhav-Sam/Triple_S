const express = require("express");
const bodyParser = require("body-parser");
const isAuth = require("../../routes/auth/isauth");
const axios = require('axios');
const UserDetail = require("../models/userDetails");
const findAge = require("../middleware/findage");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post("/userpic", async (req, res) => {
    try {
        //authenticating user
        const user = await isAuth(req);

        //getting users data
        const count = await UserDetail.count().exec();
        const random = Math.floor(Math.random() * count);
        const userdata = await UserDetail.findOne().skip(random).exec();
        const imgurl = "/uploads/"+userdata.userprofileimage.path;

        //getting userAge
        const age = await findAge(userdata._id);

        const resultobject ={
            imgurl : imgurl,
            userid : userdata._id,
            name : userdata.moreDetail.name,
            age : age
        }
        res.send(JSON.stringify(resultobject));
        
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.post("/likeuser",async (req,res)=>{
    try {
        //authenticating user
        const user = await isAuth(req);

        //getting liked user data
        const likedUserId = req.body.userid;
        const userlikedusers = await UserDetail.findOne({_id : user._id}).select({likedUser: 1});
        userlikedusers.likedUser= userlikedusers.likedUser.concat(likedUserId);
        await userlikedusers.save();

        const result = {
            status : 200
        }
        res.send(result) ;
        
        
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.post("/saveuser",async (req,res)=>{
    try {
        //authenticating user
        const user = await isAuth(req);

        //getting liked user data
        const saveUserId = req.body.userid;
        const viewedUsers = await UserDetail.findOne({_id : user._id}).select({viewedUser: 1});
        viewedUsers.viewedUser= viewedUsers.viewedUser.concat(saveUserId);
        await viewedUsers.save();
        
        const result = {
            status : 200
        }
        res.send(result) ;
        
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});


router.post("/getprevioususer",async (req,res)=>{
    try {
        //authenticating user
        const user = await isAuth(req);

        //getting previous user seen
        const data = await UserDetail.findOne({_id : user._id}).select({viewedUser: {$slice : -1}});
        const prevUser = data.viewedUser[0];
        console.log(prevUser);

        //getting users data
        const userdata = await UserDetail.findOne({_id:prevUser});
        const imgurl = "/uploads/"+userdata.userprofileimage.path;

        //getting userAge
        const age = await findAge(userdata._id);

        const resultobject ={
            imgurl : imgurl,
            userid : userdata._id,
            name : userdata.moreDetail.name,
            age : age
        }
        res.send(JSON.stringify(resultobject));
        
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});


module.exports = router;