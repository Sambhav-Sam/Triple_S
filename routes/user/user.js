const express = require("express");

const router = express.Router();

const userdetails = require("./userdetails");
const uploadProfile = require("./uploadProfile");


router.use("/userdetails",userdetails);
router.use("/uploadprofile",uploadProfile);


module.exports = router;
