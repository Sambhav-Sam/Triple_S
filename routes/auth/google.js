const express = require("express");
const passport = require("passport");
const passportSetup = require("../../config/passport-setup");

const router = express.Router();

//auth with google 
router.get("/",passport.authenticate('google',{
    scope:['profile','email']
}));

//callback route for google to redirect
router.get("/redirect", passport.authenticate('google'),(req,res)=>{
    res.send("you reached the callback URI");
});

module.exports = router;

