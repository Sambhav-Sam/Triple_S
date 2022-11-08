const express = require("express");

const router = express.Router();

const login = require("./login");
const verify = require("./verify");
const photoverify = require("./photoverification");


// router.use("/google",login);
router.use("/",login);
router.use("/verifyemail",verify);
router.use("/imgverify",photoverify);


module.exports = router;
