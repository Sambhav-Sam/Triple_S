const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const ejs = require("ejs");
const path = require("path");
const randomstring = require("randomstring");
const isAuth = require("../../routes/auth/isauth");
const UserDetail = require("../models/userDetails");
const User = require("../models/userauth");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

//transporter----------------------------------------------------------------------------------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAILID,
        pass: process.env.GMAILPASSWORD
    }
});

//it will update the coordinates of the user in the database
router.post("/setsos", async (req, res) => {
    try {
        //authenticating user
        const user = await isAuth(req);

        //fetching data from userdetail model
        const data = await UserDetail.findOne({ _id: user._id });
        if (data) {
            //if user found updating the location details
            const filter = { _id: user._id };
            const update = {
                sos: {
                    lat: req.body.lat,
                    lon: req.body.lon
                }
            };
            await UserDetail.findOneAndUpdate(filter, update);
        }
        else {
            //else creating the new user with the location details
            const newdata = await new UserDetail({
                _id: user._id,
                sos: {
                    lat: req.body.lat,
                    lon: req.body.lon
                }
            }).save();
            res.status(200).send("sos sended");

        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

//it will send the mail to the matched users in the list
router.post("/sendsosmail",async (req,res)=>{
    try {
        //authenticating user
        const user = await isAuth(req);

        //creating a sos link
        const link = randomstring.generate(30)+Date.now();

        //fetching match list of the user
        const data = await UserDetail.findOne({ _id: user._id }).select({ matches : 1 , moreDetail:{name : 1}});
        const matches = data.matches;

        //fetching name of the user
        const name = data.moreDetail.name;

        //requiring the html file
        const filepath = path.join(__dirname, "../../views/sos/sos.ejs")
        const html = await ejs.renderFile(filepath, { link: link});

        //sending the email to every user
        matches.forEach(async element => {
            const user = element.userId;
            const userdata = await User.findOne({ _id: user}).select({ email : 1 ,verify : 1});
            const useremail = userdata.email;
            const verify = userdata.verify;
            if(verify)
            {
                const mailOptions = {
                    from: 'mnnitconf@gmail.com',
                    to: useremail,
                    subject: 'sos call by '+ name,
                    html: html
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.send(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        });


        //saving the sos link in the database
        const filter = { _id: user._id };
            const update = {
                soslink: link
            };
        await UserDetail.findOneAndUpdate(filter, update);
        const result = {
            sent : 1
        }
        res.status(200).send(result);


    } catch (error) {
        console.log(error);
        res.send(error);
    }
});



router.post("/:sosId",async (req,res)=>{
    try {
        const sosId = req.params.sosId;
        const result = await UserDetail.findOne({soslink : sosId}).select({sos : 1});
        console.log(result);
        const lat = result.sos.lat;
        const lon = result.sos.lon;

        const sendData = {
            lat : lat,
            lon : lon
        }
        res.status(200).send(sendData);
        
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

module.exports = router;