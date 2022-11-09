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

        //fetching data from userdetail model
        const data = await UserDetail.findOne({ _id: user._id });
        if (data) {
            //if user found updating the location details
            const filter = { _id: user._id };
            const update = {
                sos: {
                    lat: req.body.latitude,
                    lon: req.body.longitude
                }
            };
            await UserDetail.findOneAndUpdate(filter, update);
        }
        else {
            //else creating the new user with the location details
            const newdata = await new UserDetail({
                _id: user._id,
                sos: {
                    lat: req.body.latitude,
                    lon: req.body.longitude
                }
            }).save();

        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});


module.exports = router;