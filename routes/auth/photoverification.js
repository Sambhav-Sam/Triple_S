const express = require("express");

const router = express.Router();

//live photo verification
router.get("/",(req,res)=>{
    res.render("login_registeration/profileverification.ejs")
});

module.exports = router;

