const express = require("express");
const bodyParser = require("body-parser");
const isAuth = require("../../routes/auth/isauth");
const axios = require('axios');
const UserDetail = require("../models/userDetails");
const findAge = require("../middleware/findage");
const distanceInKmBetweenEarthCoordinates = require("../middleware/finddistance");

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
        const userdata = await UserDetail.findOne({_id : {$ne : user._id}});
        console.log(userdata);
        const imgurl = "/uploads/" + userdata.userprofileimage.path;

        //getting our coordinates from database
        const mycoordinates = await UserDetail.findOne({ _id: user._id }).select({ location: 1 });

        //getting userAge
        const age = await findAge(userdata._id);


        //getting distance
        const distance = await distanceInKmBetweenEarthCoordinates(mycoordinates.location.lat, mycoordinates.location.lon, userdata.location.lat, userdata.location.lon);
        const resultobject = {
            imgurl: imgurl,
            userid: userdata._id,
            name: userdata.moreDetail.name,
            age: age,
            distance: distance
        }
        res.send(JSON.stringify(resultobject));

    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.post("/likeuser", async (req, res) => {
    try {
        //authenticating user
        const user = await isAuth(req);

        //getting liked user data
        const likedUserId = req.body.userid;
        const userlikedusers = await UserDetail.findOne({ _id: user._id }).select({ likedUser: 1 ,matches :1});
        userlikedusers.likedUser = userlikedusers.likedUser.concat(likedUserId);
        await userlikedusers.save();

        //cross checking the like in liked user
        const otherUser = await UserDetail.findOne({_id:likedUserId}).select({likedUser:1 , matches :1});
        const otherUserlikedlist = otherUser.likedUser.find(element => element = user._id);
        if(otherUserlikedlist)
        {
            otherUser.matches = otherUser.matches.concat(user._id);
            userlikedusers.matches = userlikedusers.matches.concat(likedUserId);
            const result1 = await otherUser.save();
            const result2 = await userlikedusers.save();
            console.log(result1);
            console.log(result2);
        }

        const result = {
            status: 200
        }
        res.send(result);


    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.post("/superlikeuser", async (req, res) => {
    try {
        //authenticating user
        const user = await isAuth(req);

        //getting superlikes data
        const sId = req.body.userid;
        const userlikedusers = await UserDetail.findOne({ _id: sId }).select({ superlikes: 1 });
        userlikedusers.superlikes = userlikedusers.superlikes.concat(user._id);
        await userlikedusers.save();

        const result = {
            status: 200
        }
        res.send(result);


    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.post("/saveuser", async (req, res) => {
    try {
        //authenticating user
        const user = await isAuth(req);

        //getting liked user data
        const saveUserId = req.body.userid;
        const viewedUsers = await UserDetail.findOne({ _id: user._id }).select({ viewedUser: 1 });
        viewedUsers.viewedUser = viewedUsers.viewedUser.concat(saveUserId);
        await viewedUsers.save();

        const result = {
            status: 200
        }
        res.send(result);

    } catch (error) {
        console.log(error);
        res.send(error);
    }
});


router.post("/getprevioususer", async (req, res) => {
    try {
        //authenticating user
        const user = await isAuth(req);

        //getting previous user seen
        const data = await UserDetail.findOne({ _id: user._id }).select({ viewedUser: { $slice: -1 } });
        if (data.viewedUser) {
            const prevUser = data.viewedUser[0];

            //deleting the previous user
            await UserDetail.updateOne({ _id: user._id }, { $pop: { viewedUser: 1 } });

            //getting users data
            const userdata = await UserDetail.findOne({ _id: prevUser });
            const imgurl = "/uploads/" + userdata.userprofileimage.path;

            //getting our coordinates from database
            const mycoordinates = await UserDetail.findOne({ _id: user._id }).select({ location: 1 });

            //getting userAge
            const age = await findAge(userdata._id);

            //getting distance
            const distance = await distanceInKmBetweenEarthCoordinates(mycoordinates.location.lat, mycoordinates.location.lon, userdata.location.lat, userdata.location.lon);

            const resultobject = {
                imgurl: imgurl,
                userid: userdata._id,
                name: userdata.moreDetail.name,
                age: age,
                distance : distance
            }
            res.send(JSON.stringify(resultobject));
        }

    } catch (error) {
        console.log(error);
        res.send(error);
    }
});


module.exports = router;