const express = require("express");
const bodyParser = require('body-parser');
const UserDetail = require("../src/models/userDetails");
const isAuth = require("./auth/isauth");
const User = require("../src/models/userauth");


const router = express.Router();
router.use(bodyParser.urlencoded({
    extended: true
}));

//cupit main page

router.get("/viewprofile", async (req, res) => {
    try {
        const user = await isAuth(req);
        if (user) {
            const data = await UserDetail.findOne({ _id: user._id }).select({ moreDetail: { name: 1 } ,messages : 1 ,matches : 1 , suscribed : 1});
            const name = data.moreDetail.name;
            const messages = data.messages.reverse();
            const suscribed = data.suscribed;

            //fetching the match users details
            const matches = data.matches;

            res.status(200).render("viewprofile/mainpage.ejs", { username: name, matches: matches ,messages : messages,suscribed:suscribed });
        }
        else {
            res.status(401).redirect("/auth/login");
        }
    }
    catch (err) {
        res.status(401).send(err);
    }
});

module.exports = router;

