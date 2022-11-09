const express = require("express");
const bodyParser = require("body-parser");
const isAuth = require("../../routes/auth/isauth");
const UserDetail = require("../models/userDetails");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.post("/", async (req, res) => {
  try {
    //authenticating user
    const user = await isAuth(req);




  } catch (error) {
    console.log(error);
    res.send(error);
  }
});


module.exports = router;
