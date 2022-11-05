const express = require("express");

const router = express.Router();

const mobileverification = require("./mobileverification");
const coordinates = require("./coordinates");
const userpic = require("./userdata")


router.use("/verifynumber",mobileverification);
router.use("/coordinates",coordinates);
router.use("/",userpic);


module.exports = router;
