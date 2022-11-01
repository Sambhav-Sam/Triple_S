const express = require("express");

const router = express.Router();

const mobileverification = require("./mobileverification");
const coordinates = require("./coordinates");
const imgverify = require("./imgverification");


router.use("/verifynumber",mobileverification);
router.use("/coordinates",coordinates);
router.use("/imgverify",imgverify);


module.exports = router;
