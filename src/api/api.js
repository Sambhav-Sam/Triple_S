const express = require("express");

const router = express.Router();

const mobileverification = require("./mobileverification");
const coordinates = require("./coordinates");
const userpic = require("./userdata");
const changeidintoname = require("./changeidintousername");
const imgverify = require("./imgverification");
const sos = require("./sos");


router.use("/verifynumber",mobileverification);
router.use("/coordinates",coordinates);
router.use("/",userpic);
router.use("/changeidintoname",changeidintoname);
router.use("/imgverify",imgverify);
router.use("/sos",sos);



module.exports = router;
