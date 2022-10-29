const express = require("express");

const router = express.Router();

const mobileverification = require("./mobileverification");
const coordinates = require("./coordinates");


router.use("/verifynumber",mobileverification);
router.use("/coordinates",coordinates);


module.exports = router;
