const express = require("express");
const passport = require("passport");
const passportSetup = require("../../config/passport-setup");
const createToken = require("./createtoken");

const router = express.Router();

//auth with google 
router.get("/",passport.authenticate('google',{
    scope:['profile','email']
}));

//callback route for google to redirect
router.get("/redirect", passport.authenticate('google'), async(req,res)=>{
    const token = await createToken(req.user._id);
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 6000000),
        httpOnly: true
    });
    res.redirect("/buildprofile/userdetails");
});

module.exports = router;

