const express = require("express");
const bodyParser = require("body-parser");
const isAuth = require("../../routes/auth/isauth");
const upload = require("express-fileupload");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(upload());

router.post("/", async (req, res) => {
  try {
    //authenticating user
    const user = await isAuth(req);

    console.log(req.files);

  } catch (error) {
    console.log(error);
    res.send(error);
  }
});


module.exports = router;
