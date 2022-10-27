const express = require("express");

const router = express.Router();

const login = require("./login");
const verify = require("./verify");


router.use("/login",login);
router.use("/verifyemail",verify);


module.exports = router;
