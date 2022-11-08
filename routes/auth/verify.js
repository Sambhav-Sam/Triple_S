require("dotenv").config();
const express = require("express");
const nodemailer = require('nodemailer');
const ejs = require("ejs");
const path = require("path");
const randomstring = require("randomstring");
const isAuth = require("./isauth");
const VerifyUser = require("../../src/models/verification");
const User = require("../../src/models/userauth");

const router = express.Router();
router.use(express.static("public"));


//transporter----------------------------------------------------------------------------------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAILID,
        pass: process.env.GMAILPASSWORD
    }
});


router.get("/", async (req, res) => {

    try {
        const user = await isAuth(req);
        if (user) {
            const code = randomstring.generate(30);
            const id = user._id;
            const newUser = new VerifyUser({
                _id: id,
                code: code
            });
            const result = await newUser.save();
            console.log(result);
            const url = "http://localhost:3000/auth/verifyemail/" + code + id;
            console.log(url);
            const filepath = path.join(__dirname, "../../views/login_registeration/verifyemail.ejs")
            const html = await ejs.renderFile(filepath, { username: user.username, email: user.email, url: url });

            const mailOptions = {
                from: 'mnnitconf@gmail.com',
                to: user.email,
                subject: 'otp verification',
                html: html
            };
            console.log(mailOptions);

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.send(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send("a verification has been sent to your email");
                }
            });


        }
        else {
            res.status(401).send("bad request");
        }
    }
    catch (err) {
        res.status(401).send(err);
    }
});

router.get("/:verificationlink", async (req, res) => {
    try {
        const id = req.params.verificationlink;
        const code = id.substr(0, 30);
        const userId = id.slice(30);

        const data = await VerifyUser.findOne({ _id: userId });
        if(data.code===code)
        {
            const filter  = {_id : userId};
            const update = {verify : true};
            await User.findOneAndUpdate(filter, update);
            await VerifyUser.findByIdAndRemove(userId);
            res.redirect("/test");
        }
        else{
            console.log("code doesn't match");
            res.send("error occured while verifying the user");
        }
    } catch (error) {
        res.status(400).send(error);
    }


});

module.exports = router;